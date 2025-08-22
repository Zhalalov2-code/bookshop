import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Input, Button, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/register.css';
import Embel from '../img/embel.png';

const { Title } = Typography;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!email || !password || !name || !phone) {
            message.warning('Заполните все поля');
            return;
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            message.error('Введите корректный email');
            return;
        }

        // Валидация пароля
        if (password.length < 6) {
            message.error('Пароль должен содержать минимум 6 символов');
            return;
        }

        // Валидация телефона
        if (phone.length < 10) {
            message.error('Введите корректный номер телефона');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await axios.post('https://683f4d771cd60dca33def0f9.mockapi.io/users', {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name,
                phone,
                createdAt: new Date().toISOString()
            });

            message.success('Регистрация прошла успешно');
            navigate('/profil');
        } catch (err) {
            console.error('Ошибка при регистрации:', err);
            if (err.code === 'auth/email-already-in-use') {
                message.error('Пользователь с таким email уже существует');
            } else if (err.code === 'auth/weak-password') {
                message.error('Пароль слишком слабый');
            } else {
                message.error('Ошибка при регистрации');
            }
        }
    };

    return (
        <div className='body-register'>
            <Title className='title-register' level={2}>Регистрация</Title>
            <img className='img-login' src={Embel} alt="" />
            <Input
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={11}
                style={{ marginBottom: 10 }}
            />

            <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input.Password
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Button type="primary" onClick={handleRegister} block>
                Зарегистрироваться
            </Button>
            <br />
            <br />
            <Link className='link' to="/login">Уже есть аккаунт</Link>
        </div>
    );
};

export default Register;
