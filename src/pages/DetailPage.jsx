import BookReportDetailList from '../components/BookReportDetailList'
import { useParams, useNavigate } from 'react-router-dom';

function DetailPage({books, reviews,onReviewAdd, onReviewLike, onReviewEdit, onReviewDelete, onBookDelete, onBookEdit, onBookLikes }){
    const { id } = useParams();
    const navigate = useNavigate();
    const book = books.find( b => String(b.id) === String(id));
    console.log(book)

    const handleBookDelete = () =>{
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
        console.log(isConfirmed)
        if (!isConfirmed) return;
        onBookDelete(id);
        navigate ('/')
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
            <button onClick={handleBookDelete}>삭제하기</button>
        </div>
        <BookReportDetailList
            review= {reviews.filter(p => p.bookId === Number(book.id) )}
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