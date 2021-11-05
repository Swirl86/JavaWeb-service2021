package com.example.controller;

import com.example.model.UserCreate;
import com.example.model.dto.UserDto;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;

@CrossOrigin()
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody UserCreate user,
                               HttpServletResponse response) {
        int code = userService.registerUser(user);
        switch (code) {
            case 1:
                response.setStatus(409);
                return "There is already a user with that username";
            case 0:
                return "User has been registered.";
            default:
                response.setStatus(500);
                return "Something went wrong.";
        }
    }

    @PostMapping("/login")
    public UserDto login(@RequestHeader("username") String username,
                         @RequestHeader("password") String password, HttpServletResponse response) {

        String token = userService.login(username, password);

        if (token == null)  // Wrong username or password
            throw new ResponseStatusException(
                    HttpStatus.NOT_ACCEPTABLE,
                    "Check your input");

        return new UserDto(username, token);
    }

    @PostMapping("/logout")
    public void login(@RequestHeader("token") String token, HttpServletResponse response) {
        if(userService.logout(token) == 1) // Wrong token
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Something went wrong.");
    }
}
