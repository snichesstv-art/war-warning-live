// 최소 서비스워커: 늘 네트워크 먼저(자료가 6시간마다 바뀜), 끊겼을 때만 마지막으로 받은 화면을 보여 줌
const C = "ww-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const k = u.pathname.endsWith("state.js") ? u.pathname : e.request; const cp = r.clone(); caches.open(C).then(c => c.put(k, cp)); }
    return r;
  }).catch(() => caches.match(u.pathname.endsWith("state.js") ? u.pathname : e.request, {ignoreSearch: true})
    .then(m => m || new Response("<meta charset=utf-8><body style='background:#0f151c;color:#e5ebf0;font-family:sans-serif;padding:24px'>인터넷에 연결되면 최신 자료를 불러옵니다.", {headers: {"Content-Type": "text/html; charset=utf-8"}}))));
});
