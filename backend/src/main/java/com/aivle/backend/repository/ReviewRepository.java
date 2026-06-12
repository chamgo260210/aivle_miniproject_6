package com.aivle.backend.repository;

import com.aivle.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

//    List<Review> findAllByOrderByUpdatedAtDesc();

//    List<Review> findByBook_IdOrderByUpdatedAtDesc(Long bookId);

    List<Review> findByBookId(Long bookId);
    List<Review> findByCreatedBy(String createdBy);

//    void deleteByBook_Id(Long bookId);

    void deleteByBookId(Long bookId);
}
