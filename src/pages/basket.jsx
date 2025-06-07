import Navbar from '../components/navbar';
import '../css/basket.css';
import { Typography, Button, message, Spin } from 'antd';
import { getCart, removeFromCart } from '../api/cartApi';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/authContext';

const { Title } = Typography;

function Basket() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getCart(user.uid);
            setCart(data);
        } catch {
            message.error('Ошибка при загрузке корзины');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const handleRemove = async (id) => {
        try {
            await removeFromCart(id);
            message.success('Удалено');
            fetchCart();
        } catch {
            message.error('Ошибка при удалении');
        }
    };

    useEffect(() => {
        if (user) fetchCart();
    }, [fetchCart, user]);

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

    return (
        <div className='body-basket'>
            <Navbar />
            <Title level={2}>🛒 Ваша корзина</Title>
            {loading ? (
                <Spin className='spin' size="large" tip="Загрузка..." />
            ) : cart.length === 0 ? (
                <Title level={4}>Корзина пуста</Title>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="basket-item">
                            <div className="left">
                                <img src={item.image} alt={item.title} />
                                <span>{item.title} — {item.price} €</span>
                            </div>
                            <Button danger onClick={() => handleRemove(item.id)}>Удалить</Button>
                        </div>
                    ))}
                    <Title level={4}>Итого: {total.toFixed(2)} €</Title>
                    <Button type="primary" style={{ marginTop: 16 }}>
                        Перейти к оформлению
                    </Button>
                </>
            )}
        </div>
    );
}

export default Basket;
