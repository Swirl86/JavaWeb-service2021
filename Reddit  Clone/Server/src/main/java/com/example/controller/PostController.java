package com.example.controller;

import com.example.model.PostCreate;
import com.example.model.dto.PostDto;
import com.example.service.PostService;
import com.example.repository.entity.UserEntity;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;
import java.util.Collection;

@CrossOrigin
@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @GetMapping("/all")
    public Collection<PostDto> getPosts(HttpServletResponse response) {
        Collection<PostDto> result = postService.getPosts();

        if (result.isEmpty())
            response.setStatus(204); // No posts, table is empty

        return result;
    }

    @GetMapping("/get/{postId}")
    public PostDto getPost(@PathVariable long postId,
                           HttpServletResponse response) {


        PostDto post = postService.getPost(postId);
        if (post == null)
            response.setStatus(404);

        return post;
    }

    @GetMapping("/user-votes/{postId}")
    public int getUserVotes(
            @RequestHeader("token") String token,
            @PathVariable long postId,
            HttpServletResponse response) {

        UserEntity user = userService.validate(token);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        return postService.getUserVotes(user.getUsername(), postId);
    }

    @PostMapping("/create")
    public String createPost(@RequestHeader("token") String token,
                             @RequestBody PostCreate postCreate,
                             HttpServletResponse response) {

        if (postCreate.getTitle() == null || postCreate.getDescription() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Information missing, check your input");

        UserEntity user = userService.validate(token);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        if (postCreate.getDescription().length() >= 2500) {
            response.setStatus(400);
            return "Post description is to long!";
        }

        postCreate.setCreator(user.getUsername());

        int result = postService.createPost(postCreate);
        switch (result) {
            case 1:
                response.setStatus(409);
                return "Post already exists";
            case 0:
                return "Post has been created";
            default:
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Something went wrong.");
        }
    }

    @DeleteMapping("/delete/{postId}")
    public String deletePost(@RequestHeader("token") String token,
                             @PathVariable long postId,
                             HttpServletResponse response) {

        UserEntity user = userService.validate(token);

        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        int result = postService.deletePost(user.getUsername(), postId);

        switch (result) {
            case 2:
                response.setStatus(404);
                return "Post does not exist";
            case 1:
                response.setStatus(401);
                return "Unauthorized, could not delete the post";
            case 0:
                return "Post has been deleted";
            default:
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Something went wrong.");
        }
    }

    @PutMapping("/vote/{postId}")
    public String voteOnPost(@RequestHeader("token") String token,
                             @PathVariable long postId,
                             @RequestParam(value = "vote", defaultValue = "0") String vote,
                             HttpServletResponse response) {
        UserEntity user = userService.validate(token);

        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        int result = postService.voteOnPost(user.getUsername(), postId, vote);
        switch (result) {
            case 3:
                response.setStatus(404);
                return "Post does not exist";
            case 2:
                response.setStatus(400);
                return "Invalid vote type!";
            case 1:
                return "Vote removed from post";
            case 0:
                return "Voted " +
                        (vote.equals("-1") ? "down" : "up")
                        + " on post";
            default:
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Something went wrong.");
        }
    }

    @PatchMapping("/update/{postId}")
    public String updatePost(
            @RequestHeader("token") String token,
            @PathVariable("postId") long postId,
            @RequestBody String description,
            HttpServletResponse response) {

        UserEntity user = userService.validate(token);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized user");

        int result = postService.updatePost(user.getUsername(), postId, description);

        switch (result) {
            case 3: {
                response.setStatus(404);
                return "Post doesn't exist";
            }
            case 2: {
                response.setStatus(401);
                return "Unauthorized user";
            }
            case 1:
                return "Post updated";
            case 0: {
                response.setStatus(405);
                return "Nothing to change, same values as before";
            }
            default: {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Something went wrong.");
            }
        }
    }

}
