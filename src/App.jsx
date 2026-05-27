import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import CreatePage from './pages/CreatePage';
import DetailPage from './pages/DetailPage';
import ReviewListPage from './pages/ReviewListPage';

function App() {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    async function loadData() {
      try {
        const booksRes = await fetch('http://localhost:3000/books');
        const reviewsRes = await fetch('http://localhost:3000/reviews');
        const res1 = await booksRes.json()
        setBooks(res1);
        const res2 = await reviewsRes.json()
        setReviews(res2);
        

      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
      setLoading(false);
      
    }
    loadData();
  }, []);

  useEffect(() => {
    setTags([...new Set(books.flatMap(b => b.tags ? b.tags : []))]);
  }, [books]);

    //  create 관련 함수 
  const handleCreateBook = async (newBook) => {
    const res = await fetch('http://localhost:3000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    const savedBook = await res.json();
    setBooks([savedBook, ...books]);
    return savedBook;
  };
  
  const handleReviewLike = async (id) => {
    const review = reviews.find( r => r.id ===id);

    const res = await fetch(`http://localhost:3000/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: review.likes + 1 }),
    });
    const updated = await res.json();
    setReviews(reviews.map((r) => (r.id === id ? updated : r)));
  };

  const handleBookLikes = async (id) => {
    try {
      const book = books.find((b) => String(b.id) === String(id));
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: book.likes + 1 }),
      });
  
      const updated = await res.json();
      setBooks(books.map((b) => (String(b.id) === String(id) ? updated : b)));
    } catch (err) {
      console.error(err);
    }
  };
  const handleReviewEdit = async(id, edited) =>{
    try {
        const res = await fetch (`http://localhost:3000/reviews/${id}`,
          {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(edited),
          }
        );
        const updated = await res.json();
        setReviews(reviews.map( r=> String(r.id) === String(id) ? updated : r));
        return updated
    }
    catch (err){
        console.error(err);
    }
  }
  
  const handleBookEdit = async(id, edited) =>{
    try {
        const res = await fetch (`http://localhost:3000/books/${id}`,
          {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(edited),
          }
        );
        const updated = await res.json();
        setBooks(books.map( b=> String(b.id) === String(id) ? updated : b));
    }
    catch (err){
        console.error(err);
    }
  }

  const handleBookDelete = async(id) =>{
    try {
      await fetch (`http://localhost:3000/books/${id}`,
        {method: 'DELETE'}
      );
      setBooks (books.filter(b => String(b.id) !== String(id)));
    }
    catch (err){
      console.error(err);
    }
  }


  const handleReviewDelete = async(id) =>{
    try {
        await fetch (`http://localhost:3000/reviews/${id}`,
        {method: 'DELETE'}
      );
      setReviews(reviews.filter(r => r.id !==id ));
    }
    catch (err){
      console.error(err);
    }

  }
  const handleReviewAdd = (saved) =>{
    try{
      setReviews ([...reviews, saved])
    }catch{
      alert("새로고침 필요.");
    }
  }

  if (loading) {
    return <div>전체 데이터를 불러오는 중입니다...</div>;
  }
  return (
    <div>
      <header className="header">
        <div className="logo">
          <h1 className="logo">📚 도서관리</h1>
        </div>

        <nav>
          <Link to="/">홈</Link>
          <Link to="/list">도서목록</Link>
          <Link to="/reviews">리뷰목록</Link>
          <Link to="/create" className="add-book-btn">+ 새 도서 등록</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage books={books} reviews={reviews} />} />
          <Route path="/list" element={<ListPage books={books} tags={tags} />} />
          <Route path="/create" element={<CreatePage onCreateBook={handleCreateBook} />} />
          <Route path="/detail/:id" element={<DetailPage books={books} reviews={reviews}
              onBookEdit={handleBookEdit} onBookDelete={handleBookDelete} onBookLikes={handleBookLikes}
              onReviewLike={handleReviewLike} onReviewEdit={handleReviewEdit} onReviewDelete={handleReviewDelete}
              onReviewAdd={handleReviewAdd} />} />
          <Route path="/reviews" element={<ReviewListPage reviews={reviews} books={books}/>}/>
        </Routes>
      </main>
    </div>
  );
}
export default App;