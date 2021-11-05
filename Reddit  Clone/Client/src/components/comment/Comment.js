import React from "react";
import toast, { Toaster } from "react-hot-toast";

import { FaTrashAlt } from "react-icons/fa";
import IconButton from "@material-ui/core/IconButton";

import TimeUtils from "../../utils/TimeUtils";
import Settings from "../../utils/Settings";
import userIcon from "../../img/subreddit_icon.png";
const toastSettings = Settings.toastSetting();

const serverURL = Settings.url();

const Comment = ({ comment, localData, loggedIn, updateLocalPost }) => {
    const { token, username } = localData;
    let icon = Settings.avatarUrl();

    const DeleteComment = () => {
        let deleteComment = window.confirm("Are you sure you want to remove this comment?");
        if (deleteComment)
            fetch(serverURL + `/comment/delete/${comment.postId}/${comment.id}`, {
                method: "DELETE",
                headers: {
                    token,
                },
            }).then(() => {
                updateLocalPost();
                toast.success("Comment was deleted!", toastSettings);
            });
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="post-container">
                <div className="post-content-wrapper">
                    <div className="post-comment-container">
                        <div className="post-created-row">
                            <>
                                <img
                                    height="25px"
                                    style={{ borderRadius: "12px" }}
                                    src={comment.creator === username ? userIcon : icon}
                                    alt="icon"
                                />
                            </>
                            <h4 className="post-created-block">Posted by u/{comment.creator}</h4>
                            <h4 className="post-created-block">
                                {TimeUtils.timeDifference(comment.create_date)}
                            </h4>
                            {loggedIn && comment.creator === username && (
                                <>
                                    <IconButton
                                        className="post-delete-btn"
                                        disabled={!loggedIn}
                                        onClick={DeleteComment}
                                    >
                                        <FaTrashAlt />
                                    </IconButton>
                                </>
                            )}
                        </div>
                        <div className="post-comment margin-top">{comment.comment}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Comment;
