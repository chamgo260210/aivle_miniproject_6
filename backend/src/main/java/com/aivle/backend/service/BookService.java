package com.aivle.backend.service;

import com.aivle.backend.entity.Book;
import com.aivle.backend.exception.BookNotFoundException;
import com.aivle.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;   // Repository 가져다 씀

    // 목록 조회
    public List<Book> getBooks() {
        return bookRepository.findAll();
    }

    // 상세 조회 (없으면 에러)
    public Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    // 등록
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    // 수정 (부분수정: 넘어온 필드만 변경)
    public Book updateBook(Long id, Book newData) {
        Book book = getBook(id);                                  // 기존 책 찾고
        if (newData.getTitle() != null) book.setTitle(newData.getTitle());
        if (newData.getAuthor() != null) book.setAuthor(newData.getAuthor());
        if (newData.getContent() != null) book.setContent(newData.getContent());
        if (newData.getCoverImageUrl() != null) book.setCoverImageUrl(newData.getCoverImageUrl());
        if (newData.getTags() != null) book.setTags(newData.getTags());
        book.setUpdatedAt(LocalDateTime.now());                   // 수정 시각 갱신
        return bookRepository.save(book);                         // 다시 저장
    }

    // 삭제
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    // 표지만 수정
    public Book updateCover(Long id, String url) {
        Book book = getBook(id);
        book.setCoverImageUrl(url);
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }
}
