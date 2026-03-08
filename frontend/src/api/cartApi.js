import axiosClient from "./axiosClient";

const cartApi = {
    getCart() {
        return axiosClient.get("/cart");
    },

    addToCart(data) {
        return axiosClient.post("/cart", {
            CustomerID: data.CustomerID,
            MenuItemID: data.MenuItemID,
            Quantity: data.Quantity
        });
    },

    updateCartItem(cartId, data) {
        return axiosClient.put(`/cart/${cartId}`, {
            Quantity: data.Quantity
        });
    },

    removeFromCart(cartId) {
        return axiosClient.delete(`/cart/${cartId}`);
    },

    clearCart() {
        return axiosClient.delete("/cart");
    }
};

export default cartApi;
