import React, { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import promotionApi from "../../../api/promotionApi";

const EditForm = ({ setisShowFormEdit,GetPromotions,data,id }) => {
    const [Title,setTitle] = useState('');
    const [Description,setDescription] = useState('');
    const [Discount,setDiscount] = useState('');
    const [StartDate,setStartDate] = useState('');
    const [EndDate,setEndDate] = useState('');

    useEffect(()=>{
        setTitle(data.FullName);
        setDescription(data.PhoneNumber);
        setDiscount(data.Address);
        setStartDate(data.UserID);
        setEndDate(data.FullName);
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            Title,
            Description,
            Discount,
            StartDate,
            EndDate
        }
        promotionApi.update(id,data)
        .then(response=>{
            alert('bạn đã sua thong tin mã giảm giá thành công');
            GetPromotions();
            setisShowFormEdit(false);
        })
        .catch(error=>{
            console.error('có lỗi trong quá trình lấy dl: '+error);
        })
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>{"Thêm dữ liệu"}</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tiêu đề: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={Title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Giảm giá: </label>
                        <input
                            type="number"
                            className="form-control"
                            value={Discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ngày bắt đầu: </label>
                        <input
                            type="date"
                            className="form-control"
                            value={StartDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giảm giá: </label>
                        <input
                            type="date"
                            className="form-control"
                            value={EndDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button type="button" className="btn btn-secondary" 
                    onClick={()=>{setisShowFormEdit(false)}}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm