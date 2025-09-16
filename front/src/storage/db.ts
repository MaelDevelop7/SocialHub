export interface Post {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SocialDB", 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("posts", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePosts(posts: Post[]) {
  const db = await openDB();
  const tx = db.transaction("posts", "readwrite");
  const store = tx.objectStore("posts");
  posts.forEach(post => store.put(post));
  return tx.oncomplete;
}

export async function getPosts(): Promise<Post[]> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("posts", "readonly");
    const store = tx.objectStore("posts");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deletePost(id: number) {
  const db = await openDB();
  const tx = db.transaction("posts", "readwrite");
  tx.objectStore("posts").delete(id);
  return tx.oncomplete;
}
