package com.example.model.dto;

import com.example.repository.entity.PostEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class PostDto implements Serializable {
    private static final String MY_TIME_ZONE="Europe/Stockholm";

    private long id;
    private String title;
    private String description;
    private String creator;

    @JsonProperty("vote_value")
    private int voteValue;

    private List<CommentDto> comments;

    @JsonProperty("create_date")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone=MY_TIME_ZONE)
    private Date createDate;

    @JsonProperty("modify_date")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone=MY_TIME_ZONE)
    private Date modifyDate;

    public PostDto(PostEntity post, int voteValue, List<CommentDto> comments) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.creator = post.getCreator();
        this.voteValue = voteValue;
        this.comments = comments;
        this.createDate = post.getCreateDate();
        this.modifyDate = post.getModifyDate();
    }
}
