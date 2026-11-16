const APP_VERSION='1.1.3';
const CACHE='trainingsplan-v1.1.3';
const ASSETS=['./','./index.html','./styles.css?v=1.1.3','./config.js?v=1.1.3','./app.js?v=1.1.3','./manifest.webmanifest?v=1.1.3','./icon-180.png?v=1.1.3','./icon-192.png?v=1.1.3','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(a=>Promise.all(a.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{let q=r.clone();caches.open(CACHE).then(c=>c.put(e.request,q));return r}).catch(()=>caches.match(e.request)))});
