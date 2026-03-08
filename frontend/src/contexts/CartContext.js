import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.MenuItemID === product.MenuItemID);

            if (existingItem) {
                return prevItems.map(item =>
                    item.MenuItemID === product.MenuItemID
                        ? { ...item, Quantity: item.Quantity + quantity }
                        : item
                );
            }

            return [...prevItems, {
                MenuItemID: product.MenuItemID,
                Name: product.Name,
                Price: product.Price,
                ImageURL: product.ImageURL,
                Quantity: quantity
            }];
        });
    };

    const updateQuantity = (menuItemId, quantity) => {
        if (quantity < 1) {
            removeFromCart(menuItemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.MenuItemID === menuItemId
                    ? { ...item, Quantity: quantity }
                    : item
            )
        );
    };

    const removeFromCart = (menuItemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.MenuItemID !== menuItemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.Price * item.Quantity), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.Quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            getCartTotal,
            getCartItemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
