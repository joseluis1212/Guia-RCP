// Guardianes de la Vida - Service Worker v2 con NOVA
// Cache-first para funcionar 100% offline en emergencias

const CACHE_NAME = 'guardianes-rcp-nova-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  // NOVA esencial
  './assets/guardians/NOVA/idle.webp',
  './assets/guardians/NOVA/NOVA_idle_transparente.png',
  './assets/guardians/NOVA/NOVA_idle_animado.webp',
  './assets/guardians/NOVA/step1.webp',
  './assets/guardians/NOVA/step2.webp',
  './assets/guardians/NOVA/step3.webp',
  './assets/guardians/NOVA/step4.webp',
  './assets/guardians/NOVA/step5.webp',
  './assets/guardians/NOVA/step6.webp',
  './assets/guardians/NOVA/step7.webp',
  './assets/guardians/NOVA/step8.webp',
  './assets/guardians/NOVA/step9.webp',
  './assets/guardians/NOVA/step10.webp',
  // Otros guardianes (fallback)
  './assets/guardians/Hoodie/idle.webp',
  './assets/guardians/Bunny/idle.webp',
  './assets/guardians/Pulse/idle.webp',
  './assets/guardians/Astro/idle.webp'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando NOVA offline...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => console.log('[SW] NOVA cacheado 100% offline listo'))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Borrando cache viejo', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Solo cachear GET
  if (event.request.method !== 'GET') return;
  // No cachear llamadas tel:
  if (event.request.url.startsWith('tel:')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(fetchRes => {
          // Guardar en cache dinámicamente lo nuevo
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        }).catch(() => {
          // Fallback offline: si es una imagen de guardián que no está, devolver idle de NOVA
          if (event.request.destination === 'image') {
            return caches.match('./assets/guardians/NOVA/idle.webp');
          }
        });
      })
  );
});
