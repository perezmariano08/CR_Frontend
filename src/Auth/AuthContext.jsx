import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../utils/utils';
import { TailSpin } from 'react-loader-spinner';
import { SpinerContainer } from './SpinerStyles';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [user, setUser] = useState(null);
    const [showWelcomeToast, setShowWelcomeToast] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.get(`${URL}/auth/check-authentication`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setUserRole(response.data.usuario.id_rol);
                    setUserName(response.data.usuario.nombre);
                    setUserId(response.data.usuario.id_usuario);
                    setUser(response.data.usuario);
                    setShowWelcomeToast(true);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUserRole(null);
                setUserName(null);
                setUser(null);
                setShowWelcomeToast(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userRole, userName, user, showWelcomeToast, setShowWelcomeToast, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
