import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import menuItemApi from "../../../api/menu_itemApi";
import booking_tableApi from "../../../api/booking_tableApi";
import orderApi from "../../../api/orderApi";

function SearchAutocomplete({ onClose }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState({ menu: [], bookings: [], orders: [] });
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.trim().length >= 1) {
            setLoading(true);
            debounceRef.current = setTimeout(async () => {
                try {
                    const [menuRes, bookingRes, orderRes] = await Promise.all([
                        menuItemApi.search(query).catch(() => ({ data: [] })),
                        booking_tableApi.search(query).catch(() => ({ data: [] })),
                        orderApi.search(query).catch(() => ({ data: [] })),
                    ]);

                    setSuggestions({
                        menu: (menuRes.data || []).slice(0, 5),
                        bookings: (bookingRes.data || []).slice(0, 3),
                        orders: (orderRes.data || []).slice(0, 3),
                    });
                    setShowDropdown(true);
                    setActiveIndex(-1);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setLoading(false);
                }
            }, 300);
        } else {
            setSuggestions({ menu: [], bookings: [], orders: [] });
            setShowDropdown(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    const totalSuggestions = suggestions.menu.length + suggestions.bookings.length + suggestions.orders.length;

    const getSuggestionLink = (type, item) => {
        switch (type) {
            case "menu":
                return `/ProductDetails/${item.MenuItemID}`;
            case "booking":
                return `/Show_bookingTable/${item.BookingID}`;
            case "order":
                return `/OrderDetail/${item.OrderID}`;
            default:
                return "#";
        }
    };

    const handleKeyDown = (e) => {
        if (!showDropdown) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev < totalSuggestions - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : totalSuggestions - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0) {
                    const allItems = [
                        ...suggestions.menu.map((i) => ({ type: "menu", item: i })),
                        ...suggestions.bookings.map((i) => ({ type: "booking", item: i })),
                        ...suggestions.orders.map((i) => ({ type: "order", item: i })),
                    ];
                    const selected = allItems[activeIndex];
                    if (selected) {
                        window.location.href = getSuggestionLink(selected.type, selected.item);
                    }
                }
                break;
            case "Escape":
                setShowDropdown(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className="search-autocomplete-wrapper" ref={wrapperRef}>
            <div className="search-autocomplete-input">
                <i className="fas fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                {loading && <i className="fas fa-spinner fa-spin loading-icon"></i>}
            </div>

            {showDropdown && (
                <div className="search-autocomplete-dropdown">
                    {totalSuggestions === 0 ? (
                        <div className="autocomplete-no-results">
                            <i className="fas fa-search-minus"></i>
                            <p>Không tìm thấy gợi ý</p>
                        </div>
                    ) : (
                        <>
                            {/* Menu Items */}
                            {suggestions.menu.length > 0 && (
                                <div className="autocomplete-section">
                                    <div className="autocomplete-section-title">
                                        <i className="fas fa-utensils"></i>
                                        Món ăn
                                    </div>
                                    {suggestions.menu.map((item, idx) => {
                                        const globalIdx = idx;
                                        return (
                                            <Link
                                                key={`menu-${item.MenuItemID}`}
                                                to={getSuggestionLink("menu", item)}
                                                className={`autocomplete-item ${activeIndex === globalIdx ? "active" : ""}`}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <div className="autocomplete-item-content">
                                                    <span className="item-name">{item.Name}</span>
                                                    <span className="item-price">
                                                        {new Intl.NumberFormat("vi-VN").format(item.Price)} đ
                                                    </span>
                                                </div>
                                                <i className="fas fa-chevron-right"></i>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Bookings */}
                            {suggestions.bookings.length > 0 && (
                                <div className="autocomplete-section">
                                    <div className="autocomplete-section-title">
                                        <i className="fas fa-calendar-alt"></i>
                                        Đặt bàn
                                    </div>
                                    {suggestions.bookings.map((item, idx) => {
                                        const globalIdx = suggestions.menu.length + idx;
                                        return (
                                            <Link
                                                key={`booking-${item.BookingID}`}
                                                to={getSuggestionLink("booking", item)}
                                                className={`autocomplete-item ${activeIndex === globalIdx ? "active" : ""}`}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <div className="autocomplete-item-content">
                                                    <span className="item-name">Đặt bàn #{item.BookingID}</span>
                                                    <span className="item-meta">
                                                        {item.BookingTime ? new Date(item.BookingTime).toLocaleDateString("vi-VN") : ""}
                                                    </span>
                                                </div>
                                                <i className="fas fa-chevron-right"></i>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Orders */}
                            {suggestions.orders.length > 0 && (
                                <div className="autocomplete-section">
                                    <div className="autocomplete-section-title">
                                        <i className="fas fa-shopping-bag"></i>
                                        Đơn hàng
                                    </div>
                                    {suggestions.orders.map((item, idx) => {
                                        const globalIdx = suggestions.menu.length + suggestions.bookings.length + idx;
                                        return (
                                            <Link
                                                key={`order-${item.OrderID}`}
                                                to={getSuggestionLink("order", item)}
                                                className={`autocomplete-item ${activeIndex === globalIdx ? "active" : ""}`}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <div className="autocomplete-item-content">
                                                    <span className="item-name">Đơn hàng #{item.OrderID}</span>
                                                    <span className="item-price">
                                                        {new Intl.NumberFormat("vi-VN").format(item.TotalAmount)} đ
                                                    </span>
                                                </div>
                                                <i className="fas fa-chevron-right"></i>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchAutocomplete;
