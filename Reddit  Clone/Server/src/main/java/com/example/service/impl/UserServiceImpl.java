package com.example.service.impl;

import com.example.shared.Utils;
import com.example.model.UserCreate;
import com.example.repository.UserRepository;
import com.example.repository.entity.UserEntity;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    public int registerUser(UserCreate user) {
        UserEntity existing = userRepository.getUserEntityByUsernameEquals(user.getUsername());
        if (existing != null)
            return 1;

        UserEntity newUser = new UserEntity();
        newUser.setUsername(user.getUsername());
        String encryptedPwd = Utils.encrypt(user.getPassword());
        if(encryptedPwd.equals("")){
            return 2; // Something went wrong
        }
        newUser.setPassword(encryptedPwd);
        userRepository.save(newUser);
        return 0;
    }

    public String login(String username, String password) {
        UserEntity user = userRepository.getUserEntityByUsernameEquals(username);
        if (user == null)
            return null;

        String decryptedPwd = Utils.decrypt(user.getPassword());
        if( !decryptedPwd.equals(password))
            return null;

        String token = UUID.randomUUID().toString();
        user.setToken(token);
        userRepository.save(user);

        return token;
    }

    public int logout(String token) {
        UserEntity user = userRepository.getUserEntityByTokenEquals(token);
        if(user == null) return 1;

        user.setToken(null);
        userRepository.save(user);

        return 0;
    }

    public UserEntity validate(String token) {
        return userRepository.getUserEntityByTokenEquals(token);
    }
}
