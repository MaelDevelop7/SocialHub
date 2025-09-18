import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Interface TypeScript
interface Post {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ouverture de la base SQLite
let db: any;

async function initDb() {
  db = await open({
    filename: "posts.db", // fichier SQLite
    driver: sqlite3.Database,
  });

  // Création de la table si elle n’existe pas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
}
initDb();

// ----------------- ROUTES -----------------

// Récupérer tous les posts
app.get("/api/posts", async (req, res) => {
  const posts: Post[] = await db.all("SELECT * FROM posts ORDER BY id DESC");
  res.json(posts);
});

// Créer un post
app.post("/api/posts", async (req, res) => {
  const { author, content } = req.body;

  if (!author || !content) {
    console.error("Error : author et content requis");
    return res.status(400).json({ error: "author and content required" });
  }

  const createdAt = new Date().toISOString();
  const result = await db.run(
    "INSERT INTO posts (author, content, createdAt) VALUES (?, ?, ?)",
    [author, content, createdAt]
  );

  const newPost: Post = {
    id: result.lastID,
    author,
    content,
    createdAt,
  };

  res.status(201).json(newPost);
});

// Modifier un post
app.put("/api/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { content } = req.body;

  if (!content) {
    console.error("Erreur : content manquant pour la modification");
    return res.status(400).json({ error: "content required" });
  }

  const post = await db.get("SELECT * FROM posts WHERE id = ?", [id]);
  if (!post) {
    console.error(`Erreur : post avec id ${id} non trouvé`);
    return res.status(404).json({ error: "Post not found" });
  }

  await db.run("UPDATE posts SET content = ? WHERE id = ?", [content, id]);
  const updatedPost = await db.get("SELECT * FROM posts WHERE id = ?", [id]);

  res.json(updatedPost);
});

// Supprimer un post
app.delete("/api/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const post = await db.get("SELECT * FROM posts WHERE id = ?", [id]);
  if (!post) {
    console.error(`Erreur : post avec id ${id} non trouvé`);
    return res.status(404).json({ error: "Post not found" });
  }

  await db.run("DELETE FROM posts WHERE id = ?", [id]);
  res.status(204).send();
});

// Lancer le serveur
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
