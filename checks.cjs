const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=__dirname;
const data=fs.readFileSync(path.join(root,'assets/data.js'),'utf8');
const app=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');
new vm.Script(app);
function context(page){const nodes={};const ctx={window:{},location:{pathname:'/repository/'+page},Intl,Date,URL,console,localStorage:{getItem:()=>null,setItem:()=>{}},document:{querySelectorAll(){return []},getElementById(id){return nodes[id]??=( {innerHTML:'',addEventListener(){}} )}}};vm.createContext(ctx);vm.runInContext(data,ctx);return {ctx,nodes}}
const {ctx}=context('index.html');const days=ctx.window.TRIP;
assert.equal(days.length,3);
assert.equal(days.reduce((n,d)=>n+d.miles,0),2576);
assert.equal(days.reduce((n,d)=>n+d.hours,0),38.25);
assert.deepEqual(Array.from(days,d=>d.date),['2026-11-23','2026-11-24','2026-11-25']);
for(const d of days){assert.equal(d.stops.reduce((n,s)=>n+Number(s.detail.match(/^(\d+)-minute/)[1]),0),d.breaks);assert.ok(fs.existsSync(path.join(root,d.slug)))}
for(const page of ['index.html','sources.html',...Array.from(days,d=>d.slug)]){const {ctx,nodes}=context(page);vm.runInContext(app,ctx);const html=nodes.app.innerHTML;assert.ok(html.includes('<main'));assert.ok(!html.includes('undefined'));assert.ok(!html.includes('PLAN A'));for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const url=match[1];if(!/^(https?:|data:)/.test(url)){assert.ok(fs.existsSync(path.join(root,url.split('#')[0])),`Missing local link: ${url}`)}}}
vm.runInContext(app,ctx);
const results=vm.runInContext('days.map(schedule)',ctx);
assert.match(results[0].start,/Mon.*3:00 AM PST/);
assert.match(results[0].end,/Mon.*6:30 PM MST/);
assert.match(results[1].start,/Tue.*4:00 AM MST/);
assert.match(results[1].end,/Tue.*6:30 PM CST/);
assert.match(results[2].end,/Wed.*10:00 PM EST/);
assert.match(results[2].late,/Thu.*12:00 AM EST/);
console.log('Passed: route totals, dates, break sums, all rendered page links, November zone conversions and midnight rollover.');
const game=require('./assets/game-core.js');
assert.equal(game.summarize(null).xp,0);
assert.equal(game.summarize({done:['1-rest','1-rest','invalid']}).xp,30);
const missions=[1,2,3].flatMap(n=>game.missions.map(m=>n+'-'+m.id));
const prep=[...Array.from({length:6},(_,i)=>'0-'+i),...[1,2,3].flatMap(n=>Array.from({length:4},(_,i)=>n+'-'+i))];
const complete=game.summarize({done:missions},prep);
assert.equal(complete.xp,480);assert.equal(complete.stamps.length,3);assert.equal(complete.level.name,'Slowroads legend');
assert.equal(game.summarize({done:missions.filter(id=>id!=='3-rest')},prep).stamps.length,2);
for(const file of ['game-core.js','quests.js'])new vm.Script(fs.readFileSync(path.join(root,'assets',file),'utf8'));
console.log('Passed: quest deduplication, invalid data filtering, 480 XP cap, ranks and reversible stamps.');
