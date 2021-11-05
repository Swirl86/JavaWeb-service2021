package com.example.repository.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Entity(name = "users")
public class UserEntity implements Serializable {
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false, unique = true)
    private int id;

    @Column(length = 50, nullable = false)
    private String username;
    @Column(length = 50, nullable = false)
    private String password;
    @Column
    private String token;
}
