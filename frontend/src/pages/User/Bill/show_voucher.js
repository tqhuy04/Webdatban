import React, { useState, useEffect } from 'react';
import promotionApi from '../../../api/promotionApi';
import { formatNumber } from '../../../components/utils/format_number';
import { useNotify } from '../../../contexts/ToastContext';
import './show_voucher.css';

const VoucherShop = ({ setPromotion, onClose, Promotion }) => {
    const notify = useNotify();

    const [Promotions, setPromotions] = useState([]);
    const [VoucherSelected, setVoucherSelected] = useState([]);

    // =========================
    // LOAD PROMOTIONS
    // =========================
    useEffect(() => {
        promotionApi.getAll()
            .then(response => {
                setPromotions(response?.data || []);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy mã giảm giá: ', error);
            });
    }, []);

    // =========================
    // SET VOUCHER ĐÃ CHỌN TRƯỚC
    // =========================
    useEffect(() => {
        if (Promotion) {
            setVoucherSelected([Promotion]);
        }
    }, [Promotion]);

    // =========================
    // TOGGLE VOUCHER (CHỈ 1)
    // =========================
    const toggleVoucher = (voucher) => {
        setVoucherSelected((prev) => {
            const exists = prev.some(
                (item) => item.PromotionID === voucher.PromotionID
            );
            return exists ? [] : [voucher];
        });
    };

    // =========================
    // SAVE
    // =========================
    function handleSaveVoucher() {
        if (VoucherSelected.length > 0) {
            setPromotion(VoucherSelected[0]);
            onClose();
        } else {
            notify.warning('Vui lòng chọn 1 voucher để áp dụng hoặc ấn đóng để hủy');
        }
    }

    return (
        <div className="voucher-modal-overlay">
            <div className="voucher-modal-content">
                <h4>Chọn voucher</h4>

                {Promotions.length > 0 ? Promotions.map((promiton) => (
                    <div
                        key={promiton.PromotionID}
                        className={`row voucher-item ${VoucherSelected.some(v => v.PromotionID === promiton.PromotionID) ? 'selected' : ''}`}
                        onClick={() => toggleVoucher(promiton)}
                    >
                        <div className='col-md-4 col-4'>
                            <img
                                style={{ width: '80%', height: '80%' }}
                                src="https://static.vecteezy.com/system/resources/previews/048/732/641/non_2x/gift-voucher-neon-sign-with-brick-wall-background-free-vector.jpg"
                                alt="Voucher shop"
                            />
                        </div>

                        <div className='col-md-7 col-7'>
                            <p style={{ color: 'black' }}>
                                Giảm {formatNumber(promiton?.DiscountPercent ?? 0)} VNĐ
                            </p>
                        </div>

                        <div className='col-md-1 col-1'>
                            <input
                                type='radio'
                                name='selectVoucherShip'
                                readOnly
                                checked={VoucherSelected.some(
                                    (voucher) =>
                                        voucher?.PromotionID === promiton?.PromotionID
                                )}
                            />
                        </div>
                    </div>
                )) : (
                    <p style={{ color: 'black' }}>Không có voucher nào cả</p>
                )}

                <div className='voucher-modal-actions'>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveVoucher}
                    >
                        Lưu
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherShop;
