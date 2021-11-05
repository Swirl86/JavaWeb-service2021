package com.example.repository;

import com.example.repository.entity.PostEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends CrudRepository<PostEntity, Long> {

    PostEntity getPostEntityById(long id);

    List<PostEntity> findAll();

    PostEntity findByTitle(String title);
}
