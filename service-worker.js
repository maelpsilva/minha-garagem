// Minha Garagem 5.0 — cache apenas dos recursos visuais locais.
// Não armazena respostas do Supabase, dados privados, fotos nem autenticação.
const CACHE_NAME = 'minha-garagem-static-v5';
const STATIC_FILES = ['./manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('minha-garagem-static-') && key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') return; // HTML sempre da rede: evita versão antiga e cache de sessão.
  const url = new URL(request.url);
  if (!STATIC_FILES.some(file => url.pathname === new URL(file, self.registration.scope).pathname)) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
