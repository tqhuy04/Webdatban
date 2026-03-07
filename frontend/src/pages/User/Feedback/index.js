import React, { useState, useEffect } from "react";
import Title from '../../../components/shared/Title'
import authUser from '../../../api/authUser'
import feedbackApi from '../../../api/feedbackApi'

function Feedback() {

    const [User_id, setUser_id] = useState(null);
    const [Content, setContent] = useState(null);

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
            CreateAt: datetime,
        }

        feedbackApi.create(data)
            .then(response => {
                alert('đã gửi phản hồi thành công');
                setContent('');
            })
            .catch(error => console.error('có lỗi: ' + error))
    };

    useEffect(() => {
        authUser.get_user_id()
            .then(response => {
                setUser_id(response.data)
            })
            .catch(error => console.error('có lỗi: ' + error))
    }, [])

    return (
        <div className='container-fluid w-100 pb-5' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>Phản hồi</p>
                </div>
            </div>
            <div className='container mt-5 d-flex align-items-center justify-content-center' style={{ height: '574px', borderRadius: '10px', background: "url('https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/datban.jpg?1705898785025')" }}>
                <div style={{ width: '600px', height: '450px', borderRadius: '10px', background: '#10302c' }}>
                    <Title
                        title='Đánh giá'></Title>
                    <form>
                        <div className='row text-white p-3'>

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
            </div>
        </div>
    )
}

export default Feedback