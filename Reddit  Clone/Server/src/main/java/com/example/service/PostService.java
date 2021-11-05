package com.example.service;

import com.example.model.PostCreate;
import com.example.model.dto.PostDto;
import com.example.repository.entity.PostEntity;

import java.util.Collection;


public interface PostService {

    int createPost(PostCreate postCreate);

    Collection<PostDto> getPosts();

    int deletePost(String username, long id);

    int voteOnPost(String username, long postId, String vote);

    int updatePost(String username, long id, String title);

    PostDto getPost(String title);

    PostDto getPost(long postId);

    PostEntity getPostEntity(long postId);

    int getUserVotes(String username, long postId);
}
