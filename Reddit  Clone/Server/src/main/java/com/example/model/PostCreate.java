package com.example.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreate {
    private String title, description;
    private String creator;

    public PostCreate(String title, String description) {
        this.title = title;
        this.description = description;
        creator = "";
    }
}
