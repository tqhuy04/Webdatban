import React, { useEffect, useState } from 'react';
import MenuSelection from '../../../components/shared/MenuSelection'
import tableApi from '../../../api/tableApi';
import { useNotify } from '../../../contexts/ToastContext';

const BookingTable = ({ isVisible, onClose }) => {
    const { warning: notifyWarning } = useNotify();
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [Select_tables, setSelect_tables] = useState([]);
    const [tables, settables] = useState([]);

    // ❌ bỏ window.confirm
    const handleBooking = (e) => {
        e.preventDefault();

        if (Select_tables.length === 0) {
            notifyWarning("Vui lòng chọn ít nhất 1 bàn!");
            return;
        }

        sessionStorage.setItem('tables', JSON.stringify(Select_tables));
        setShowMenuModal(true);
    };

    const handleCloseMenu = () => {
        setShowMenuModal(false);
    };

    useEffect(() => {
        tableApi.getAll()
            .then(response => {
                settables(response.data);
            })
            .catch(() => {
                console.error('Có lỗi trong quá trình lấy tables');
            });
    }, []);

    function HandleAddSelectTables(table) {
        setSelect_tables((prevTables) => {
            const isAlreadySelected = prevTables.some(
                t => t.TableID === table.TableID
            );

            if (isAlreadySelected) {
                return prevTables.filter(
                    (t) => t.TableID !== table.TableID
                );
            } else {
                return [...prevTables, table];
            }
        });
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div>
            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 100,
                }}
            ></div>

            {/* Modal */}
            <div className='menu-select' style={{ background: '#ebe8e8' }}>
                <h2>Chọn bàn</h2>

                <div className='container mt-3'>
                    <div className='row'>
                        <div className='col-md-8' style={{ border: '1px solid rgb(195, 194, 194)' }}>
                            <div className='p-1' style={{ height: '400px', overflowY: 'auto' }}>

                                <div className='row'>
                                    {tables.map((table) => (
                                        <div
                                            className="col-md-5 text-center pro-item p-1 position-relative"
                                            key={table.TableID}
                                            style={{ background: '#908f8f', marginBottom: '24px', height: '270px' }}
                                        >
                                            <div
                                                className='pro-item_child'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'absolute',
                                                    background: '#fff',
                                                    top: '1%',
                                                    padding: '8px'
                                                }}
                                            >
                                                <img
                                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWkGaBTTgKm42knmF4IpjngpCM0YLDHxBZYg&s'
                                                    alt={`Bàn ${table.TableNumber}`}
                                                    className="w-100 mb-2"
                                                />
                                                <h5>{table.TableNumber}</h5>
                                                <p className="text-danger">
                                                    Kích thước: {table.Capacity}
                                                </p>
                                                <p className="text-danger">
                                                    {table.Status === 1 ? 'đã được đặt' : ''}
                                                </p>
                                            </div>

                                            {table.Status === 1 ? null : (
                                                <button
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-10%',
                                                        left: '25%',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        background: '#bd8133',
                                                        color: '#fff',
                                                        padding: '5px'
                                                    }}
                                                    onClick={() => HandleAddSelectTables(table)}
                                                >
                                                    {Select_tables.some(
                                                        t => t.TableID === table.TableID
                                                    )
                                                        ? 'Bỏ chọn'
                                                        : 'Chọn bàn'}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div
                                className='p-1'
                                style={{
                                    border: '1px solid rgb(195, 194, 194)',
                                    background: '#fff',
                                    height: '400px',
                                    overflowY: 'auto'
                                }}
                            >
                                <h5>Các bàn đã được chọn</h5>

                                {Select_tables.map((select_table) => (
                                    <div
                                        key={select_table.TableID}
                                        className='d-flex align-items-center justify-content-between mt-3 pb-3'
                                    >
                                        <div className='d-flex align-items-center position-relative mt-2'>
                                            <img
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '5px'
                                                }}
                                                src='https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg'
                                                alt={`Bàn ${select_table.TableNumber}`}
                                            />
                                            <p style={{ marginLeft: '4px', fontSize: '12px' }}>
                                                Bàn: {select_table.TableNumber}
                                            </p>
                                        </div>

                                        <button
                                            style={{
                                                color: '#fff',
                                                fontSize: '12px',
                                                background: 'red',
                                                height: '20px',
                                                border: 'none'
                                            }}
                                            onClick={() => HandleAddSelectTables(select_table)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='menu-bt'>
                    <button onClick={handleBooking}>
                        Tiến hành đặt món
                    </button>

                    <MenuSelection
                        isVisible={showMenuModal}
                        onClose={handleCloseMenu}
                    />

                    <button onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingTable;