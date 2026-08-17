/**
 * ImageStore — persists image Blobs in IndexedDB.
 * Avoids the 5MB localStorage limit entirely.
 */

const DB_NAME  = 'wedding_images_v1'
const STORE    = 'images'
const VERSION  = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE)
    }
    req.onsuccess  = (e) => resolve(e.target.result)
    req.onerror    = (e) => reject(e.target.error)
  })
}

/** Save a File/Blob under a string key */
export async function saveImage(key, blob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, key)
    tx.oncomplete = () => resolve()
    tx.onerror    = (e) => reject(e.target.error)
  })
}

/** Load a Blob and return an Object URL (or null if not found) */
export async function loadImageURL(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => {
      resolve(req.result ? URL.createObjectURL(req.result) : null)
    }
    req.onerror = (e) => reject(e.target.error)
  })
}

/** Delete a stored image */
export async function deleteImage(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror    = (e) => reject(e.target.error)
  })
}

/** Get all stored keys */
export async function listImageKeys() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAllKeys()
    req.onsuccess = () => resolve(req.result)
    req.onerror   = (e) => reject(e.target.error)
  })
}
