import { useCallback, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Spin, message, Select, Pagination, Button } from 'antd';
import BookCard from '../components/card';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/books.css';
import { 
    BookOutlined, 
    HeartOutlined, 
    RocketOutlined, 
    TrophyOutlined, 
    StarOutlined,
    HomeOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;



const Books = () => {
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortType, setSortType] = useState('default');
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const querySearch = queryParams.get('query');
    const category = queryParams.get('category');
    const finalQuery = querySearch || category || 'бестселлеры';

    const maxResults = 16;
    const categories = [
        { label: 'Фантастика', value: 'fantasy', icon: <RocketOutlined /> },
        { label: 'Бизнес', value: 'business', icon: <TrophyOutlined /> },
        { label: 'История', value: 'history', icon: <BookOutlined /> },
        { label: 'Роман', value: 'romance', icon: <HeartOutlined /> },
        { label: 'Детские', value: 'kids', icon: <StarOutlined /> },
    ];


    const fetchBooks = useCallback(async (pageNumber = 1) => {
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

            setBooks(newBooks);
            setTotal(totalItems);
            setPage(pageNumber);
        } catch (err) {
            console.error('Ошибка при загрузке книг:', err);
            message.error('Не удалось загрузить книги');
        } finally {
            setLoading(false);
        }
    }, [finalQuery]);

    const sortedBooks = useMemo(() => {
        return [...books].sort((a, b) => {
            const va = a.volumeInfo;
            const vb = b.volumeInfo;

            if (sortType === 'title') {
                return (va.title || '').localeCompare(vb.title || '');
            }
            if (sortType === 'date') {
                return new Date(vb.publishedDate || '') - new Date(va.publishedDate || '');
            }
            if (sortType === 'price') {
                const pa = a.saleInfo?.listPrice?.amount || 0;
                const pb = b.saleInfo?.listPrice?.amount || 0;
                return pa - pb;
            }
            return 0; // По умолчанию без сортировки
        });
    }, [books, sortType]);

    useEffect(() => {
        setBooks([]);
        setPage(1);
        fetchBooks(1);
    }, [querySearch, category, fetchBooks]);

    return (
        <div className="books-page" style={{ padding: '20px' }}>
            <div className="books-header">
                <Title level={1}>
                    {querySearch
                        ? `Результаты поиска: "${querySearch}"`
                        : category
                            ? `Категория: ${category}`
                            : '🔥 Книги на любой вкус'}
                </Title>
            </div>

            {loading && books.length === 0 ? (
                <div className="books-loading">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <div className='category-section'>
                        <div className="category-buttons">
                            <Button
                                type={!category && !querySearch ? 'primary' : 'default'}
                                onClick={() => navigate('/books')}
                                className="category-btn"
                                icon={<HomeOutlined />}
                            >
                                Все книги
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    onClick={() => navigate(`/books?category=${cat.value}`)}
                                    key={cat.value}
                                    type={category === cat.value ? 'primary' : 'default'}
                                    className="category-btn"
                                    icon={cat.icon}
                                >
                                    {cat.label}
                                </Button>
                            ))}
                            <Select value={sortType} onChange={setSortType} style={{ width: 260 }} className="books-sort category-btn">
                                <Option value="default">Без сортировки</Option>
                                <Option value="title">По названию (А–Я)</Option>
                                <Option value="date">По дате (сначала новые)</Option>
                                <Option value="price">По цене (сначала дешёвые)</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="books-grid">
                        <Row gutter={[16, 16]}>
                            {sortedBooks.map((book) => {
                                const volume = book.volumeInfo;
                                return (
                                    <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={book.id}>
                                        <div className="book-item">
                                            <BookCard
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
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                    
                    <div className="books-pagination">
                        <Pagination
                            current={page}
                            pageSize={maxResults}
                            total={Math.min(total, 1000)}
                            onChange={(newPage) => {
                                fetchBooks(newPage);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} книг`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Books;
