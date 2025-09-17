import { openDB } from "idb"; // npm i idb

const DB_NAME = "socialhub";
const STORE_NAME = "posts";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

// Récupérer les posts depuis IndexedDB
export async function getPostsFromLocal() {
  const db = await initDB();
  return (await db.getAll(STORE_NAME)) || [];
}

// Sauver les posts localement
export async function savePostsLocal(posts: any[]) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const post of posts) {
    await tx.store.put(post);
  }
  await tx.done;
}

// Sync avec le serveur
export async function syncWithServer() {
  try {
    const res = await fetch("http://localhost:3000/api/posts");
    const serverPosts = await res.json();
    await savePostsLocal(serverPosts);
    return serverPosts;
  } catch (err) {
    console.error("Erreur de sync serveur :", err);
    return getPostsFromLocal(); // fallback local
  }
}
