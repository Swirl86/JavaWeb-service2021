import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Settings from "../../utils/Settings";

const serverURL = Settings.url();
const toastSettings = Settings.toastSetting();
const defaultErrorMsg = "Something went wrong!";

function CommentForm({ localData, postId, updateLocalPost }) {
    const { token } = localData;
    const [comment, setComment] = useState("");

    const createComment = (input) => {
        fetch(serverURL + `/comment/create/${postId}`, {
            method: "POST",
            headers: {
                token,
            },
            body: input,
        })
            .then((response) => {
                if (!response.ok) throw new Error(defaultErrorMsg);
                updateLocalPost();
                setComment("");
                toast.success("Comment added to post!", toastSettings);
            })
            .catch((error) => {
                toast.error("Something went wrong!", toastSettings);
                console.error("Error:", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment) return;
        createComment(comment);
    };

    const handleChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="post-container">
                <div className="post-content-wrapper">
                    <div className="comment-form form">
                        <form onSubmit={handleSubmit}>
                            <h2>Create New Comment</h2>
                            <textarea
                                type="text"
                                className="post-input-textarea"
                                name="description"
                                value={comment}
                                placeholder="Comment"
                                required
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="comment-button btn-space-left float-right"
                            >
                                COMMENT
                            </button>
                            <button
                                className="post-button post-clear-button float-right"
                                onClick={() => setComment("")}
                            >
                                CLEAR
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CommentForm;
