package com.example.controller;

import com.example.repository.entity.CommentEntity;
import com.example.service.CommentService;
import com.example.repository.PostRepository;
import com.example.repository.entity.PostEntity;
import com.example.service.PostService;
import com.example.repository.entity.UserEntity;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    CommentService commentService;

    @Autowired
    PostService postService;
    @Autowired
    PostRepository postRepository;

    @Autowired
    UserService userService;

    @PostMapping("/create/{postId}")
    public CommentEntity createComment(@RequestHeader("token") String token,
                             @PathVariable long postId,
                             @RequestBody String comment,
                             HttpServletResponse response) {

        if(comment.length() >= 2500)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post description is to long!");

        UserEntity user = userService.validate(token);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        PostEntity post = postService.getPostEntity(postId);
        if (post == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");

        CommentEntity newComment = commentService.createComment(user.getUsername(), post.getId(), comment);
        if(newComment == null)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!");

        post.getComments().put(newComment, newComment.getId());
        postRepository.save(post);
        return newComment;
    }

    @DeleteMapping("/delete/{postId}/{commentId}")
    public String deleteComment(@RequestHeader("token") String token,
                                @PathVariable long postId,
                                @PathVariable long commentId,
                                HttpServletResponse response) {

        UserEntity user = userService.validate(token);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        PostEntity post = postService.getPostEntity(postId);
        if (post == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");

        if (commentService.deleteComment(user.getUsername(), post, commentId) == 1) {
            return "Comment deleted";
        }

        response.setStatus(500);
        return "Something went wrong!";
    }
}
