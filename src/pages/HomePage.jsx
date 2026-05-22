import '../App.css';
import db from '../../db.json';
import { Link } from 'react-router-dom';

function App() {

  const books = db.books;

  const topBooks = [...books]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);
{/* 리뷰 데이터가 없어서 임의 생성하여 넣었습니다. */}
  const topReviews = [
    {
      id: 1,
      user: "김민수",
      book: "돌이킬 수 있는",
      text: "몰입감이 엄청났습니다.",
      likes: 128,
    },

    {
      id: 2,
      user: "이지은",
      book: "구름 사람들",
      text: "문장이 정말 아름다워요.",
      likes: 97,
    },

    {
      id: 3,
      user: "박서준",
      book: "돼지 목에 사랑",
      text: "분위기가 너무 좋았습니다.",
      likes: 76,
    },
  ];

  return (
    <div className="app">

      {/* HERO */}
      <section className="hero">

      </section>

      {/* SEARCH */}
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

            <div className="book-card" key={book.id}>

              {/* IMAGE */}
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

                <button className="detail-btn">
                  자세히 보기
                </button>

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

            <div className="review-card" key={review.id}>

              <div className="review-top">

                <div>

                  <h3>
                    {review.user}
                  </h3>

                  <span>
                    {review.book}
                  </span>

                </div>

                <div className="review-like">
                  ❤️ {review.likes}
                </div>

              </div>

              <p>
                {review.text}
              </p>

            </div>

          ))}

        </div>

      </section>
    </div>
  );
}

export default App;
