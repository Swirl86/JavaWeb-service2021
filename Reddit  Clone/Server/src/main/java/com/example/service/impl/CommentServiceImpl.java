package com.example.service.impl;

import com.example.repository.CommentRepository;
import com.example.repository.entity.CommentEntity;
import com.example.service.CommentService;
import com.example.repository.PostRepository;
import com.example.repository.entity.PostEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    CommentRepository commentRepository;
    @Autowired
    PostRepository postRepository;

    public CommentEntity createComment(String username, long postId, String comment) {
        CommentEntity newComment = new CommentEntity();
        newComment.setCreator(username);
        newComment.setPostId(postId);
        newComment.setComment(comment);
        commentRepository.save(newComment);
        return newComment;
    }

    public int deleteComment(String username, PostEntity post, long commentId) {
        /*  How to remove a key from a hashmap using the value
            https://stackoverflow.com/a/50235834
        */
        // Find the one comment that match for delete
        List<CommentEntity> keys = post.getComments().keySet().stream()
                .filter(entry -> entry.getId() == commentId)
                .filter(entry -> entry.getCreator().equals(username))
                .collect(Collectors.toList());

        if(keys.size() != 0) { // Found a match for one comment created by the user
            for (CommentEntity key : keys) {
                post.getComments().remove(key, commentId);
                commentRepository.deleteById(commentId);
            }
        } else {
            return 0;  // Could not find related comment to creator
        }
        postRepository.save(post);
        return 1;
    }

    public int deleteCommentRelatedToPost(PostEntity post) {
         // Collect all comments to entity
        List<CommentEntity> keys = post.getComments().keySet().stream()
                .filter(entry -> entry.getPostId() == post.getId())
                .collect(Collectors.toList());

        if(keys.size() != 0) {
            for (CommentEntity key : keys) {
                // delete entity in post then the comment
                post.getComments().remove(key, key.getId());
                commentRepository.deleteById(key.getId());
            }
        } else {
            return 1; // Could not find related comments to post
        }
        return 0; // Success
    }
}
