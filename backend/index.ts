import express from "express";
import cors from "cors";

interface Post {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // plus besoin de body-parser

let posts: Post[] = [];
let currentId = 1;

// API pour récupérer tous les posts
app.get("/api/posts", (req, res) => {
  console.log("GET /api/posts");
  res.json(posts);
});

// API pour créer un post
app.post("/api/posts", (req, res) => {
  console.log("POST /api/posts", req.body);

  if (!req.body) {
    console.error("Erreur : body manquant");
    return res.status(400).json({ error: "Body manquant" });
  }

  const { author, content } = req.body;

  if (!author || !content) {
    console.error("Erreur : author et content requis");
    return res.status(400).json({ error: "author and content required" });
  }

  const newPost: Post = {
    id: currentId++,
    author,
    content,
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  console.log("Post créé :", newPost);
  res.status(201).json(newPost);
});

// API pour supprimer un post
app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /api/posts/${id}`);

  if (isNaN(id)) {
    console.error("Erreur : ID invalide");
    return res.status(400).json({ error: "ID invalide" });
  }

  const postExists = posts.some(post => post.id === id);
  if (!postExists) {
    console.error(`Erreur : post avec id ${id} non trouvé`);
    return res.status(404).json({ error: "Post not found" });
  }

  posts = posts.filter(post => post.id !== id);
  console.log(`Post avec id ${id} supprimé`);
  res.status(204).send();
});

// Démarrage du serveur
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
