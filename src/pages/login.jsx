import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGooglePopup } from '../firebase/firebase';
import { Input, Button, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Embel from '../img/embel.png'
import '../css/login.css'
import { GoogleOutlined } from '@ant-design/icons';



const { Title } = Typography;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            message.error('Введите email и пароль');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await axios.get(`https://683f4d771cd60dca33def0f9.mockapi.io/users?uid=${firebaseUser.uid}`);
            if (response.data.length === 0) {
                message.error('Аккаунт не найден в базе');
                return;
            }

            message.success('Успешный вход');
            navigate('/profil');
        } catch (err) {
            console.error(err);
            message.error('Неправильный пароль или логин');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGooglePopup();
            const firebaseUser = result.user;

            const response = await axios.get(`https://683f4d771cd60dca33def0f9.mockapi.io/users?uid=${firebaseUser.uid}`);
            const users = response.data;

            if (!users || users.length === 0) {
                await axios.post('https://683f4d771cd60dca33def0f9.mockapi.io/users', {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || 'Без имени',
                    avatar: firebaseUser.photoURL || '',
                    createdAt: new Date().toISOString()
                });
            }

            message.success('Успешный вход через Google');
            navigate('/profil');
        } catch (err) {
            console.error(err);
            message.error('Ошибка входа через Google');
        }
    }

    return (
        <div className='body-login'>
            <div className='content-section'>
                <div>
                    <Title className='title-login' level={2}>Вход в аккаунт</Title>
                    <img className='img-login' src={Embel} alt="" />
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
                    <Button type="primary" onClick={handleLogin} block>
                        Войти
                    </Button>
                    <br />
                    <br />
                    <Link className='link' to={'/register'}>Зарегистрироваться</Link>
                </div>
                <br />
                <br />
                <div>
                    <Button
                        type="primary"
                        icon={<GoogleOutlined />}
                        onClick={handleGoogleLogin}
                        style={{ width: '100%', marginTop: 10 }}
                    >
                        Войти через Google
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
