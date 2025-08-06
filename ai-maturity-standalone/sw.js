// Service Worker for AI Maturity Assessment
const CACHE_NAME = 'ai-maturity-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Resources to cache
const CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/working-app.html',
  '/utils/storage.js',
  '/utils/analytics.js',
  '/utils/privacy.js',
  '/utils/loadingManager.js',
  '/utils/networkManager.js',
  '/utils/resourceOptimizer.js',
  '/components/StandaloneAssessment.js',
  '/components/StandaloneErrorBoundary.js',
  '/components/SEOHead.js',
  '/components/PrivacyNotice.js',
  '/assets/styles.css',
  'https://resource.trickle.so/vendor_lib/unpkg/react@18/umd/react.production.min.js',
  'https://resource.trickle.so/vendor_lib/unpkg/react-dom@18/umd/react-dom.production.min.js',
  'https://resource.trickle.so/vendor_lib/unpkg/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching resources');
        return cache.addAll(CACHE_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache resources', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('Service Worker: Network request failed', event.request.url, error);
            
            // Return offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/working-app.html') || caches.match('/index.html');
            }

            // Return offline response for API requests
            if (event.request.url.includes('/api/')) {
              return new Response(
                JSON.stringify({
                  error: 'offline',
                  message: '当前处于离线状态，请稍后重试'
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
            }

            // For other requests, throw the error
            throw error;
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalyticsData());
  } else if (event.tag === 'storage-sync') {
    event.waitUntil(syncStorageData());
  }
});

// Sync analytics data when back online
async function syncAnalyticsData() {
  try {
    // Get offline analytics data from IndexedDB or localStorage
    const offlineData = await getOfflineAnalyticsData();
    
    if (offlineData.length > 0) {
      console.log('Service Worker: Syncing analytics data', offlineData.length);
      
      // Send data to analytics service
      for (const data of offlineData) {
        try {
          await sendAnalyticsData(data);
          await markAnalyticsDataSynced(data.id);
        } catch (error) {
          console.error('Service Worker: Failed to sync analytics data', error);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Analytics sync failed', error);
  }
}

// Sync storage data when back online
async function syncStorageData() {
  try {
    console.log('Service Worker: Syncing storage data');
    // Implement storage sync logic here
  } catch (error) {
    console.error('Service Worker: Storage sync failed', error);
  }
}

// Get offline analytics data
async function getOfflineAnalyticsData() {
  // This would typically use IndexedDB
  // For now, return empty array
  return [];
}

// Send analytics data
async function sendAnalyticsData(data) {
  const response = await fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Analytics sync failed: ${response.status}`);
  }
  
  return response;
}

// Mark analytics data as synced
async function markAnalyticsDataSynced(id) {
  // Implementation would mark data as synced in IndexedDB
  console.log('Service Worker: Marked analytics data as synced', id);
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'AI成熟度评估工具有新的更新',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看更新',
        icon: '/icon-explore.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AI成熟度评估工具', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  console.log('Service Worker: Periodic sync', event.tag);
  
  if (event.tag === 'analytics-cleanup') {
    event.waitUntil(cleanupAnalyticsData());
  }
});

// Cleanup old analytics data
async function cleanupAnalyticsData() {
  try {
    console.log('Service Worker: Cleaning up analytics data');
    // Implementation would clean up old analytics data
  } catch (error) {
    console.error('Service Worker: Analytics cleanup failed', error);
  }
}

// Error handling
self.addEventListener('error', event => {
  console.error('Service Worker: Error', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled rejection', event.reason);
});

console.log('Service Worker: Script loaded');