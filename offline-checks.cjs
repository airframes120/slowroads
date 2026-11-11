const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
async function run(){
 const events={},store=new Map();let online=true,claimed=false;const removed=[];
 const cache={async addAll(requests){for(const r of requests)store.set(r.url,new Response(r.url))},async match(input){return store.get(typeof input==='string'?input:input.url)}};
 const context={URL,Request,Response,caches:{open:async()=>cache,keys:async()=>['other-app','slowroads-pack:https://trip.test/repo/:old'],delete:async name=>{removed.push(name);return true}},fetch:async req=>{if(!online)throw Error('No network');return new Response('network')},self:{registration:{scope:'https://trip.test/repo/'},location:{origin:'https://trip.test'},clients:{claim:async()=>{claimed=true}},skipWaiting:async()=>{},addEventListener:(name,fn)=>events[name]=fn}};
 vm.createContext(context);vm.runInContext(source,context);
 const files=vm.runInContext('FILES',context);for(const file of files)assert.ok(fs.existsSync(path.join(__dirname,file)),file);
 let pending;events.install({waitUntil:p=>pending=p});await pending;assert.equal(store.size,files.length);
 events.activate({waitUntil:p=>pending=p});await pending;assert.ok(claimed);assert.deepEqual(removed,['slowroads-pack:https://trip.test/repo/:old']);
 let status;events.message({data:{type:'PACK_STATUS'},ports:[{postMessage:x=>status=x}],waitUntil:p=>pending=p});await pending;assert.equal(status.ready,true);
 online=false;for(const file of files){let response;events.fetch({request:{url:new URL(file,'https://trip.test/repo/').href,method:'GET',mode:file.endsWith('.html')?'navigate':'cors'},respondWith:p=>response=p});assert.ok(response);assert.equal((await response).status,200,file)}
 let response;events.fetch({request:{url:'https://trip.test/repo/missing-page',method:'GET',mode:'navigate'},respondWith:p=>response=p});assert.equal(await (await response).text(),'https://trip.test/repo/offline.html');
 let intercepted=false;events.fetch({request:{url:'https://maps.google.com/',method:'GET'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
 store.delete('https://trip.test/repo/assets/coast.jpg');events.message({data:{type:'PACK_STATUS'},ports:[{postMessage:x=>status=x}],waitUntil:p=>pending=p});await pending;assert.equal(status.ready,false);
 console.log('Passed: every offline pack file exists, subpath caching, offline page/image responses, fallback, readiness detects missing files, cleanup preserves other apps.');
}
run().catch(error=>{console.error(error);process.exitCode=1});
