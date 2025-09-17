import React, { useEffect, useState } from "react";
import AddPost from "../components/AddPost";
import type { Post } from "../types";
import { syncWithServer, deletePost } from "../storage/db";
import '../styles/Home.css';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const syncedPosts = await syncWithServer();
      setPosts(syncedPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const handlePostAdded = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handlePostDeleted = async (id: number) => {
    const success = await deletePost(id);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Erreur lors de la suppression du post");
    }
  };
  

  return (
    <div className="home">
      <h1>SocialHub</h1>
      <AddPost onPostAdded={handlePostAdded} />
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="posts">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <p>
                <strong>{post.author}</strong> - {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>{post.content}</p>
              <button onClick={() => handlePostDeleted(post.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
