import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Post {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "posts.json");

// Lire le fichier JSON au démarrage
let posts: Post[] = [];
let currentId = 1;

const loadPosts = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      posts = JSON.parse(data);
      if (posts.length > 0) {
        currentId = Math.max(...posts.map((p) => p.id)) + 1;
      }
    }
  } catch (err) {
    console.error("Erreur lors du chargement des posts :", err);
    posts = [];
  }
};

const savePosts = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur lors de la sauvegarde des posts :", err);
  }
};

// Charger les posts au démarrage
loadPosts();

// GET - récupérer tous les posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// POST - créer un post
app.post("/api/posts", (req, res) => {
  const { author, content } = req.body;

  if (!author || !content) {
    console.error("Erreur : author et content requis");
    return res.status(400).json({ error: "author and content required" });
  }

  const newPost: Post = {
    id: currentId++,
    author,
    content,
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  savePosts();
  res.status(201).json(newPost);
});

// PUT - modifier un post
app.put("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { content } = req.body;

  const post = posts.find((p) => p.id === id);
  if (!post) {
    console.error(`Erreur : post avec id ${id} non trouvé`);
    return res.status(404).json({ error: "Post not found" });
  }

  if (!content) {
    console.error("Erreur : content manquant pour la modification");
    return res.status(400).json({ error: "content required" });
  }

  post.content = content;
  savePosts();
  res.json(post);
});

// DELETE - supprimer un post
app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const postExists = posts.some((p) => p.id === id);

  if (!postExists) {
    console.error(`Erreur : post avec id ${id} non trouvé`);
    return res.status(404).json({ error: "Post not found" });
  }

  posts = posts.filter((post) => post.id !== id);
  savePosts();
  res.status(204).send();
});

// Démarrage du serveur
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
