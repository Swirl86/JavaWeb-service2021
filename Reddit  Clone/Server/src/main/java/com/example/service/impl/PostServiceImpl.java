package com.example.service.impl;

import com.example.model.dto.CommentDto;
import com.example.service.CommentService;
import com.example.model.PostCreate;
import com.example.model.dto.PostDto;
import com.example.repository.PostRepository;
import com.example.repository.entity.PostEntity;
import com.example.service.PostService;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserService userService;

    @Autowired
    CommentService commentService;

    public int createPost(PostCreate postCreate) {
        PostEntity post = new PostEntity();
        post.setTitle(postCreate.getTitle());
        post.setDescription(postCreate.getDescription());
        post.setCreator(postCreate.getCreator());
        postRepository.save(post);
        return 0;
    }

    public Collection<PostDto> getPosts() {
        return postRepository.findAll()
                .stream()
                .map(post -> new PostDto(
                        post,
                        getVoteValue(post),
                        (post.getComments().keySet().stream()
                                .map(CommentDto::new)
                                .collect(Collectors.toList()))
                ))
                .collect(Collectors.toList());
    }

    public PostDto getPost(String title) {
        PostEntity post = postRepository.findByTitle(title);
        return new PostDto(post,
                getVoteValue(post),
                (post.getComments().keySet().stream()
                        .map(CommentDto::new)
                        .collect(Collectors.toList())));
    }
    public PostDto getPost(long postId) {
        PostEntity post = postRepository.getPostEntityById(postId);
        return new PostDto(post,
                getVoteValue(post),
                (post.getComments().keySet().stream()
                        .map(CommentDto::new)
                        .collect(Collectors.toList())));
    }

    public PostEntity getPostEntity(long postId) {
        return postRepository.getPostEntityById(postId);
    }

    public int getUserVotes(String username, long postId) {
        PostEntity post = postRepository.getPostEntityById(postId);
        if (post == null)
            return 0;

        if(post.getVotes().containsKey(username)) {
            return post.getVotes().get(username);
        }
        return 0;
    }

    public int deletePost(String username, long id) {
        PostEntity post = postRepository.getPostEntityById(id);

        if (post == null)
            return 2;

        if (!username.equals(post.getCreator()))
            return 1;

        // Delete related comments
        // Make sure to check if there are comments, if no comments move on to delete post
        if(post.getComments().size() != 0 &&
                commentService.deleteCommentRelatedToPost(post) == 1)
            return 3;

        postRepository.delete(post);
        return 0;
    }

    public int voteOnPost(String username, long postId, String vote) {
        PostEntity post = postRepository.getPostEntityById(postId);
        int voteValue = Integer.parseInt(vote);

        if (post == null)
            return 3;

        if (!vote.equals("-1") && !vote.equals("1"))
            return 2;

        // Update vote or add new one
        if (post.getVotes().containsKey(username)) {
            boolean sameVote = post.getVotes().get(username) == voteValue;
            if (sameVote) {
                // If you click two times on same vote you will "un-vote"
                post.getVotes().remove(username);
                postRepository.save(post);
                return 1;
            } else {
                post.getVotes().put(username, voteValue);
                postRepository.save(post);
                return 0;
            }
        } else {
            post.getVotes().put(username, voteValue);
            postRepository.save(post);
            return 0;
        }
    }

    public int updatePost(String username, long id, String description) {

        PostEntity postCheck = postRepository.getPostEntityById(id);
        if (postCheck == null) {
            return 3;
        }

        if (!postCheck.getCreator().equals(username)) {
            return 2;
        }

        boolean ifChange = false;
        if (description != null && !description.equals(postCheck.getDescription())) {
            postCheck.setDescription(description);
            postRepository.save(postCheck);
            return 1;
        }

        return 0;
    }

    public int getVoteValue(PostEntity post) {
        return getUpVotes(post) - getDownVotes(post);
    }

    public int getUpVotes(PostEntity post) {
        return (int) post.getVotes().values().stream().filter(v -> v == 1).count();
    }

    public int getDownVotes(PostEntity post) {
        return (int) post.getVotes().values().stream().filter(v -> v == -1).count();
    }

}
