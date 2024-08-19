const cacheName = "App 1.0.0";
const assets = [
  "index.html",
  "script.js",
  "offline.html",
  "404.html",
  "/manifest.json",
  "logo.png",
  "icon512_rounded.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(assets).then().catch();
      })
      .catch((err) => {
        console.log(err);
      })
  );
});

self.addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches
      .match(fetchEvent.request)
      .then((response) => {
        return (
          response ||
          fetch(fetchEvent.request).catch(() => {
            return caches.match("offline.html");
          })
        );
      })
      .then((response) => {
        if (response.status === 404) {
          return caches.match("404.html");
        }
        return response;
      })
  );
});
