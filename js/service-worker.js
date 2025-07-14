/**
 * Balanced Diet Recommendation System for Rwandan Parents
 * Service Worker for Offline Functionality
 */

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const CACHE_NAME = "balanced-diet-cache-v2";

// Get the base path dynamically
const getBasePath = () => {
  const path = self.location.pathname;
  const basePath = path.substring(0, path.lastIndexOf('/js/service-worker.js'));
  return basePath || '';
};

const BASE_PATH = getBasePath();

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/home.html`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/budget.html`,
  `${BASE_PATH}/children.html`,
  `${BASE_PATH}/dashboard.html`,
  `${BASE_PATH}/login.html`,
  `${BASE_PATH}/signup.html`,
  `${BASE_PATH}/css/style.css`,
  `${BASE_PATH}/js/main.js`,
  `${BASE_PATH}/js/api.js`,
  `${BASE_PATH}/js/auth.js`,
  `${BASE_PATH}/js/diet-analysis.js`,
  `${BASE_PATH}/js/budget-recommendations.js`,
  `${BASE_PATH}/js/children-recommendations.js`,
  `${BASE_PATH}/js/dashboard.js`,
  `${BASE_PATH}/js/search.js`,
  `${BASE_PATH}/js/groceries-language-toggle.js`,
  `${BASE_PATH}/js/budget-language-toggle.js`,
  `${BASE_PATH}/js/home-language-toggle.js`,
  `${BASE_PATH}/js/language-toggle.js`,
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("Opened cache:", CACHE_NAME);
      console.log("Base path:", BASE_PATH);

      // Cache files individually to handle failures gracefully
      const cachePromises = urlsToCache.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log("Cached:", url);
          } else {
            console.warn("Failed to cache (not found):", url);
          }
        } catch (error) {
          console.warn("Failed to cache (error):", url, error.message);
        }
      });

      await Promise.allSettled(cachePromises);
      console.log("Service Worker installation complete");
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("Existing caches:", cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Service Worker activated");
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Only handle requests for our app (skip external resources)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        console.log("Serving from cache:", event.request.url);
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Open cache and store response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If fetch fails, try to return a fallback page
          if (event.request.url.indexOf(".html") > -1) {
            return caches.match(`${BASE_PATH}/index.html`);
          }
        });
    })
  );
});
