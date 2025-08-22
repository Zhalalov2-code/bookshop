import { Card, Button, Typography, notification  } from 'antd';
import '../css/card.css';
import { addToCart } from '../api/cartApi';
import { useAuth } from '../components/authContext';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, InfoCircleOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const BookCard = ({ id, title, authors, image, publishedDate, category, price, oldPrice, currency, buyLink }) => {
    const { user } = useAuth();
    const isDiscount = price && oldPrice && oldPrice > price;

    const handleAddToCart = async () => {
        if (!user) {
            notification.error({
                message: 'Ошибка',
                description: 'Сначала войдите в аккаунт',
                placement: 'bottomRight',
            });
            return;
        }

        const item = {
            id, title, image, price: price || 0,
            userId: user.uid,
        };

        try {
            await addToCart(item);
            notification.success({
                message: 'Добавлено',
                description: `${title} успешно добавлена в корзину`,
                placement: 'bottomRight',
            });
        } catch (err) {
            console.error(err);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось добавить в корзину',
                placement: 'bottomRight',
            });
        }
    };


    return (
        <Card hoverable className="book-card" cover={
            image ? <img alt={title} src={image} className="book-card-cover" />
                : <div className="book-card-cover empty">Нет изображения</div>
        }>
            {isDiscount && (
                <div className="book-card-discount">
                    -{Math.round(100 - ((price || 0) / (oldPrice || 1)) * 100)}%
                </div>
            )}
            <div className="book-card-title">{title}</div>
            <Paragraph className="book-card-author">
                {authors?.join(', ') || 'Неизвестный автор'}
            </Paragraph>
            <Text className="book-card-meta">📅 {publishedDate || '—'}</Text><br />
            <Text className="book-card-meta">🏷️ {category || 'Не указано'}</Text>
            <div className="book-card-price">
                {isDiscount && <Text delete>{(oldPrice || 0).toFixed(2)} {currency}</Text>}
                <Text strong>{price ? `${price.toFixed(2)} ${currency}` : 'Бесплатно'}</Text>
            </div>
            {buyLink && (
                <a href={buyLink} target="_blank" rel="noreferrer">
                    <Button
                        icon={<ShoppingOutlined />}
                        size="small"
                        block
                        style={{ marginTop: 5 }}
                    >
                        Купить на сайте
                    </Button>
                </a>
            )}
            <Button
                style={{ marginTop: 5 }}
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="small"
                block
                onClick={handleAddToCart}
            >
                В корзину
            </Button>
            <Link to={`/details.book/${id}`}>
                <Button
                    type="dashed"
                    icon={<InfoCircleOutlined />}
                    size="small"
                    block
                    style={{ marginTop: 5 }}
                >
                    Подробнее
                </Button>
            </Link>
        </Card>
    );
};

export default BookCard;
