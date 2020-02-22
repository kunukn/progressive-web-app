
const dbPromise = idb.openDb('selfies-store', 1, upgradeDB => {
  if (!upgradeDB.objectStoreNames.contains('selfies')) {
      upgradeDB.createObjectStore('selfies', {keyPath: 'id'});
  }

  if (!upgradeDB.objectStoreNames.contains('sync-selfies')) {
      upgradeDB.createObjectStore('sync-selfies', {keyPath: 'id'});
  }
});

const writeData = (storeName, data) => {
  return dbPromise
      .then(db => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          store.put(data);
          return tx.complete;
      });
};

const readAllData = storeName => {
  return dbPromise
      .then(db => {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          return store.getAll();
      });
};

const dataURItoBlob= dataURI => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], {type: mimeString});
  return blob;
};
