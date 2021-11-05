import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaArrowUp, FaArrowDown, FaTrashAlt, FaEdit, FaCommentAlt } from "react-icons/fa";
import IconButton from "@material-ui/core/IconButton";

import TimeUtils from "../../utils/TimeUtils";
import Settings from "../../utils/Settings";
import userIcon from "../../img/subreddit_icon.png";

const serverURL = Settings.url();
const toastSettings = Settings.toastSetting();
const defaultErrorMsg = "Something went wrong!";

const Post = ({ post, localData, setDetailsPost, changeCurrentView, loggedIn, fetchAll }) => {
    const { token, username } = localData;
    const [clicked, setClicked] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [editPost, setEditPost] = useState(post.description);

    let icon = Settings.avatarUrl();

    const getVotedOnPostStatus = useCallback(() => {
        if (loggedIn) {
            fetch(serverURL + `/post/user-votes/${post.id}`, {
                method: "GET",
                headers: {
                    token,
                },
            })
                .then((response) => {
                    if (!response.ok) throw new Error(defaultErrorMsg);
                    return response.text();
                })
                .then((data) => {
                    setClicked(parseInt(data));
                })
                .catch((error) => {
                    toast.error("Could not fetch votes!", toastSettings);
                    console.error("Error:", error);
                });
        }
    }, [loggedIn, post.id, token]);

    useEffect(() => {
        getVotedOnPostStatus();
    }, [getVotedOnPostStatus]);

    const voteOnPost = (voteValue) => {
        if (!voteValue) return;
        fetch(serverURL + `/post/vote/${post.id}?vote=${voteValue}`, {
            method: "PUT",
            headers: {
                token,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(defaultErrorMsg);
            })
            .catch((error) => {
                toast.error(defaultErrorMsg, toastSettings);
                console.error("Error:", error);
            })
            .then(() => {
                fetchAll();
            });
    };

    const deletePost = () => {
        let deletePost = window.confirm("Are you sure you want to remove this post?");
        if (deletePost)
            fetch(serverURL + `/post/delete/${post.id}`, {
                method: "DELETE",
                headers: {
                    token,
                },
            }).then((response) => {
                if (response.status < 400) {
                    toast.success("Post has been deleted!", toastSettings);
                    fetchAll();
                } else {
                    toast.error("Something went wrong!", toastSettings);
                }
            });
    };

    const updatePost = () => {
        fetch(serverURL + `/post/update/${post.id}`, {
            method: "PATCH",
            responseType: "text",
            headers: {
                token,
            },
            body: editPost,
        })
            .then((response) => {
                return response.text();
            })
            .then((msg) => {
                toast.success(msg, toastSettings);
                setEditMode(false);
                fetchAll();
            })
            .catch((error) => {
                toast.error("Could not update post!", toastSettings);
                console.error("Error:", error);
            });
    };

    const handleChange = (e) => {
        setEditPost(e.target.value);
    };

    const handleClickDetails = () => {
        setDetailsPost(post);
        changeCurrentView("DetailsView");
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="post-container">
                <div className="post-wrapper">
                    <div className="post-vote-wrapper">
                        <IconButton
                            className="post-up-vote"
                            disabled={!loggedIn}
                            onClick={() => voteOnPost(1)}
                            color={clicked === 1 ? "secondary" : "default"}
                        >
                            <FaArrowUp />
                        </IconButton>

                        <div className="post-vote-value">{post.vote_value}</div>

                        <IconButton
                            className="post-down-vote"
                            disabled={!loggedIn}
                            onClick={() => voteOnPost(-1)}
                            color={clicked === -1 ? "primary" : "default"}
                        >
                            <FaArrowDown />
                        </IconButton>
                    </div>

                    <div className="post-content-wrapper">
                        <div className="post-created-row">
                            <>
                                <img
                                    height="25px"
                                    src={post.creator === username ? userIcon : icon}
                                    alt="icon"
                                />
                                <h4>r/reddit-clone</h4>
                            </>
                            <h5 className="post-created-block">Posted by u/{post.creator}</h5>
                            <h5 className="post-created-block">
                                {TimeUtils.timeDifference(post.create_date)}
                            </h5>
                            {loggedIn && post.creator === username && (
                                <>
                                    <IconButton
                                        className="post-delete-btn"
                                        disabled={!loggedIn}
                                        onClick={deletePost}
                                    >
                                        <FaTrashAlt />
                                    </IconButton>

                                    <IconButton
                                        className="post-edit-btn"
                                        disabled={!loggedIn}
                                        onClick={() => setEditMode(!editMode)}
                                    >
                                        <FaEdit />
                                    </IconButton>
                                </>
                            )}
                        </div>
                        <div id="post-information-container">
                            <h3 className="post-title" onClick={() => handleClickDetails()}>
                                {post.title}
                            </h3>

                            {editMode ? (
                                <>
                                    <textarea
                                        className="post-description-edit"
                                        type="text"
                                        name="description"
                                        value={editPost}
                                        required
                                        onChange={handleChange}
                                        style={{ textAlign: "left" }}
                                    />

                                    <div className="float-right">
                                        <button
                                            className="post-button post-clear-button"
                                            onClick={() => setEditMode(false)}
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            className="post-button btn-space-left"
                                            onClick={updatePost}
                                        >
                                            SAVE
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="post-description fade" onClick={handleClickDetails}>
                                    {post.description}
                                </div>
                            )}
                        </div>
                        <div className="post-created-row">
                            <FaCommentAlt />
                            <h4>{post.comments.length}</h4>
                            <h5>
                                COMMENT
                                {post.comments.length !== 1 ? "S" : ""}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Post;
