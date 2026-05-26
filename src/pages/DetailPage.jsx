import BookReportDetailList from '../components/BookReportDetailList'
import { useParams } from 'react-router-dom';

function DetailPage({books, reviews,onReviewAdd, onReviewLike, onReviewEdit, onReviewDelete, onBookDelete, onBookEdit, onBookLikes }){
    const { id } = useParams();
    const book = books.find( b => String(b.id) === String(id));
    console.log(book)

    const handleBookDelete = () =>{
        
    }
    return(
        <>
        <div className="detail-content-area">
            <div className="detail-poster">
            {book.coverImageUrl !='' ? 
            <img src = {book.coverImageUrl} img='img'/> : <></>}
            </div>
            <div className="detail-info">
                <h3>{book.title}</h3>
                <p>{book.content}</p>
                <p>생성일: {book.createAt}</p>
            </div>
            <button onClick={()=>onBookLikes(id)}>❤️{book.likes} </button>
            <button onClick={()=>onBookEdit(id)}>수정하기</button>
            <button onClick={()=>onBookDelete(id)}>삭제하기</button>
        </div>
        <BookReportDetailList
            review= {reviews.filter(p => String(p.bookId) === String(book.id) )}
            book={book}
            bookTitle={book.title}
            onCreate={onReviewAdd}
            onReviewLike={onReviewLike}
            onReviewEdit={onReviewEdit}
            onReviewDelete={onReviewDelete}
            />
        </>

    );
}
export default DetailPage;