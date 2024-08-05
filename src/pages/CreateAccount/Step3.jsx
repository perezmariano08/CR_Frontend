import React, { useEffect, useState } from 'react'
import { CreateAccountContainerStyled, CreateAccountData, CreateAccountInputs, CreateAccountWrapper, InputContainer } from './CreateAccountStyles'
import Select from '../../components/Select/Select'
import { IoShieldHalf } from "react-icons/io5";
import { ButtonSubmit } from '../../components/UI/Button/ButtonStyles'
import { useDispatch, useSelector } from 'react-redux';
import { setNewUserTeamFavorite } from '../../redux/user/userSlice';
import axios from 'axios';
import { URL } from '../../utils/utils';
import { Toaster, toast } from 'react-hot-toast';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice';

const Step3 = () => {
    const equiposList = useSelector((state) => state.equipos.data)
    const [teamSelected, setTeamSelected] = useState(0);
    const [handleError, setHandleError] = useState(false)
    const dispatch = useDispatch()

    const nuevoUsuario = useSelector((state) => state.newUser.newUser);

    const createAccount = async ({apellido, clave, dni, email, equipoFav, fechaNacimiento, nombre, telefono}) => {
        try {
            const response = await axios.post(`${URL}/auth/crear-cuenta`, {apellido, clave, dni, email, equipoFav, fechaNacimiento, nombre, telefono});
            if (response.status === 200) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error en la solicitud HTTP:', error);
            toast.error('Error al registrar la cuenta')
        }
    };

    const handleSetTeamSelected = (e) => {
        setTeamSelected(e.target.value)
    }

    const handleNext = () => {
        setHandleError(true); 

        if (teamSelected !== 0) {
            dispatch(setNewUserTeamFavorite(teamSelected))

            const usuario = {
                ...nuevoUsuario,
                equipoFav: teamSelected
            }
            createAccount(usuario)
        }
    }

    useEffect(() => {
        dispatch(fetchEquipos());
    }, []);

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
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
                            {handleError && teamSelected === '' && (
                                <p>Debe seleccionar un equipo para completar el registro</p>
                        )}
                        </InputContainer>
                    </CreateAccountInputs>
                    <ButtonSubmit
                    onClick={handleNext}
                    >Crear cuenta</ButtonSubmit>
                </CreateAccountData>
            </CreateAccountWrapper>
            <Toaster/>
        </CreateAccountContainerStyled>
    )
}

export default Step3