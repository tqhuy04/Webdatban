import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import booking_tableApi from '../../../api/booking_tableApi';

function Show_bookingTable() {
    const navigate = useNavigate();
    const [tables, setTables] = useState(null);
    const { BookingID } = useParams();

    // ✅ DÙNG THẬT
    const handleToOrder = () => {
        navigate(`/Order/${BookingID}`);
    };

    const handleToTable = () => {
        navigate(`/OrderDetail/${BookingID}`);
    };

    useEffect(() => {
        if (!BookingID) return;

        booking_tableApi.getTablesOfBooking(BookingID)
            .then(response => {
                setTables(response.data);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy id', error);
            });
    }, [BookingID]); //
    //  FIX dependency

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}> Các lượt đặt bàn của tôi</p>
                </div>
            </div>

            <div className='container order'>
                <div className='container pb-3 mt-5'>

                    {/* ✅ DÙNG 2 HÀM Ở ĐÂY */}
                    <div className="mb-3 d-flex gap-2">
                        <button className="btn btn-warning" onClick={handleToOrder}>
                            Xem đơn đặt món
                        </button>
                        <button className="btn btn-info" onClick={handleToTable}>
                            Chi tiết đơn
                        </button>
                    </div>

                    <table className="w-100">
                        <thead>
                            <tr style={{ background: '#135b50', color: 'white' }}>
                                <th>Tên bàn</th>
                                <th>Kích thước</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables?.map(table => (
                                <tr
                                    key={`${table.BookingID}-${table.TableID}`}
                                    style={{ background: '#135b50', color: 'white' }}
                                >
                                    <td>{table.table.TableNumber}</td>
                                    <td>{table.table.Capacity}</td>
                                    <td>{table.table.Status === 0 ? 'còn trống' : 'hết bàn'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}

export default Show_bookingTable;
