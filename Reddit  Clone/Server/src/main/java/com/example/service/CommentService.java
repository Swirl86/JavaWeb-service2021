package com.example.service;

import com.example.repository.entity.CommentEntity;
import com.example.repository.entity.PostEntity;

public interface CommentService {
    CommentEntity createComment(String username, long postId, String comment);

    int deleteComment(String username, PostEntity post, long commentId);

    int deleteCommentRelatedToPost(PostEntity post);
}
