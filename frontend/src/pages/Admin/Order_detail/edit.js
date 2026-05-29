import React, { useEffect, useState } from "react";
import menuItemApi from "../../../api/menu_itemApi";
import orderDetailApi from "../../../api/order_detailApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetOrder_details, OrderID, data }) => {
    const notify = useNotify();

    const [menuItems, setMenuItems] = useState([]);
    const [MenuItemID, setMenuItemID] = useState(data.MenuItemID);
    const [Quantity, setQuantity] = useState(data.Quantity);

    useEffect(() => {
        menuItemApi.getAll()
            .then(res => setMenuItems(res.data || []))
            .catch(() => {});
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!MenuItemID) {
            notify.warning("Vui lòng chọn món");
            return;
        }
        if (!Quantity || Quantity < 1) {
            notify.warning("Số lượng phải lớn hơn 0");
            return;
        }

        const menuItem = menuItems.find(m => m.MenuItemID === parseInt(MenuItemID));
        const price = menuItem ? menuItem.Price * Quantity : 0;

        orderDetailApi.update(data.OrderDetailID, {
            OrderID: parseInt(OrderID),
            MenuItemID: parseInt(MenuItemID),
            Quantity: parseInt(Quantity),
            Price: price
        })
            .then(() => {
                notify.success("Cập nhật món thành công");
                GetOrder_details();
                setisShowFormEdit(false);
            })
            .catch(() => {
                notify.error("Cập nhật món thất bại");
            });
    };

    const getItemPrice = () => {
        const item = menuItems.find(m => m.MenuItemID === parseInt(MenuItemID));
        return item ? item.Price : 0;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa món trong đơn hàng</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Món</label>
                        <select
                            className="form-control"
                            value={MenuItemID}
                            onChange={(e) => setMenuItemID(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn món --</option>
                            {menuItems.map(menu => (
                                <option key={menu.MenuItemID} value={menu.MenuItemID}>
                                    {menu.Name} - {menu.Price?.toLocaleString()} VNĐ
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Số lượng</label>
                        <input
                            type="number"
                            className="form-control"
                            value={Quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Thành tiền</label>
                        <p className="form-control-plaintext">
                            {(getItemPrice() * Quantity).toLocaleString()} VNĐ
                        </p>
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormEdit(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
