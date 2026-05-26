import { useNavigate } from "react-router-dom";

const FALLBACK_COVER = "https://placehold.co/360x480?text=No+Cover";

function BookHomeItem({ book, reviewCount = 0, onLike }) {
  const navigate = useNavigate();

  function handleLikeClick(event) {
    event.stopPropagation();
    onLike(book);
  }

  return (
    <article
      className="home-book-card"
      onClick={() => navigate(`/books/${book.id}`)}
    >
      <img
        src={book.coverImageUrl || FALLBACK_COVER}
        alt={book.title}
        className="home-book-cover"
      />

      <div className="home-book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>

        <div className="card-meta">
          <button className="mini-like-button" onClick={handleLikeClick}>
            ❤️ {book.likes ?? 0}
          </button>
          <span>리뷰 {reviewCount}</span>
        </div>
      </div>
    </article>
  );
}

export default BookHomeItem;
