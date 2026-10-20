const CACHE = 'family-ledger-assets-' + encodeURIComponent(self.registration.scope) + '-v1';
const ASSETS = ['./icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  // Always retrieve current HTML. Never cache Firebase traffic or financial data.
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, {cache: 'no-store'}).catch(() => new Response(
      '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>우리집 가계부</title><body style="font-family:system-ui;padding:32px;color:#213c34"><h1>인터넷 연결을 확인해 주세요</h1><p>가족 가계부를 열려면 인터넷 연결이 필요합니다.</p><button onclick="location.reload()">다시 열기</button></body></html>',
      {headers: {'Content-Type': 'text/html; charset=utf-8'}, status: 503}
    )));
    return;
  }
  const asset = ASSETS.some(path => new URL(path, self.registration.scope).href === url.href);
  if (asset) event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));}
    return response;
  }).catch(() => caches.match(event.request)));
});
