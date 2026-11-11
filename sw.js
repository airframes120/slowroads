/* Bump VERSION after changing any pack file; all-or-nothing installation. */
const VERSION='offline-df03dee63c43';
const PREFIX='slowroads-pack:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const FILES=['./','index.html','day-1.html','day-2.html','day-3.html','budget.html','checklist.html','passport.html','sources.html','offline.html','manifest.webmanifest','assets/style.css','assets/app.js','assets/data.js','assets/game-core.js','assets/quests.js','assets/offline.js','assets/mark.svg','assets/desert.jpg','assets/forest.jpg','assets/coast.jpg'];
const urls=FILES.map(file=>new URL(file,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);try{await cache.addAll(urls.map(url=>new Request(url,{cache:'reload'})))}catch(error){await caches.delete(CACHE);throw error}await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='PACK_STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const results=await Promise.all(urls.map(url=>cache.match(url)));event.ports[0]?.postMessage({ready:results.every(Boolean),version:VERSION,files:results.filter(Boolean).length,total:urls.length})})())});
self.addEventListener('fetch',event=>{const req=event.request;const url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const clean=new URL(url);clean.search='';clean.hash='';if(urls.includes(clean.href)){const saved=await cache.match(clean.href);if(saved)return saved}
 try{return await fetch(req)}catch{if(req.mode==='navigate')return await cache.match(new URL('offline.html',self.registration.scope).href)||new Response('Offline pack unavailable. Open the app online once to prepare it.',{status:503,headers:{'Content-Type':'text/plain'}});return new Response('',{status:503})}})());
});
