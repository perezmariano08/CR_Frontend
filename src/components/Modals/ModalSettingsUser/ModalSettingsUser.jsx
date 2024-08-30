import React from 'react'
import { ModalSettingsItem, ModalSettingsUserWrapper } from '../ModalsStyles'
import { IoIosLogOut } from 'react-icons/io'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLogCurrentUser } from '../../../redux/user/userSlice';
import { useAuth } from '../../../Auth/AuthContext';
import { URL, URLImages } from '../../../utils/utils';

const ModalSettingsUser = ({closeModal }) => {
    const dispatch = useDispatch(); // Obtener el dispatcher
    const usuarios = useSelector((state) => state.usuarios.data)
    const {userName, showWelcomeToast, setShowWelcomeToast, userId} = useAuth()

    const imgUsuarios = (idUsuario) => {
        const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario)
        return usuario ? usuario.img : null;
    };

    //  Cerrar Sesion 
    axios.defaults.withCredentials = true;
    const closeSesion = async () => {
        try {
            // Realiza la solicitud de cierre de sesión al servidor
            const response = await axios.post(`${URL}/auth/logout`, null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.status === 200) {
                // Si la respuesta es exitosa, elimina el token del almacenamiento local
                localStorage.removeItem('token');
                // Limpia los encabezados de autorización de axios
                delete axios.defaults.headers.common['Authorization'];
                // Actualiza el estado de autenticación y redirige al usuario a la página de inicio de sesión
                dispatch(setLogCurrentUser(false));
                closeModal(); // Cerrar el modal después de cerrar sesión
                window.location.href = '/login';
            } else {
                // Maneja errores que no sean de autorización (401)
                console.error('Error al cerrar sesión: ', response.statusText);
            }
        } catch (error) {
            // Maneja cualquier otro error que pueda ocurrir durante la solicitud
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <ModalSettingsUserWrapper>
            <ModalSettingsItem>
                Perfil
                <img src={`${URLImages}${imgUsuarios(userId)}`} />
            </ModalSettingsItem>
            <ModalSettingsItem onClick={closeSesion}>
                Cerrar sesión
                <IoIosLogOut />
            </ModalSettingsItem>
        </ModalSettingsUserWrapper>
    )
}

export default ModalSettingsUser