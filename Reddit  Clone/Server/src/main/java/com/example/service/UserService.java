package com.example.service;

import com.example.model.UserCreate;
import com.example.repository.entity.UserEntity;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    int registerUser(UserCreate user);

    String login(String username, String password);

    int logout(String token);

    UserEntity validate(String token);
}
