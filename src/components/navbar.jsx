import { Layout, Menu, Input } from 'antd';
import { HomeOutlined, BookOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Embel from '../img/embel.png'
import { useAuth } from './authContext';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { user } = useAuth();

    const items = [
        { label: "Главная", key: "/", icon: <HomeOutlined /> },
        { label: "Книги", key: "/books", icon: <BookOutlined /> },
        { label: "Корзина", key: "/basket", icon: <ShoppingCartOutlined /> },
        user
            ? { label: "Профиль", key: "/profil", icon: <UserOutlined /> }
            : { label: "Вход", key: "/login", icon: <UserOutlined /> }
    ];


    const handleMenuClick = (e) => {
        navigate(e.key);
    };

    const onSearch = (value) => {
        if (value.trim()) {
            navigate(`/books?query=${encodeURIComponent(value)}`);
        }
    };


    return (
        <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 20px' }}>
            <div
                style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    marginRight: '40px',
                    cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
            >
                <img style={{ marginTop: '30px' }} width={100} src={Embel} alt="" />
            </div>

            <Menu
                mode="horizontal"
                onClick={handleMenuClick}
                selectedKeys={[currentPath]}
                style={{ flex: 1 }}
                items={items}
            />

            <Search
                placeholder="Поиск книги..."
                allowClear
                enterButton
                onSearch={onSearch}
                style={{ width: 250, marginLeft: 'auto' }}
            />
        </Header>
    );
};

export default Navbar;
