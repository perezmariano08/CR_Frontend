import React, { useState } from 'react'
import { CreateAccountContainerStyled, CreateAccountData, CreateAccountInputs, CreateAccountWrapper, InputContainer } from './CreateAccountStyles'
import Select from '../../components/Select/Select'
import { dataEquipos } from '../../Data/Equipos/DataEquipos'
import { IoShieldHalf } from "react-icons/io5";
import { ButtonSubmit } from '../../components/UI/Button/ButtonStyles'
import { useDispatch, useSelector } from 'react-redux';
import { setNewUserTeamFavorite } from '../../redux/user/userSlice';
import axios from 'axios';
import { URL } from '../../utils/utils';
import { Toaster, toast } from 'react-hot-toast';

const Step3 = () => {

    const [teamSelected, setTeamSelected] = useState(0);
    const [handleError, setHandleError] = useState(false)
    const dispatch = useDispatch()

    const nuevoUsuario = useSelector((state) => state.newUser.newUser);

    const createAccount = async ({apellido, clave, dni, email, equipoFav, fechaNacimiento, nombre, telefono}) => {
        try {
            const response = await axios.post(`${URL}/auth/crear-cuenta`, {apellido, clave, dni, email, equipoFav, fechaNacimiento, nombre, telefono});
            if (response.status === 200) {
                console.log('Cuenta creada exitosamente');
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
            console.log(usuario);
        }
    }

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
                <CreateAccountData>
                    <h2>Selecciona tu equipo favorito</h2>
                    <CreateAccountInputs>
                        <InputContainer>
                            <Select
                            onChange={handleSetTeamSelected} 
                            data={dataEquipos} 
                            placeholder={'Seleccionar equipo'} 
                            icon={<IoShieldHalf className='icon-select' />}>
                            </Select>
                            {
                                handleError && teamSelected === 0 && (
                                    <p>Debe seleccionar un equipo para completar el registro</p>
                                )
                            }

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