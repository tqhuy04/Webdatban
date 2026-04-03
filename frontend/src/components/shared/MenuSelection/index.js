import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import menu_itemApi from "../../../api/menu_itemApi";
import menu_categoryApi from "../../../api/menu_categoryApi";
import { useNotify } from "../../../contexts/ToastContext";

const MenuSelection = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    const notify = useNotify();

    const [Menu_categorys, setMenuCategorys] = useState([]);
    const [Menu_items, setMenuItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [Select_menuItems, setSelectMenuItems] = useState([]);
    const [TotalPrice, setTotalPrice] = useState(0);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return "";
        return encodeURI(`http://localhost:8000/uploads/Categories/${imageUrl}`);
    };

    const formatNumber = (num = 0) =>
        num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemRes = await menu_itemApi.getAll();
                const cateRes = await menu_categoryApi.getAll();

                const items = (itemRes?.data || []).map((i) => ({
                    ...i,
                    Quantity: 1,
                }));

                setMenuItems(items);
                setMenuCategorys(cateRes?.data || []);

                if (cateRes?.data?.length) {
                    setActiveCategory(cateRes.data[0].CategoryID);
                }
            } catch (err) {
                console.error("Lỗi load menu:", err);
            }
        };

        fetchData();
    }, []);

    const Menu_itemsOfactiveCategory = Menu_items.filter(
        (i) => i.CategoryID === activeCategory
    );

    useEffect(() => {
        const total = Select_menuItems.reduce(
            (sum, i) => sum + i.Price * i.Quantity,
            0
        );
        setTotalPrice(total);
    }, [Select_menuItems]);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const updateQuantity = (id, delta) => {
        setMenuItems((prev) =>
            prev.map((i) =>
                i.MenuItemID === id
                    ? { ...i, Quantity: Math.max(1, i.Quantity + delta) }
                    : i
            )
        );

        setSelectMenuItems((prev) =>
            prev.map((i) =>
                i.MenuItemID === id
                    ? { ...i, Quantity: Math.max(1, i.Quantity + delta) }
                    : i
            )
        );
    };

    const HandleAddSelectMenuItems = (item) => {
        setSelectMenuItems((prev) => {
            const exist = prev.find(
                (i) => i.MenuItemID === item.MenuItemID
            );

            if (exist) {
                return prev.filter(
                    (i) => i.MenuItemID !== item.MenuItemID
                );
            }

            return [...prev, item];
        });
    };

    // ✅ Mở modal confirm
    const handleToBill = () => {
        if (Select_menuItems.length === 0) {
            notify.warning("Bạn chưa chọn món!");
            return;
        }
        setShowConfirmModal(true);
    };

    // ✅ Xác nhận thật sự
    const confirmToBill = () => {
        sessionStorage.setItem(
            "menu_items",
            JSON.stringify(Select_menuItems)
        );
        sessionStorage.setItem("total_price", TotalPrice);

        setShowConfirmModal(false);
        navigate("/Bill");
    };

    if (!isVisible) return null;

    return (
        <div>
            {/* Overlay */}
            <div
                style={overlayStyle}
                onClick={onClose}
            />

            {/* Modal chính */}
            <div className="menu-select" style={{ background: "#ebe8e8", zIndex: 101 }}>
                <h2>Chọn món</h2>

                <div className="container mt-3">
                    <div className="row">
                        <div className="col-md-8" style={{ border: '1px solid rgb(195, 194, 194)' }}>
                            <div className="p-2" style={{ height: "400px", overflowY: "auto" }}>
                                <ul className="d-flex p-0 menu-category">
                                    {Menu_categorys.map((c) => (
                                        <li
                                            key={c.CategoryID}
                                            className={
                                                activeCategory === c.CategoryID
                                                    ? "menu_active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleCategoryClick(c.CategoryID)
                                            }
                                        >
                                            {c.CategoryName}
                                        </li>
                                    ))}
                                </ul>

                                <div className="row mt-4">
                                    {Menu_itemsOfactiveCategory.map((product) => (
                                        <div
                                            key={product.MenuItemID}
                                            className="col-md-5 text-center pro-item p-2 position-relative"
                                            style={{ background: '#fff', marginBottom: '40px', height: '270px' }}
                                        >
                                            <div className="pro-item_child" style={{ width: '100%', height: '100%', padding: '8px' }}>
                                                <img
                                                    src={getImagePath(product.ImageURL) || 'https://via.placeholder.com/150?text=No+Image'}
                                                    alt={product.Name}
                                                    style={{
                                                        width: "100%",
                                                        height: "140px",
                                                        objectFit: "cover",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                    }}
                                                />
                                                <h6>{product.Name}</h6>
                                                <p className="text-danger">
                                                    {formatNumber(product.Price)} đ
                                                </p>

                                                <div className="d-flex justify-content-center align-items-center mt-2" style={{ gap: '8px' }}>
                                                    <button 
                                                        onClick={() => updateQuantity(product.MenuItemID, -1)}
                                                        style={{
                                                            border: '1px solid #bd8133',
                                                            background: '#fff',
                                                            color: '#bd8133',
                                                            width: '30px',
                                                            height: '30px',
                                                            borderRadius: '50%',
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >-</button>
                                                    <span
                                                        style={{ 
                                                            width: "40px", 
                                                            textAlign: "center", 
                                                            fontSize: '16px',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {product.Quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(product.MenuItemID, 1)}
                                                        style={{
                                                            border: '1px solid #bd8133',
                                                            background: '#fff',
                                                            color: '#bd8133',
                                                            width: '30px',
                                                            height: '30px',
                                                            borderRadius: '50%',
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >+</button>
                                                </div>
                                            </div>

                                            <button
                                                className="select-btn"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-20%',
                                                    left: '25%',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    background: '#bd8133',
                                                    color: '#fff',
                                                    padding: '5px'
                                                }}
                                                onClick={() =>
                                                    HandleAddSelectMenuItems(product)
                                                }
                                            >
                                                {Select_menuItems.some(
                                                    (i) =>
                                                        i.MenuItemID === product.MenuItemID
                                                )
                                                    ? "Bỏ chọn"
                                                    : "Chọn món"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="p-2"
                                style={{
                                    border: '1px solid rgb(195, 194, 194)',
                                    background: "#fff",
                                    height: "400px",
                                    position: "relative",
                                }}
                            >
                                <h5>Món đã chọn</h5>

                                <div style={{ height: "80%", overflowY: "auto" }}>
                                    {Select_menuItems.map((item) => (
                                        <div
                                            key={item.MenuItemID}
                                            className="d-flex justify-content-between mb-2"
                                        >
                                            <div>
                                                <p>{item.Name}</p>
                                                <small>Số lượng: {item.Quantity}</small>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    HandleAddSelectMenuItems(item)
                                                }
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    background: 'red',
                                                    height: '20px',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    padding: '2px 8px'
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "10px",
                                        width: "100%",
                                    }}
                                >
                                    <strong>
                                        Tổng: {formatNumber(TotalPrice)} đ
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="menu-bt">
                    <button onClick={handleToBill}>Xác nhận</button>
                    <button onClick={onClose}>Hủy</button>
                </div>
            </div>

            {/* ✅ CONFIRM MODAL */}
            {showConfirmModal && (
                <div style={confirmOverlayStyle}>
                    <div style={confirmModalStyle}>
                        <h5>Bạn có muốn đặt món luôn không?</h5>
                        <div className="mt-3 text-end">
                            <button
                                className="btn btn-success me-2"
                                onClick={confirmToBill}
                            >
                                OK
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 100,
};

const confirmOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
};

const confirmModalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
};

export default MenuSelection;