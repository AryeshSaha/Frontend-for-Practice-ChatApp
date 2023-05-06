self.addEventListener("push", (e) => {
  console.log("Service worker loaded");
  const data = e.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

const OFFLINE_PAGE_URL = "/Pages/Home/Offline.jsx";

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        return caches.match(OFFLINE_PAGE_URL);
      })
  );
});
const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = ["/", "/Pages/Home/Offline.jsx"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => error)
  );
});
