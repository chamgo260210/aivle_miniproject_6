package com.aivle.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping
    public String getBooks() {
        return "도서 목록";
    }

    @GetMapping("/{id}")
    public String getBook(@PathVariable Long id) {
        return "도서 상세";
    }

    @PostMapping
    public String createBook() {
        return "도서 등록";
    }

    @PatchMapping("/{id}")
    public String updateBook(@PathVariable Long id) {
        return "도서 수정";
    }

    @PatchMapping("/{id}/cover")
    public String updateCover(@PathVariable Long id) {
        return "표지 수정";
    }

    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable Long id) {
        return "도서 삭제";
    }
}