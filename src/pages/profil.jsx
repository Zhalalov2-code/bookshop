import { useEffect, useState } from 'react';
import { useAuth } from '../components/authContext';
import axios from 'axios';
import { Input, Button, Typography, message, Avatar, Spin, Modal } from 'antd';
import '../css/profil.css';
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function Profil() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState({
        name: false,
        phone: false,
        avatar: false
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const res = await axios.get(`https://683f4d771cd60dca33def0f9.mockapi.io/users?uid=${user.uid}`);
                if (res.data.length > 0) {
                    setProfile(res.data[0]);
                } else {
                    message.error('Профиль не найден');
                }
            } catch (err) {
                message.error('Ошибка при загрузке профиля');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleUpdate = async () => {
        if (!profile || !profile.id) return;
        try {
            await axios.put(`https://683f4d771cd60dca33def0f9.mockapi.io/users/${profile.id}`, profile);
            message.success('Профиль обновлён');
            setEditMode({ name: false, phone: false, avatar: false });
        } catch (err) {
            message.error('Ошибка при обновлении профиля');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при выходе:', err);
        }
    };

    const confirmDeleteAccount = () => {
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleModalOk = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                message.error('Пользователь не найден');
                return;
            }

            if (profile?.id) {
                await axios.delete(`https://683f4d771cd60dca33def0f9.mockapi.io/users/${profile.id}`);
            }

            await deleteUser(currentUser);
            message.success('Аккаунт удалён');
            setIsModalVisible(false);
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при удалении аккаунта:', err);
            if (err.code === 'auth/requires-recent-login') {
                message.error('Для удаления аккаунта требуется повторный вход');
            } else {
                message.error('Не удалось удалить аккаунт');
            }
        }
    };

    if (!user) return <div>Сначала войдите в аккаунт</div>;

    return (
        <div className="body-profil">
            <div className="profil-content">
                <Title level={2}>Профиль пользователя</Title>

                {loading ? (
                    <Spin size="large" tip="Загрузка профиля..." />
                ) : profile && (
                    <div className="profile-form">
                        <div style={{ marginBottom: 20, textAlign: 'center' }}>
                            <Avatar src={profile.avatar} size={200} />
                        </div>

                        <div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Фото:</Text><br />
                                {editMode.avatar ? (
                                    <Input
                                        value={profile.avatar}
                                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                                        style={{ width: 300 }}
                                    />
                                ) : (
                                    <Text>{profile.avatar || '—'}</Text>
                                )}
                                <Button
                                    type="link"
                                    onClick={() => setEditMode({ ...editMode, avatar: !editMode.avatar })}
                                >
                                    Изменить
                                </Button>
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Имя:</Text><br />
                                {editMode.name ? (
                                    <Input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        style={{ width: 300 }}
                                    />
                                ) : (
                                    <Text>{profile.name || '—'}</Text>
                                )}
                                <Button
                                    type="link"
                                    onClick={() => setEditMode({ ...editMode, name: !editMode.name })}
                                >
                                    Изменить
                                </Button>
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Телефон:</Text><br />
                                {editMode.phone ? (
                                    <Input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        style={{ width: 300 }}
                                    />
                                ) : (
                                    <Text>{profile.phone || '—'}</Text>
                                )}
                                <Button
                                    type="link"
                                    onClick={() => setEditMode({ ...editMode, phone: !editMode.phone })}
                                >
                                    Изменить
                                </Button>
                            </div>

                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Email:</Text><br />
                                <Text>{profile.email}</Text>
                            </div>

                            <Button type="primary" onClick={handleUpdate}>
                                💾 Сохранить изменения
                            </Button>
                            <Button style={{ marginLeft: 20 }} onClick={handleLogout}>
                                Выйти
                            </Button>
                            <Button
                                style={{ marginLeft: 20 }}
                                danger
                                onClick={confirmDeleteAccount}
                            >
                                Удалить аккаунт
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                title="Удалить аккаунт?"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Удалить"
                okType="danger"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить аккаунт? Это действие невозможно отменить.</p>
            </Modal>
        </div>
    );
}

export default Profil;
