// Utility helpers to clear service workers, caches and specific localStorage keys
export async function clearAllCachesAndReload({ keysToRemove = [] } = {}) {
  try {
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map(r => r.unregister()))
      console.log('Unregistered service workers:', regs.length)
    }

    // Delete all caches
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k)))
      console.log('Deleted caches:', keys)
    }

    // Clear requested localStorage keys
    for (const k of keysToRemove) {
      try { localStorage.removeItem(k) } catch (e) { /* ignore */ }
    }

    // Small delay to ensure things settle, then reload
    setTimeout(() => {
      window.location.reload(true)
    }, 200)
  } catch (err) {
    console.error('Error clearing caches:', err)
  }
}
