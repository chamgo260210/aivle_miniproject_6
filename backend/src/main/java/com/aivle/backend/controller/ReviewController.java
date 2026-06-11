package com.aivle.backend.controller;

import com.aivle.backend.entity.Review;
import com.aivle.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 전체 리뷰 조회 또는 특정 책 리뷰 조회
    @GetMapping
    public List<Review> getReviews(@RequestParam(required = false) Long bookId) {
        return reviewService.getReviews(bookId);
    }

    // 리뷰 등록
    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    // 리뷰 수정
    @PatchMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review request) {
        return reviewService.updateReview(id, request);
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
}
