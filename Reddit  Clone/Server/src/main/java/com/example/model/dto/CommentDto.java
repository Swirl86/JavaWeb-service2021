package com.example.model.dto;

import com.example.repository.entity.CommentEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
public class CommentDto implements Serializable {
    private static final String MY_TIME_ZONE="Europe/Stockholm";

    private long id;
    private long postId;
    private String comment;
    private String creator;

    @JsonProperty("create_date")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone=MY_TIME_ZONE)
    private Date createDate;

    public CommentDto(CommentEntity comment) {
        this.id = comment.getId();
        this.postId = comment.getPostId();
        this.comment = comment.getComment();
        this.creator = comment.getCreator();
        this.createDate = comment.getCreateDate();
    }
}
