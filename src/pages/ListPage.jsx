import { Link } from 'react-router-dom';
import db from '../../db.json';

function ListPage() {

  const books = db.books;

  return (
    <div>

      <h1>📚 전체 도서 목록</h1>

      <div className="book-list">

        {books.map((book) => (

          <div className="book-card" key={book.id}>

            <img
              src={book.coverImageUrl}
              alt={book.title}
            />

            <h3>{book.title}</h3>

            <p>{book.author}</p>

            <div>
              ❤️ {book.likes}
            </div>

            <Link to={`/detail/${book.id}`}>

              <button>
                자세히 보기
              </button>

            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ListPage;