import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { Spin } from 'antd';

const PrivatRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                <Spin size="large" tip="Загрузка..." />
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivatRoute;
