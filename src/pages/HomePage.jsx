import '../App.css';
import { Link } from 'react-router-dom';

function HomePage({ books, reviews }) {

  const topBooks = [...books]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  const topReviews = [...reviews]
  .sort((a, b) => b.likes - a.likes)
  .slice(0, 3);

  return (
    <div className="app">

      <div className="search-box">

        <input
          type="text"
          placeholder="도서 제목으로 검색..."
        />

        <button>
          검색
        </button>

      </div>

      <section className="top-book-section">

        <div className="section-title">
          <h2>월간 인기 도서</h2>
        </div>

        <div className="book-list">

          {topBooks.map((book) => (

            <div
              className="book-card"
              key={book.id}
            >

              <div className="image-wrap">

                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                />

              </div>

              <div className="book-content">

                <div className="top-row">

                  <h2>
                    {book.title}
                  </h2>

                  <div className="book-like">
                    ❤️ {book.likes}
                  </div>

                </div>

                <span className="author">
                  {book.author}
                </span>

                <p>
                  {book.content}
                </p>

                <Link
                  to={`/detail/${book.id}`}
                  className="detail-link"
                >
                  자세히 보기
                </Link>

              </div>

            </div>

          ))}

        </div>

      </section>

      <section className="review-section">

        <div className="review-title-wrap">

          <h2>
            월간 리뷰
          </h2>

        </div>

        <div className="review-list">

          {topReviews.map((review) => (

            <div
              className="review-card"
              key={review.id}
            >

              <div className="review-top">

                <div>

                  <h3>
                    {review.nickname}
                  </h3>
                  <span>
                    {
                      books.find(
                        (b) =>
                          String(b.id) ===
                          String(review.bookId)
                      )?.title
                    }
                  </span>
                </div>

                <div className="review-like">
                  ❤️ {review.likes}
                </div>
              </div>
              <p>
                {review.content}
              </p>
            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default HomePage;