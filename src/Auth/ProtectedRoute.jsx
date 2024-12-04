import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SpinerContainer } from './SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, userRole, loading } = useAuth();

    // if (loading) {
    //     return <SpinerContainer>
    //         <TailSpin width='40' height='40' color='#2AD174' />
    //     </SpinerContainer>;
    // }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Si existen roles y el rol del usuario no está en la lista de roles permitidos, redirigir según su rol
    if (roles && !roles.includes(userRole)) {
        if (userRole === 2) {
            return <Navigate to="/planillero" />; // Redirigir a planillero si el rol es 2
        } else if (userRole === 1) {
            return <Navigate to="/admin/dashboard" />; // Redirigir a admin si el rol es 3
        }
    }

    return <Outlet />; // Permitir acceso si pasa todas las validaciones
};

export default ProtectedRoute;
