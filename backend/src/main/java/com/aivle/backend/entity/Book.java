package com.aivle.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    private Long userId;          // 나중에 fk지정

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String author;

    @NotBlank
    @Lob @Column(columnDefinition = "TEXT")
    private String content;

    @Lob @Column(columnDefinition = "TEXT")
    private String coverImageUrl;

    // @ElementCollection(fetch = FetchType.EAGER)
    // private List<String> tags;     // 프론트 태그 필터용 (json-server 호환)

    private Integer likes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> tags = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.likes == null) this.likes = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
