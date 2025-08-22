import { useNavigate } from 'react-router-dom';
import { Input, Typography, message, Spin } from 'antd';
import '../css/main.css';
import BookCard from '../components/card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Embel from '../img/embel.png'

const { Title } = Typography;
const { Search } = Input;

const Home = () => {
    const navigate = useNavigate();
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPopular = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: 'best seller',
                    maxResults: 40,
                    langRestrict: 'ru',
                },
            });
            if (response.status === 200) {
                setPopular(response.data.items || []);
            }
        } catch (err) {
            console.error('Ошибка при загрузке книг:', err);
            if (err.response?.status === 429) {
                message.error('Превышен лимит запросов. Попробуйте позже.');
            } else {
                message.error('Не удалось загрузить книги');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopular();
    }, []);

    const onSearch = (value) => {
        navigate(`/books?query=${encodeURIComponent(value)}`);
    };


    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className='body-main'>
            <div className="title-section">
                <Title className="title" level={2}>
                    <img className='embel' src={Embel} alt="" /> <br />Добро пожаловать в BookShop!
                </Title>

                <Search
                    placeholder="Найти книгу..."
                    enterButton="Поиск"
                    size="large"
                    onSearch={onSearch}
                    style={{ maxWidth: 400, margin: '20px 0' }}
                />
            </div>

            <div>
                <Title level={3}>🔥 Популярные книги</Title>
                <Spin spinning={loading} tip="Загрузка книг...">
                    <Slider {...sliderSettings}>
                        {popular.map((book) => (
                            <div key={book.id} style={{ padding: '0 10px' }}>
                                <BookCard
                                    id={book.id}
                                    title={book.volumeInfo.title}
                                    authors={book.volumeInfo.authors}
                                    image={book.volumeInfo.imageLinks?.thumbnail}
                                    publishedDate={book.volumeInfo.publishedDate}
                                    category={book.volumeInfo.categories?.[0]}
                                    price={book.saleInfo?.retailPrice?.amount}
                                    oldPrice={null}
                                    currency={book.saleInfo?.retailPrice?.currencyCode}
                                    buyLink={book.saleInfo?.buyLink}
                                />
                            </div>
                        ))}
                    </Slider>
                </Spin>
            </div>
        </div>
    );
};

export default Home;
