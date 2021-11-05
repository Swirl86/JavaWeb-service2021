import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import { FaArrowUp, FaArrowDown, FaTrashAlt, FaEdit } from "react-icons/fa";
import IconButton from "@material-ui/core/IconButton";

import Comment from "../comment/Comment";
import CommentForm from "../comment/CommentForm";
import TimeUtils from "../../utils/TimeUtils";
import Settings from "../../utils/Settings";
import userIcon from "../../img/subreddit_icon.png";

const serverURL = Settings.url();
const toastSettings = Settings.toastSetting();
const defaultErrorMsg = "Something went wrong!";

const PostDetails = ({ post, localData, loggedIn, changeView, fetchAll }) => {
    const { token, username } = localData;
    const [localPost, setLocalPost] = useState(post);
    const [voteOption, setVoteOption] = useState(0);
    const [voteValue, setVoteValue] = useState(localPost.vote_value);
    const [editMode, setEditMode] = useState(false);
    const [editPost, setEditPost] = useState(localPost.description);

    const { comments } = localPost;

    let icon = Settings.avatarUrl();

    const updateLocalPost = useCallback(() => {
        fetch(serverURL + `/post/get/${localPost.id}`, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) throw new Error(defaultErrorMsg);
                return response.json();
            })
            .then((data) => {
                setLocalPost(data);
                fetchAll();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [localPost.id, fetchAll]);

    const getVotedOnPostStatus = useCallback(() => {
        if (loggedIn) {
            fetch(serverURL + `/post/user-votes/${localPost.id}`, {
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
                    setVoteOption(parseInt(data));
                })
                .catch((error) => {
                    toast.error("Could not fetch votes!", toastSettings);
                    console.error("Error:", error);
                });
        }
    }, [loggedIn, localPost.id, token]);

    useEffect(() => {
        getVotedOnPostStatus();
    }, [getVotedOnPostStatus, updateLocalPost]);

    const voteOnPost = (voted) => {
        if (!voted) return;

        fetch(serverURL + `/post/vote/${localPost.id}?vote=${voted}`, {
            method: "PUT",
            responseType: "text",
            headers: {
                token,
            },
        }).then(() => {
            fetchAll();
            if ((voted === 1 && voteOption === 1) || (voted === -1 && voteOption === -1)) {
                setVoteValue(voteValue + voted * -1);
                setVoteOption(0);
            } else {
                voteOption === 0
                    ? setVoteValue(voteValue + voted)
                    : setVoteValue(voteValue + voted + voted);
                setVoteOption(voted);
            }
        });
    };

    const deletePost = () => {
        let deletePost = window.confirm("Are you sure you want to remove this post?");
        if (deletePost)
            fetch(serverURL + `/post/delete/${localPost.id}`, {
                method: "DELETE",
                headers: {
                    token,
                },
            }).then(() => {
                fetchAll();
                changeView("");
            });
    };

    const updatePost = () => {
        fetch(serverURL + `/post/update/${localPost.id}`, {
            method: "PATCH",
            responseType: "text",
            headers: {
                token,
            },
            body: editPost,
        })
            .then((response) => {
                if (response.status === 404 || response.status === 500) {
                    setEditPost.error(localPost.description);
                    toast.error("Something went wrong!", toastSettings);
                }
                return response.text();
            })
            .then((msg) => {
                toast.success(msg, toastSettings);
                setEditMode(false);
            });
    };

    const handleChange = (e) => {
        setEditPost(e.target.value);
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="post-container">
                <div className="post-details-wrapper">
                    <div className="post-vote-wrapper">
                        <IconButton
                            className="post-up-vote"
                            disabled={!loggedIn}
                            onClick={() => voteOnPost(1)}
                            color={voteOption === 1 ? "secondary" : "default"}
                        >
                            <FaArrowUp />
                        </IconButton>

                        <div className="post-vote-value">{voteValue}</div>

                        <IconButton
                            className="post-down-vote"
                            disabled={!loggedIn}
                            onClick={() => voteOnPost(-1)}
                            color={voteOption === -1 ? "primary" : "default"}
                        >
                            <FaArrowDown />
                        </IconButton>
                    </div>

                    <div className="post-content-wrapper">
                        <div className="post-created-row">
                            <>
                                <img
                                    height="25px"
                                    src={localPost.creator === username ? userIcon : icon}
                                    alt="icon"
                                />
                                <h4>r/reddit-clone</h4>
                            </>
                            <h5 className="post-created-block">Posted by u/{localPost.creator}</h5>
                            <h5 className="post-created-block">
                                {TimeUtils.timeDifference(localPost.create_date)}
                            </h5>
                            {loggedIn && localPost.creator === username && (
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

                        <h3 className="post-title">{localPost.title}</h3>

                        {editMode ? (
                            <>
                                <textarea
                                    className="post-description-edit"
                                    type="text"
                                    name="description"
                                    value={editPost}
                                    required
                                    onChange={handleChange}
                                />
                                <div style={{ float: "right" }}>
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
                            <div className="post-description-details">{editPost}</div>
                        )}
                    </div>
                </div>
            </div>
            {loggedIn && (
                <CommentForm
                    localData={localData}
                    postId={localPost.id}
                    updateLocalPost={updateLocalPost}
                />
            )}
            {comments !== undefined && comments.length > 0 && comments && (
                <h3 className="comment-title">Comments</h3>
            )}
            {comments
                .sort((a, b) => b.create_date.localeCompare(a.create_date))
                .map((comment, index) => (
                    <Comment
                        key={index}
                        comment={comment}
                        localData={localData}
                        loggedIn={loggedIn}
                        updateLocalPost={updateLocalPost}
                    />
                ))}
        </>
    );
};

export default PostDetails;
