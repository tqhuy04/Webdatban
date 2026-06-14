import React, { useEffect, useState } from "react";
import ProductFrame from "../ProductFrame";
import menu_itemApi from "../../../api/menu_itemApi";
import menu_categoryApi from "../../../api/menu_categoryApi";

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [menuCategories, setMenuCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [menuItemsOfActiveCategory, setMenuItemsOfActiveCategory] = useState([]);

    // CLICK CATEGORY
    const handleCategoryClick = (categoryID) => {
        setActiveCategory(categoryID);
    };

    // LOAD MENU ITEMS + CATEGORIES
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, categoriesRes] = await Promise.all([
                    menu_itemApi.getActive(),
                    menu_categoryApi.getAll(),
                ]);

                const items = itemsRes?.data ?? [];
                const categories = categoriesRes?.data ?? [];

                setMenuItems(items);
                setMenuCategories(categories);

                if (categories.length > 0) {
                    setActiveCategory(categories[0].CategoryID);
                }
            } catch (error) {
                console.error("Lỗi load menu:", error);
            }
        };

        fetchData();
    }, []);

    // FILTER MENU ITEMS BY CATEGORY
    useEffect(() => {
        if (!activeCategory) return;

        const filteredItems = menuItems.filter(
            (item) => item.CategoryID === activeCategory
        );

        setMenuItemsOfActiveCategory(filteredItems);
    }, [activeCategory, menuItems]);

    return (
        <div>
            {/* CATEGORY LIST */}
            <div className="d-flex align-items-center justify-content-center menu mt-3">
                <ul className="d-flex">
                    {menuCategories.map((category) => (
                        <li
                            key={category.CategoryID}
                            className={
                                activeCategory === category.CategoryID
                                    ? "menu_active"
                                    : ""
                            }
                            onClick={() => handleCategoryClick(category.CategoryID)}
                        >
                            {category.CategoryName}
                        </li>
                    ))}
                </ul>
            </div>

            {/* PRODUCT LIST */}
            <div className="mt-3" style={{ marginLeft: "50px" }}>
                <ProductFrame products={menuItemsOfActiveCategory} />
            </div>
        </div>
    );
};

export default Menu;
