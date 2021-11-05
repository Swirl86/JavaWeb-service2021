package com.example.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    String username;
    String token;

    public UserDto(String username, String token) {
        this.username = username;
        this.token = token;
    }
}
