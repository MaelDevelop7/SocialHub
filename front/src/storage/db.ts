import { openDB } from "idb";
import type { Post } from "../types";

const DB_NAME = "socialhub";
const STORE_NAME = "posts";
const API_URL = "http://localhost:3000/api/posts";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export async function getPostsFromLocal(): Promise<Post[]> {
  const db = await initDB();
  return (await db.getAll(STORE_NAME)) || [];
}

export async function savePostsLocal(posts: Post[]) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const post of posts) {
    await tx.store.put(post);
  }
  await tx.done;
}

export async function deletePostLocal(id: number) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.delete(id);
  await tx.done;
}

// Sync avec le serveur
export async function syncWithServer(): Promise<Post[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Impossible de récupérer les posts du serveur");
    const serverPosts: Post[] = await res.json();
    await savePostsLocal(serverPosts);
    return serverPosts;
  } catch (err) {
    console.error("Erreur de sync serveur :", err);
    return getPostsFromLocal();
  }
}

// Ajouter un post côté serveur + local
export async function addPost(post: Omit<Post, "id" | "createdAt">): Promise<Post | null> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Impossible d'ajouter le post");
    const newPost: Post = await res.json();
    await savePostsLocal([newPost]);
    return newPost;
  } catch (err) {
    console.error("Erreur ajout post :", err);
    return null;
  }
}

// Supprimer un post côté serveur + local
export async function deletePost(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Impossible de supprimer le post");
    await deletePostLocal(id);
    return true;
  } catch (err) {
    console.error("Erreur suppression post :", err);
    return false;
  }
}
