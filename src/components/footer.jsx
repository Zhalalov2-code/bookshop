import React from 'react';
import { Typography, Divider } from 'antd';
import { BookOutlined, HeartOutlined, ShoppingOutlined } from '@ant-design/icons';
import '../css/footer.css';

const { Text, Title } = Typography;

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <Title level={4}>
                        <BookOutlined /> BOOK SHOP
                    </Title>
                    <Text>Ваш надежный источник качественной литературы</Text>
                </div>
                
                <Divider type="vertical" style={{ height: 'auto' }} />
                
                <div className="footer-section">
                    <Title level={5}>О нас</Title>
                    <Text>Мы предлагаем широкий выбор книг различных жанров</Text>
                </div>
                
                <Divider type="vertical" style={{ height: 'auto' }} />
                
                <div className="footer-section">
                    <Title level={5}>Контакты</Title>
                    <Text>Email: info@bookshop.com</Text><br />
                    <Text>Телефон: +7 (999) 123-45-67</Text>
                </div>
                
                <Divider type="vertical" style={{ height: 'auto' }} />
                
                <div className="footer-section">
                    <Title level={5}>Социальные сети</Title>
                    <div className="social-links">
                        <Text><HeartOutlined /> ВКонтакте</Text><br />
                        <Text><ShoppingOutlined /> Telegram</Text>
                    </div>
                </div>
            </div>
            
            <Divider />
            
            <div className="footer-bottom">
                <Text>© 2024 BOOK SHOP. Все права защищены.</Text>
            </div>
        </footer>
    );
};

export default Footer;
