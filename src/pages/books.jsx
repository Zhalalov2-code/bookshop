import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Spin, message, Select, Pagination, Button } from 'antd';
import Navbar from '../components/navbar';
import Card from '../components/card';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const Books = () => {
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortType, setSortType] = useState('default')
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const querySearch = queryParams.get('query');
    const category = queryParams.get('category');
    const finalQuery = querySearch || category || 'бестселлеры';


    const maxResults = 18;
    const categories = [
        { label: 'Фантастика', value: 'fantasy' },
        { label: 'Бизнес', value: 'business' },
        { label: 'История', value: 'history' },
        { label: 'Роман', value: 'romance' },
        { label: 'Детские', value: 'kids' },
    ];


    const fetchBooks = useCallback(async (pageNumber = 1, isFirstLoad = false) => {
        setLoading(true);
        try {
            const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: finalQuery,
                    maxResults: maxResults,
                    startIndex: (pageNumber - 1) * maxResults,
                    langRestrict: 'ru',
                },
            });

            const newBooks = res.data.items || [];
            const totalItems = res.data.totalItems || 0;

            if (isFirstLoad) {
                setBooks(newBooks);
            } else {
                setBooks(prev => [...prev, ...newBooks]);
            }

            setTotal(totalItems);
            setPage(pageNumber);
        } catch (err) {
            console.error('Ошибка при загрузке книг:', err);
            message.error('Не удалось загрузить книги');
        } finally {
            setLoading(false);
        }
    }, [finalQuery]);

    const sortedBooks = [...books].sort((a, b) => {
        const va = a.volumeInfo;
        const vb = b.volumeInfo;

        if (sortType === 'title') {
            return (va.title || '').localeCompare(vb.title || '');
        };
        if (sortType === 'date') {
            return new Date(vb.publishedDate || '') - new Date(va.publishedDate || '');
        };
        if (sortType === 'price') {
            const pa = a.saleInfo?.listPrice?.amount || 0;
            const pb = b.saleInfo?.listPrice?.amount || 0;
            return pa - pb;
        };
        return (0);
    })

    useEffect(() => {
        setBooks([]);
        setPage(1);
        fetchBooks(1, true);
    }, [querySearch, category, fetchBooks]);

    const hasMore = books.length < total && books.length < 1000;

    return (
        <div style={{ padding: '20px' }}>
            <div>
                <Navbar />
                <Title level={2}>
                    {querySearch
                        ? `Результаты поиска: "${querySearch}"`
                        : category
                            ? `Категория: ${category}`
                            : '🔥 Книги на любой вкус'}
                </Title>
            </div>

            {loading && books.length === 0 ? (
                <Spin size="large" />
            ) : (
                <>
                    {hasMore && (
                        <div style={{ marginBottom: 20 }}>
                            <Select value={sortType} onChange={setSortType} style={{ width: 200 }}>
                                <Option value="default">Без сортировки</Option>
                                <Option value="title">По названию (А–Я)</Option>
                                <Option value="date">По дате (сначала новые)</Option>
                                <Option value="price">По цене (сначала дешёвые)</Option>
                            </Select>
                        </div>
                    )}
                    <div className='category-section'>
                        <Title level={3}>
                            📚 Жанры
                        </Title>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', height: 50, }}>
                            <Button
                                type={!category && !querySearch ? 'primary' : 'default'}
                                onClick={() => navigate('/books')}
                            >
                                Все книги
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    onClick={() => navigate(`/books?category=${cat.value}`)}
                                    key={cat.value}
                                    type={category === cat.value ? 'primary' : 'default'}
                                >
                                    {cat.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Row gutter={[16, 16]}>
                        {sortedBooks.map((book) => {
                            const volume = book.volumeInfo;
                            return (
                                <Col xs={24} sm={12} md={8} lg={4} xl={4} key={book.id}>
                                    <Card
                                        id={book.id}
                                        title={volume.title}
                                        authors={volume.authors}
                                        image={volume.imageLinks?.thumbnail}
                                        publishedDate={volume.publishedDate}
                                        category={volume.categories?.[0]}
                                        price={book.saleInfo?.listPrice?.amount}
                                        oldPrice={book.saleInfo?.retailPrice?.amount}
                                        currency={book.saleInfo?.listPrice?.currencyCode}
                                        buyLink={book.saleInfo?.buyLink}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                    <div style={{ marginLeft: 525, marginTop: 30, marginBottom: 30 }}>
                        <Pagination
                            current={page}
                            pageSize={maxResults}
                            total={Math.min(total, 1000)}
                            onChange={(newPage) => {
                                fetchBooks(newPage, true);
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Books;
