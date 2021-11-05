package com.example.repository;

import com.example.repository.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Integer> {

    //private final Map<String, UserEntity> users = new HashMap<>();

   /* public UserEntity get(String name) {
        return users.get(name.toLowerCase());
    }

    public void save(UserEntity userEntity) {
        users.put(userEntity.getName().toLowerCase(), userEntity);
    }*/

    UserEntity getUserEntityByUsernameEquals(String username);
    UserEntity getUserEntityByTokenEquals(String token);
}
