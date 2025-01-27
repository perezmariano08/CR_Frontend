import React from 'react'
import { ModalSettingsItem, ModalSettingsUserWrapper } from '../ModalsStyles'
import { IoIosLogOut } from 'react-icons/io'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLogCurrentUser } from '../../../redux/user/userSlice';
import { FaUserCircle } from "react-icons/fa";
import { URL, URLImages } from '../../../utils/utils';

const ModalSettingsUser = ({ closeModal }) => {
    const dispatch = useDispatch();
    const usuarios = useSelector((state) => state.usuarios.data)

    const imgUsuarios = (idUsuario) => {
        const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario)
        return usuario ? usuario.img : null;
    };

    axios.defaults.withCredentials = true;
    const closeSesion = async () => {
        try {
            const response = await axios.post(`${URL}/auth/logout`, null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {

                localStorage.removeItem('token');
                localStorage.removeItem('id_usuario');

                // Limpia los encabezados de autorización de axios
                delete axios.defaults.headers.common['Authorization'];

                dispatch(setLogCurrentUser(false));
                closeModal();
                window.location.href = '/';
            } else {
                console.error('Error al cerrar sesión: ', response.statusText);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <ModalSettingsUserWrapper>
            <ModalSettingsItem to={'/planillero/mi-perfil'} onClick={closeModal} className='miperfil'>
                Perfil
                <FaUserCircle />
            </ModalSettingsItem>
            <ModalSettingsItem onClick={closeSesion}>
                Cerrar sesión
                <IoIosLogOut />
            </ModalSettingsItem>
        </ModalSettingsUserWrapper>
    )
}

export default ModalSettingsUser