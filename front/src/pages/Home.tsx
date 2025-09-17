import React, { useEffect, useState } from "react";
import AddPost from "../components/AddPost";
import '../styles/Home.css';

interface Post {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Charger les posts au démarrage
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/posts");
        if (!res.ok) throw new Error("Erreur lors du chargement des posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        alert("Impossible de charger les posts");
      }
    };
    fetchPosts();
  }, []);

  // Ajout
  const handlePostAdded = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  // Suppression
  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Cliquer sur "Modifier"
  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  // Sauvegarder les modifs
  const handleEditSave = async (id: number, newContent: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!res.ok) throw new Error("Erreur lors de la modification");

      const updatedPost = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, content: updatedPost.content } : p
        )
      );

      setEditingPostId(null);
      setEditContent("");
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier le post");
    }
  };

  return (
    <div className="home">
      <h1>Fil d’actualité</h1>
      <AddPost onPostAdded={handlePostAdded} />

      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p>
              <strong>{post.author}</strong> –{" "}
              {new Date(post.createdAt).toLocaleString()}
            </p>

            {editingPostId === post.id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleEditSave(post.id, editContent)}>
                  Enregistrer
                </button>
                <button onClick={() => setEditingPostId(null)}>Annuler</button>
              </>
            ) : (
              <>
                <p>{post.content}</p>
                <button onClick={() => handleEditClick(post)}>Modifier</button>
                <button onClick={() => handlePostDeleted(post.id)}>
                  Supprimer
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
