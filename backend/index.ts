import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

interface Post {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

let posts: Post[] = [];
let currentId = 1;

// API pour récupérer tous les posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// API pour créer un post
app.post("/api/posts", (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: "author and content required" });
  }

  const newPost: Post = {
    id: currentId++,
    author,
    content,
    createdAt: new Date().toISOString()
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// API pour supprimer un post
app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== id);
  res.status(204).send();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
