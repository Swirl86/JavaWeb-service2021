package com.example.repository.entity;

import com.example.repository.entity.CommentEntity;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Map;

@Getter
@Setter
@Entity(name = "posts")
public class PostEntity implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false)
    private long id;

    @Column(length = 250, nullable = false)
    private String title;
    @Column(length = 2500, nullable = false)
    private String description;
    @Column(nullable = false)
    private String creator;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date")
    private Date createDate;

    @ElementCollection
    @Column
    private Map<String, Integer> votes;

    @ElementCollection
    @Column
    private Map<CommentEntity, Long> comments;

    // TODO Test FE for modify_date
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modify_date")
    private Date modifyDate;

}
