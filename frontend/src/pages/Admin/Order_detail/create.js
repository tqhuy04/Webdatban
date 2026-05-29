import React, { useEffect, useState } from "react";
import menuItemApi from "../../../api/menu_itemApi";
import orderDetailApi from "../../../api/order_detailApi";
import { useNotify } from "../../../contexts/ToastContext";

const CreateForm = ({ setisShowFormCreate, GetOrder_details, OrderID }) => {
    const notify = useNotify();

    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([{ MenuItemID: "", Quantity: 1 }]);

    useEffect(() => {
        menuItemApi.getAll()
            .then(res => setMenuItems(res.data || []))
            .catch(() => {});
    }, []);

    const handleAddItem = () => {
        setSelectedItems([...selectedItems, { MenuItemID: "", Quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        if (selectedItems.length > 1) {
            const newItems = selectedItems.filter((_, i) => i !== index);
            setSelectedItems(newItems);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...selectedItems];
        newItems[index][field] = value;
        setSelectedItems(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate
        for (const item of selectedItems) {
            if (!item.MenuItemID) {
                notify.warning("Vui lòng chọn món cho tất cả các mục");
                return;
            }
            if (!item.Quantity || item.Quantity < 1) {
                notify.warning("Số lượng phải lớn hơn 0");
                return;
            }
        }

        // Tạo order details
        const promises = selectedItems.map(item => {
            const menuItem = menuItems.find(m => m.MenuItemID === parseInt(item.MenuItemID));
            const price = menuItem ? menuItem.Price * item.Quantity : 0;

            return orderDetailApi.create({
                OrderID: parseInt(OrderID),
                MenuItemID: parseInt(item.MenuItemID),
                Quantity: parseInt(item.Quantity),
                Price: price
            });
        });

        Promise.all(promises)
            .then(() => {
                notify.success("Thêm món thành công");
                GetOrder_details();
                setisShowFormCreate(false);
            })
            .catch(() => {
                notify.error("Thêm món thất bại");
            });
    };

    const getItemPrice = (menuItemId) => {
        const item = menuItems.find(m => m.MenuItemID === parseInt(menuItemId));
        return item ? item.Price : 0;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm món vào đơn hàng</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Danh sách món</label>

                        {selectedItems.map((item, index) => (
                            <div key={index} className="d-flex gap-2 mb-2 align-items-end">
                                <div className="flex-grow-1">
                                    <select
                                        className="form-control"
                                        value={item.MenuItemID}
                                        onChange={(e) => handleItemChange(index, "MenuItemID", e.target.value)}
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

                                <div style={{ width: "100px" }}>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="SL"
                                        min="1"
                                        value={item.Quantity}
                                        onChange={(e) => handleItemChange(index, "Quantity", e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ width: "130px" }}>
                                    <span className="form-control-plaintext">
                                        {getItemPrice(item.MenuItemID).toLocaleString()} VNĐ
                                    </span>
                                </div>

                                {selectedItems.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveItem(index)}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-secondary mt-2"
                            onClick={handleAddItem}
                        >
                            <i className="fa fa-plus"></i> Thêm món khác
                        </button>
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormCreate(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
