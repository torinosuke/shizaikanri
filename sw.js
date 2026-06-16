const CACHE_NAME = 'shizai-management-v1';
// キャッシュする資材（HTMLや外部CSS/JS）
const ASSETS = [
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// インストール時にキャッシュを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// オフライン時はキャッシュからページを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});