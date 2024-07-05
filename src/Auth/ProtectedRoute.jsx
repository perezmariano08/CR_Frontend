import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ role }) => {
    const { isAuthenticated, userRole, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && role !== userRole) {
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
