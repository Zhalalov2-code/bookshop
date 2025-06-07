import axios from "axios";

const API_URL = 'https://683f4d771cd60dca33def0f9.mockapi.io/book';

export const addToCart = async (book) => {
    const { id, title, price, image, userId } = book;
    return await axios.post(API_URL, {
        bookId: id,
        title,
        price,
        image,
        userId
    });
};

export const getCart = async (userId) => {
    const response = await axios.get(API_URL);
    return response.data.filter(item => item.userId === userId);
};

export const removeFromCart = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};


export const getUserCart = async (userId) => {
    const res = await axios.get(`https://your-api-url/cart?userId=${userId}`);
    return res.data;
};
