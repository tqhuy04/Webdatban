import React, { useState, useEffect } from "react";
import Title from '../../../components/shared/Title'
import authUser from '../../../api/authUser'
import feedbackApi from '../../../api/feedbackApi'
import { useNotify } from '../../../contexts/ToastContext';
import "./Feedback.css";

const LIMIT = 3;

function Feedback() {
    const notify = useNotify();

    const [User_id, setUser_id] = useState(null);
    const [Content, setContent] = useState('');
    const [Rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [publicFeedbacks, setPublicFeedbacks] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(total / LIMIT);

    const loadPublicFeedbacks = (pageNum = 0) => {
        feedbackApi.getPublic(pageNum, LIMIT)
            .then((res) => {
                setPublicFeedbacks(res.data.items || []);
                setTotal(res.data.total || 0);
            })
            .catch((err) => console.error('có lỗi: ' + err));
    };

    const handleFeedback = (e) => {
        e.preventDefault();
        const now = new Date();
        const datetime = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
                .getHours()
                .toString()
                .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
                    .getSeconds()
                    .toString()
                    .padStart(2, "0")}`;

        const data = {
            UserID: User_id,
            Content,
            Rating,
            CreateAt: datetime,
        }

        feedbackApi.create(data)
            .then(() => {
                notify.success('Đã gửi phản hồi thành công');
                setContent('');
                setRating(5);
                setHoverRating(0);
                loadPublicFeedbacks(page);
            })
            .catch(error => console.error('có lỗi: ' + error))
    };

    useEffect(() => {
        authUser.get_user_id()
            .then(response => {
                setUser_id(response.data)
            })
            .catch(error => console.error('có lỗi: ' + error));
        loadPublicFeedbacks(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadPublicFeedbacks(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderStars = (rating, interactive = false, onSelect = null, onHover = null, onLeave = null) => {
        return (
            <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= (hoverRating || rating) ? 'filled' : ''} ${interactive ? 'clickable' : ''}`}
                        onClick={() => interactive && onSelect && onSelect(star)}
                        onMouseEnter={() => interactive && onHover && onHover(star)}
                        onMouseLeave={() => interactive && onLeave && onLeave()}
                    >
                        <i className={`fa ${star <= (hoverRating || rating) ? 'fa-star' : 'fa-star-o'}`}></i>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className='container-fluid w-100 pb-5' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>Phản hồi</p>
                </div>
            </div>
            <div className='container mt-5 d-flex flex-column align-items-center justify-content-center pb-5' style={{ minHeight: '574px', borderRadius: '10px', background: "url('https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/datban.jpg?1705898785025')" }}>
                <div className='user-feedback-form-box'>
                    <Title title='Đánh giá'></Title>
                    <form>
                        <div className='row text-white p-3'>
                            <div className='col-md-12'>
                                <label style={{ marginTop: '12px' }}>Đánh giá của bạn</label>
                                <div className="rating-selector">
                                    {renderStars(Rating, true, setRating, setHoverRating, () => setHoverRating(0))}
                                    <span className="rating-text">{Rating}/5 sao</span>
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <label style={{ marginTop: '12px' }}>Nội dung phản hồi</label>
                                <input
                                    type='text' required placeholder='Nội dung'
                                    style={{
                                        marginTop: '8px', width: '100%', height: '35px', outline: 'none',
                                        borderRadius: '5px'
                                    }}
                                    value={Content}
                                    onChange={(e) => { setContent(e.target.value) }}
                                ></input>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-center mt-2'>
                            <button type="" onClick={(e) => handleFeedback(e)} style={{ width: '150px', height: '45px', borderRadius: '5px', border: 'none', background: '#d69c52', color: '#fff' }}>Gửi phản hồi</button>
                        </div>
                    </form>
                </div>

                {publicFeedbacks.length > 0 && (
                    <div className='user-feedback-list'>
                        <p className='user-feedback-list-title'>
                            <i className="fa fa-comments"></i>
                            Đánh giá từ khách hàng
                            <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: 400, opacity: 0.75 }}>
                                ({total})
                            </span>
                        </p>
                        {publicFeedbacks.map((fb) => {
                            const date = new Date(fb.CreateAt);
                            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                            return (
                                <div key={fb.FeedbackID} className='user-feedback-item'>
                                    <div className='user-feedback-item-header'>
                                        <div className='user-feedback-item-name'>
                                            <div className='user-feedback-item-avatar'>
                                                {fb.full_name ? fb.full_name.charAt(0).toUpperCase() : 'K'}
                                            </div>
                                            <span>{fb.full_name || 'Khách hàng'}</span>
                                        </div>
                                        <div className="user-feedback-item-meta">
                                            <span className='user-feedback-item-date'>{formattedDate}</span>
                                            {renderStars(fb.Rating || 5)}
                                        </div>
                                    </div>
                                    <div className='user-feedback-item-content'>{fb.Content}</div>
                                    {fb.AdminReply && (
                                        <div className='user-feedback-item-reply'>
                                            <i className="fa fa-reply"></i> {fb.AdminReply}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        <div className='user-feedback-pagination'>
                            <button
                                className='pagination-btn'
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 0}
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`pagination-btn ${page === i ? 'active' : ''}`}
                                    onClick={() => handlePageChange(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className='pagination-btn'
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages - 1}
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feedback
