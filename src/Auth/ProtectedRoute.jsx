import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SpinerContainer } from './SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, userRole, loading } = useAuth();

    if (loading) {
        return <SpinerContainer>
            <TailSpin width='40' height='40' color='#2AD174' />
        </SpinerContainer>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(userRole)) {
        if (userRole === 3) {
            return <Navigate to="/" />;
        } else if (userRole === 2) {
            return <Navigate to="/planillero" />;
        } else {
            return <Navigate to="/admin/dashboard" />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
