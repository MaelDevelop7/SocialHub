import React, { useState } from "react";
import type { Post } from "../types";
import { addPost } from "../storage/db";

interface AddPostProps {
  onPostAdded: (post: Post) => void;
}

const AddPost: React.FC<AddPostProps> = ({ onPostAdded }) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!author || !content) {
      setError("Auteur et contenu obligatoires");
      return;
    }

    const newPost = await addPost({ author, content });
    if (newPost) {
      onPostAdded(newPost);
      setAuthor("");
      setContent("");
      setError(null);
    } else {
      setError("Erreur lors de l'ajout du post");
    }
  };

  return (
    <div className="add-post">
      {error && <div className="error-message">{error}</div>}
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
    </div>
  );
};

export default AddPost;
