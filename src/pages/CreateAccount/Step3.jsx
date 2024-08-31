import React, { useEffect, useState } from 'react'
import { CreateAccountContainerStyled, CreateAccountData, CreateAccountInputs, CreateAccountWrapper, InputContainer } from './CreateAccountStyles'
import Select from '../../components/Select/Select'
import { IoShieldHalf } from "react-icons/io5";
import { ButtonSubmit } from '../../components/UI/Button/ButtonStyles'
import { useDispatch, useSelector } from 'react-redux';
import { setNewUserTeamFavorite } from '../../redux/user/userSlice';
import axios from 'axios';
import { URL } from '../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice';
import { SpinerContainer } from '../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { ButtonLogin, LoginWrapperInfo } from '../Login/LoginStyles';

const Step3 = () => {
    const equiposList = useSelector((state) => state.equipos.data)
    const [teamSelected, setTeamSelected] = useState(0);
    const [handleError, setHandleError] = useState(false)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nuevoUsuario = useSelector((state) => state.newUser.newUser);

    const createAccount = async ({apellido, clave, dni, email, equipoFav, fechaNacimiento, nombre, telefono}) => {
        try {
            setLoading(true);
            toast.success('Se le ha enviado un email para verificar su cuenta');
            const response = await axios.post(`${URL}/auth/crear-cuenta`, {apellido, clave, dni, email, equipoFav, fechaNacimiento, nombre, telefono});
            if (response.status === 200) {
                // Esperar 3 segundos antes de redirigir
                setTimeout(() => {
                    setLoading(false);
                    navigate('/login');
                }, 2000);
            } 
        } catch (error) {
            console.error('Error en la solicitud HTTP:', error);
            toast.error('Error al registrar la cuenta');
        }
    };

    const handleSetTeamSelected = (e) => {
        setTeamSelected(e.target.value);
    }

    const handleNext = () => {
        setHandleError(true);

        if (teamSelected !== 0) {
            dispatch(setNewUserTeamFavorite(teamSelected));

            const usuario = {
                ...nuevoUsuario,
                equipoFav: teamSelected
            }
            createAccount(usuario);
        }
    }

    useEffect(() => {
        dispatch(fetchEquipos());
    }, [dispatch]);

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
                {
                loading ? (
                    <SpinerContainer>
                        <TailSpin width='40' height='40' color='#2AD174' />
                    </SpinerContainer>
                ) :
                (
                    <CreateAccountData>
                        <h2>Selecciona tu equipo favorito</h2>
                        <CreateAccountInputs>
                            <InputContainer>
                                <Select
                                    onChange={handleSetTeamSelected}
                                    data={equiposList}
                                    id_="id_equipo"
                                    placeholder='Seleccionar equipo'
                                    icon={<IoShieldHalf className='icon-select' />}
                                    value={teamSelected}
                                />
                                {handleError && teamSelected === 0 && (
                                    <p>Debe seleccionar un equipo para completar el registro</p>
                                )}
                            </InputContainer>
                        </CreateAccountInputs>
                        <ButtonLogin onClick={handleNext}>
                            {loading ? <LoaderIcon /> : 'Continuar'}
                        </ButtonLogin>
                    </CreateAccountData>
                )
                }
            </CreateAccountWrapper>
            <LoginWrapperInfo>
                <img src="./Logos/logoCopaRelampago.png" alt="Logo Copa Relampago" className='logo-cr' />
                <span>Elige tu Equipo Favorito</span>
                <h3>Selecciona tu equipo favorito para recibir todas las actualizaciones, resultados y noticias directamente en tu perfil. ¡Mantente al día con todo lo que ocurre en la Copa Relámpago!</h3>
            </LoginWrapperInfo>
            <Toaster />
        </CreateAccountContainerStyled>
    )
}

export default Step3;
