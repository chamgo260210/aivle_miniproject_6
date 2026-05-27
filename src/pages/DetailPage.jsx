import BookReportDetailList from '../components/BookReportDetailList'
import BookDetailEdit from '../components/BookDetailEdit'
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatDate } from "../components/utils.js";

function DetailPage({books, reviews,onReviewAdd, onReviewLike, onReviewEdit, onReviewDelete, onBookDelete, onBookEdit, onBookLikes }){
    const { id } = useParams();
    const navigate = useNavigate();
    const book = books.find( b => String(b.id) === String(id));
    
    const [isEditing, setIsEditing] = useState(false);

    const handleBookDelete = () =>{
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
        console.log(isConfirmed)
        if (!isConfirmed) return;
        onBookDelete(id);
        navigate ('/')
    }

    const handleBookEdit = (edited) => {
        onBookEdit (id, edited)
        setIsEditing(false)
    }
    
    const handleBookEditCancel = ()=>{

        setIsEditing(false)
    }

    if (isEditing){
        return (
            <>
             <BookDetailEdit book = {book} onEdit={handleBookEdit} onCancel={handleBookEditCancel}/>
             </>
        )
    }
    return(
        <>
        <div className="detail-content-area">
            <div className="detail-main">
                <div className="detail-poster">
                {book.coverImageUrl !='' ? 
                <img src = {book.coverImageUrl} img='img'/> : <></>}
                </div>
            
                <div className="detail-info">
                    <h2 className="detail-title">{book.title}</h2>
                    <p className="detail-content-quote">{book.content}</p>
                    {book.tags?.length > 0 && (
                        <p className="detail-tag-line">{book.tags.map(t=> `#${t} ` )}</p>
                    )}
                    <div className="detail-meta">
                        <span className="detail-meta-item">생성 {formatDate(book.createdAt)}</span>
                        <span className="detail-meta-item">수정 {formatDate(book.updatedAt)}</span>
                    </div>
                </div>
            
            
                <div className="detail-action">
                    <button onClick={(e)=>{

                        onBookLikes(id);
                        }}>❤️{book.likes} </button>
                    <button onClick={()=>setIsEditing(true)}>수정하기</button>
                    <button onClick={handleBookDelete}>삭제하기</button>
                </div>

            </div>
           
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