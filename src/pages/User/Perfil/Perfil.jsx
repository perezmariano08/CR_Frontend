import React, { useEffect, useState } from 'react';
import { ButtonContainer, PerfilContainer, PerfilContentWrapper, PerfilMiEquipo, PerfilMisDatos, PerfilWrapper } from './PerfilStyles';
import { URL, URLImages } from '../../../utils/utils';
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import useForm from '../../../hooks/useForm';
import { useAuth } from '../../../Auth/AuthContext';
import { AiOutlineMail, AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { IoShieldHalf } from "react-icons/io5";
import { toast, Toaster, LoaderIcon } from 'react-hot-toast';
import { PiIdentificationCardLight } from "react-icons/pi";
import { useEquipos } from '../../../hooks/useEquipos';
import Select from '../../../components/Select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import axios from 'axios';

const Perfil = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const equipos = useSelector((state) => state.equipos.data);
    const token = localStorage.getItem('token')

    const { escudosEquipos, nombresEquipos } = useEquipos();    

    const initialFormState = {
        nombre_usuario: user.nombre || '',
        apellido_usuario: user.apellido || '',
        email_usuario: user.email || '',
        equipo_usuario: user.id_equipo || '',
        clave_usuario: '',
        dni_usuario: user.dni || ''
    };

    const [formState, handleFormChange] = useForm(initialFormState);
    const [teamSelected, setTeamSelected] = useState(user.id_equipo || '');
    const [isFormModified, setIsFormModified] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!equipos) {
            dispatch(fetchEquipos());
        }
    }, [dispatch, equipos]);

    useEffect(() => {
        const isModified = Object.keys(formState).some(key => formState[key] !== initialFormState[key]);
        setIsFormModified(isModified);
    }, [formState, initialFormState]);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setTeamSelected(selectedValue); // Actualizar teamSelected
        handleFormChange(event);
    };

    const validatePassword = (newPassword) => {
        if (newPassword.trim().length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        } else if (newPassword.trim().split('').filter(char => !isNaN(parseInt(char))).length < 3) {
            setPasswordError('La contraseña debe contener al menos tres números.');
        } else if (!/[A-Z]/.test(newPassword)) {
            setPasswordError('La contraseña debe contener al menos una mayúscula.');
        } else {
            setPasswordError('');
        }
    };

    const handlePasswordChange = (event) => {
        const { value } = event.target;
        handleFormChange(event);
        validatePassword(value);
    };

    const handleSubmit = async () => {
        if (passwordError) return;

        setIsSubmitting(true);

        const userProfileData = {
            id_usuario: user.id_usuario,
            dni: formState.dni_usuario,
            nombre: formState.nombre_usuario,
            apellido: formState.apellido_usuario,
            fechaNacimiento: '',
            telefono: '',
            email: formState.email_usuario,
            clave: formState.clave_usuario,
            id_equipo: parseInt(teamSelected)
        };
        try {
            const response = await axios.post(`${URL}/user/update-perfil`, userProfileData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Perfil actualizado con éxito');
            if (formState.email_usuario !== user.email) {
                toast.success('Se ha enviado un email de verificación a tu nuevo correo');
            }
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            toast.error('Error al actualizar perfil');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PerfilContainer>
            <PerfilWrapper>
                <PerfilContentWrapper>
                    <h2>Mi equipo favorito</h2>
                    <PerfilMiEquipo>
                        <img src={`${URLImages}${escudosEquipos(user.id_equipo)}`} alt="Escudo equipo" />
                        {nombresEquipos(user.id_equipo)}
                    </PerfilMiEquipo>
                    <h2>Mis datos</h2>
                    <PerfilMisDatos>
                        {/* <ModalFormInputContainer>
                            Cambiar equipo favorito
                            <Select
                                onChange={handleSelectChange}
                                data={equipos}
                                id_="id_equipo"
                                placeholder='Seleccionar equipo'
                                icon={<IoShieldHalf className='icon-select' />}
                                value={teamSelected}
                            />
                        </ModalFormInputContainer> */}
                        <ModalFormInputContainer>
                            Nombre/s
                            <Input
                                name='nombre_usuario'
                                type='text'
                                placeholder="Nombre"
                                icon={<AiOutlineUser className='icon-input' />}
                                value={formState.nombre_usuario}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            DNI
                            <Input
                                name='dni_usuario'
                                type='text'
                                placeholder="DNI"
                                icon={<PiIdentificationCardLight className='icon-input' />}
                                value={formState.dni_usuario}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            Apellido/s
                            <Input
                                name='apellido_usuario'
                                type='text'
                                placeholder="Apellido"
                                icon={<AiOutlineUser className='icon-input' />}
                                value={formState.apellido_usuario}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            Email
                            <Input
                                name='email_usuario'
                                type='email'
                                placeholder="Email"
                                icon={<AiOutlineMail className='icon-input' />}
                                value={formState.email_usuario}
                                onChange={handleFormChange}
                            />
                            {user.estado === 'P' && <p className="error">Debes verificar el email</p>}
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            Cambiar clave
                            <Input
                                name='clave_usuario'
                                type='password'
                                placeholder="Clave"
                                icon={<AiOutlineLock className='icon-input' />}
                                value={formState.clave_usuario}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && <p className="error">{passwordError}</p>}
                        </ModalFormInputContainer>
                    </PerfilMisDatos>
                    <ButtonContainer>
                        <button
                            className={!isFormModified || !!passwordError || isSubmitting ? 'disabled' : ''}
                            // disabled={!isFormModified || !!passwordError || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? <LoaderIcon /> : 'Actualizar perfil'}
                        </button>
                    </ButtonContainer>
                </PerfilContentWrapper>
            </PerfilWrapper>
            <Toaster />
        </PerfilContainer>
    );
};

export default Perfil;
