const CACHE_NAME = 'shizai-management-v2';
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

// 💡 修正：フェッチイベントの制御
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Supabaseへのリクエスト（API通信）はキャッシュを探さず、常にネットワークへ流す
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch((err) => {
        // オフライン時に通信が失敗（Failed to fetch）した場合、
        // ここでエラーをキャッチして、カスタムのネットワークエラー（レスポンス）を返してあげる
        console.warn('Supabaseへの通信がオフラインのため失敗しました:', err);
        return new Response(JSON.stringify({ error: 'Offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // 2. それ以外の通常資材（index.htmlやCSSなど）は、キャッシュがあればそれを返し、なければネットワークから取得する
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
