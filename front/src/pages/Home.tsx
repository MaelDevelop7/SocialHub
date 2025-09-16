import React, { useEffect, useState } from "react";
import { getPosts, savePosts, deletePost } from "../storage/db";
import type { Post } from "../storage/db";
import AddPost from "../components/AddPost";

const API_URL = "http://localhost:3000/api/posts";

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    const loadPosts = async () => {
        // Récupérer depuis le serveur
        const res = await fetch(`${API_URL}`);
        const serverPosts: Post[] = await res.json();
        setPosts(serverPosts);
        await savePosts(serverPosts); // sauvegarde dans IndexedDB
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handlePostAdded = (post: Post) => {
        setPosts((prev) => [post, ...prev]);
    };

    const handlePostDeleted = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Impossible de supprimer le post");

            await deletePost(id); // IndexedDB
            setPosts(prev => prev.filter(post => post.id !== id));
        } catch (err: any) {
            alert(err.message || "Erreur lors de la suppression");
        }
    };

    return (
        <div className="home">
            <h1>Fil d'actualité</h1>
            <AddPost onPostAdded={handlePostAdded} onPostDeleted={handlePostDeleted} />
            <div className="posts">
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <p>
                            <strong>{post.author}</strong> - {new Date(post.createdAt).toLocaleString()}
                        </p>
                        <p>{post.content}</p>
                        <button onClick={() => handlePostDeleted(post.id)}>Supprimer</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
