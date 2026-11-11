/* Pure progress rules. No time, speed, GPS or distance-based rewards. */
(function(root){
 const missions=[
  {id:'rest',title:'Rest comes first',detail:'Both drivers had enough sleep, or departure was delayed to make room for it.',xp:30,icon:'☾'},
  {id:'paws',title:'Four-paw pit stops',detail:'Provided water and regular safe, leashed breaks for the husky.',xp:25,icon:'♧'},
  {id:'crew',title:'A fresh pair of hands',detail:'Rotated drivers at safe stops and stopped whenever alertness dropped.',xp:25,icon:'⇄'},
  {id:'land',title:'A good place to land',detail:'Parked safely for the night or at the destination. An earlier rest stop counts too.',xp:50,icon:'⚑'}
 ];
 const levels=[{xp:0,name:'Trail curious'},{xp:100,name:'Road companion'},{xp:250,name:'Expedition crew'},{xp:480,name:'Slowroads legend'}];
 function normalize(value){const ids=Array.isArray(value?.done)?value.done:[];return {done:[...new Set(ids)].filter(id=>/^[1-3]-(rest|paws|crew|land)$/.test(id))}}
 function summarize(value,checks=[]){const state=normalize(value);const prep=[...new Set(Array.isArray(checks)?checks:[])].filter(x=>/^(0-[0-5]|1-[0-3]|2-[0-3]|3-[0-3])$/.test(x)).length;const xp=state.done.reduce((n,id)=>n+missions.find(m=>id.endsWith('-'+m.id)).xp,0)+prep*5;const stamps=[1,2,3].filter(day=>missions.every(m=>state.done.includes(day+'-'+m.id)));const level=[...levels].reverse().find(l=>xp>=l.xp);const next=levels.find(l=>l.xp>xp);return {xp,prep,stamps,level,next,max:480,done:state.done}}
 const api={missions,levels,normalize,summarize};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoadQuest=api;
})(typeof window!=='undefined'?window:this);
