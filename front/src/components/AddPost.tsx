import React, { useState } from "react";
import { savePosts, deletePost } from "../storage/db";
import type { Post } from "../storage/db";

interface AddPostProps {
  onPostAdded: (post: Post) => void;
  onPostDeleted: (id: number) => void;
}

const API_URL = "http://localhost:3000/api/posts";

const AddPost: React.FC<AddPostProps> = ({ onPostAdded, onPostDeleted }) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!author || !content) {
      setError("Auteur et contenu sont obligatoires !");
      return;
    }

    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });

      if (!res.ok) throw new Error("Impossible de créer le post");

      const newPost: Post = await res.json();
      await savePosts([newPost]);
      onPostAdded(newPost);
      setContent("");
      setAuthor("");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'ajout du post");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Impossible de supprimer le post");

      await deletePost(id);
      onPostDeleted(id);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la suppression");
    }
  };

  return (
    <div className="add-post">
      {error && <div className="error-message" style={{ color: "red" }}>{error}</div>}

      <input
        type="text"
        placeholder="Auteur"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <textarea
        placeholder="Contenu"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleAdd}>Ajouter</button>

      {/* Exemple de bouton pour supprimer un post directement dans ce composant */}
      {/* Normalement, tu passes handleDelete depuis le parent */}
    </div>
  );
};

export default AddPost;
