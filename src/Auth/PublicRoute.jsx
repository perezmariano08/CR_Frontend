import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SpinerContainer } from './SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const PublicRoute = () => {
    const { isAuthenticated, userRole, loading } = useAuth();

    if (loading) {
        return <SpinerContainer>
            <TailSpin width='40' height='40' color='#2AD174' />
        </SpinerContainer>;
    }

    if (isAuthenticated) {
        if (userRole === 2) {
            return <Navigate to="/planillero" />; // Redirigir a planillero si el rol es 2
        } else if (userRole === 1) {
            return <Navigate to="/admin/dashboard" />; // Redirigir a admin si el rol es 3
        } else {
            return <Navigate to="/" />; // Redirigir a home si el usuario no es planillero ni admin
        }
    }

    return <Outlet />; // Permitir acceso si no está autenticado
};

export default PublicRoute;
