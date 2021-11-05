import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Settings from "../../utils/Settings";

const serverURL = Settings.url();
const toastSettings = Settings.toastSetting();
const defaultInputString = { title: "", description: "" };

const PostForm = ({ localData, fetchAll }) => {
    const { token } = localData;
    const [post, setPost] = useState(defaultInputString);

    const createPost = (input) => {
        fetch(serverURL + "/post/create", {
            method: "POST",
            responseType: "text",
            headers: {
                "Content-Type": "application/json",
                token,
            },
            body: JSON.stringify({
                title: input.title,
                description: input.description,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    // Reset input state
                    setPost(defaultInputString);
                }
                return response.text();
            })
            .then((text) => {
                toast(text, toastSettings);
                fetchAll();
            })
            .catch((error) => {
                toast.error("Something went wrong!", toastSettings);
                console.error("Error:", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!post.title || !post.description) return;
        createPost(post);
    };

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container">
                <div className="post-form form">
                    <form onSubmit={handleSubmit}>
                        <h1>Create New Post</h1>
                        <input
                            type="text"
                            className="post-input"
                            name="title"
                            value={post.title}
                            placeholder="Post title"
                            required
                            onChange={handleChange}
                        />

                        <textarea
                            type="text"
                            className="post-input-textarea"
                            name="description"
                            value={post.description}
                            placeholder="Description"
                            required
                            onChange={handleChange}
                        />
                        <button type="submit" className="post-button">
                            POST
                        </button>
                        <button
                            className="post-button post-clear-button btn-space-left"
                            onClick={() => setPost(defaultInputString)}
                        >
                            CLEAR
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostForm;
