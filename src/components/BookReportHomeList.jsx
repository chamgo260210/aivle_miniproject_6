import BookReportHomeItem from "./BookReportHomeItem.jsx";

function BookReportHomeList({
  reviews = [],
  books = [],
  onReviewClick,
  onLike,
  onEdit,
  onDelete,
}) {
  const topReviews = [...reviews]
    .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
    .slice(0, 10);

  function getBookTitle(review) {
    if (review.bookTitle) {
      return review.bookTitle;
    }

    const matchedBook = books.find(
      (book) => Number(book.id) === Number(review.bookId)
    );

    return matchedBook ? matchedBook.title : "알 수 없는 도서";
  }

  return (
    <section className="section">
      <h2>인기 리뷰 TOP 10</h2>

      <div className="review-list">
        {topReviews.length === 0 ? (
          <p className="empty-text">아직 등록된 리뷰가 없습니다.</p>
        ) : (
          topReviews.map((review) => (
            <BookReportHomeItem
              key={review.id}
              review={review}
              bookTitle={getBookTitle(review)}
              onClick={() => onReviewClick(review)}
              onLike={(event) => onLike(event, review)}
              onEdit={(event) => onEdit(event, review)}
              onDelete={(event) => onDelete(event, review)}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default BookReportHomeList;
