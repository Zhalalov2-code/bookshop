import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Alert, notification } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../components/authContext';
import { addToCart, getUserCart } from '../api/cartApi';
import '../css/details.css';

const { Title, Paragraph, Text } = Typography;

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error('Ошибка при загрузке книги:', err);
                if (err.response?.status === 404) {
                    setError('Книга не найдена');
                } else {
                    setError('Не удалось загрузить данные книги');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBook();
    }, [id]);

    useEffect(() => {
        const checkCart = async () => {
            if (user && book?.id) {
                try {
                    const cart = await getUserCart(user.uid);
                    const exists = cart.some(item => item.bookId === book.id || item.id === book.id);
                    setInCart(exists);
                } catch (err) {
                    console.error('Ошибка при проверке корзины:', err);
                    setInCart(false);
                }
            }
        };
        checkCart();
    }, [user, book]);

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
            id, 
            title,
            price: book.saleInfo?.retailPrice?.amount || 0,
            image: book.volumeInfo?.imageLinks?.thumbnail || '',
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


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert message={error} type="error" showIcon />
            </div>
        );
    }

    if (!book) return <Text type="danger">Книга не найдена</Text>;

    const { volumeInfo, saleInfo, searchInfo } = book;
    const {
        title, authors, publisher, publishedDate,
        description, imageLinks, pageCount, categories, language
    } = volumeInfo;

    const { retailPrice, buyLink } = saleInfo || {};

    return (
        <div className="body-details">
            <Card className="card-details">
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
            >
                Назад
            </Button>
                    <img
                        src={imageLinks?.thumbnail || ''}
                        alt={title}
                        className="img-details"
                    />
                    <Title level={2}>Книга: {title}</Title>

                    <Paragraph><strong>Авторы:</strong> {authors?.join(', ') || 'Неизвестны'}</Paragraph>
                    <Paragraph><strong>Издательство:</strong> {publisher || '—'}</Paragraph>
                    <Paragraph><strong>Дата публикации:</strong> {publishedDate || '—'}</Paragraph>
                    <Paragraph><strong>Язык:</strong> {language?.toUpperCase() || '—'}</Paragraph>
                    <Paragraph><strong>Категории:</strong> {categories?.join(', ') || '—'}</Paragraph>
                    <Paragraph><strong>Страниц:</strong> {pageCount || '—'}</Paragraph>
                    <Paragraph><strong>Описание:</strong> {description || 'Нет описания'}</Paragraph>
                    <Paragraph><strong>Цитата:</strong> {searchInfo?.textSnippet || '—'}</Paragraph>

                    {retailPrice && (
                        <Paragraph>
                            <strong>Цена:</strong> {retailPrice.amount} {retailPrice.currencyCode}
                        </Paragraph>
                    )}

                    {buyLink && (
                        <a href={buyLink} target="_blank" rel="noreferrer">
                            <Button
                                icon={<ShoppingOutlined />}
                                size="small"
                                style={{ marginTop: 10 }}
                            >
                                Купить на сайте
                            </Button>
                        </a>
                    )}

                    <Button
                        icon={<ShoppingCartOutlined />}
                        type={inCart ? 'default' : 'primary'}
                        size="small"
                        style={{ marginTop: 10, marginLeft: 20 }}
                        onClick={handleAddToCart}
                        disabled={inCart}
                    >
                        {inCart ? 'Уже в корзине' : 'В корзину'}
                    </Button>
                </Card>
        </div>
    );
};

export default BookDetails;
