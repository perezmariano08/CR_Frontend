import React, { useState } from 'react'
import { CreateAccountContainerStyled, CreateAccountData, CreateAccountInputs, CreateAccountWrapper, ErrorContainer, InputContainer } from './CreateAccountStyles'
import Input from '../../components/UI/Input/Input'
import { NavLink } from 'react-router-dom'
import InputCalendar from '../../components/UI/Input/InputCalendar'
import { AiOutlineMail, AiOutlineMobile, AiOutlineUser } from 'react-icons/ai'
import { IoWarningOutline } from "react-icons/io5";
import { PiIdentificationCardLight } from "react-icons/pi";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { setNewUser } from '../../redux/user/userSlice'
import axios from 'axios';
import { URL } from '../../utils/utils'
import { Toaster, toast, LoaderIcon } from 'react-hot-toast';
import { ButtonLogin, LoginWrapperInfo } from '../Login/LoginStyles'


const CreateAccount = () => {
    const [dniExists, setDniExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch()

    const checkEmail = async (email) => {
        try {
            const bandera = false
            const response = await axios.post(`${URL}/auth/check-email`, { email, bandera });
            const emailExists = response.status === 200;
            setEmailExists(emailExists);

            return emailExists;
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            return false;
        }
    };

    const checkDni = async (dni) => {
        try {
            const response = await axios.post(`${URL}/auth/check-dni`, { dni });
            const dniExists = response.status === 200;
            setDniExists(dniExists);
            return dniExists;
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            setDniExists(false);
            return false;
        }
    };

    const fechaTransform = (fecha) => {
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        return `${año}/${mes}/${dia}`;
    }

    const regexDni = /\d{6}$/;
    const regexPhone = /\d{9}$/;

    const validationSchema = Yup.object({
        dni: Yup.string()
            .matches(regexDni, "Minimo de 6 caracteres")
            .trim()
            .required("Este campo es requerido"),
        nombre: Yup.string()
            .trim()
            .matches(/^[^\d]+$/, "El nombre no debe contener números")
            .required("Este campo es requerido"),
        apellido: Yup.string()
            .trim()
            .matches(/^[^\d]+$/, "El apellido no debe contener números")
            .required("Este campo es requerido"),
        fechaNacimiento: Yup.date().required("Este campo es requerido"),
        telefono: Yup.string()
            .matches(regexPhone, "Minimo de 9 caracteres")
            .trim()
            .required("Este campo es requerido"),
        email: Yup.string()
            .email("Correo electronico invalido")
            .trim()
            .required("Este campo es requerido"),
    });

    const { getFieldProps, handleSubmit, errors, touched } = useFormik({
        initialValues: {
            dni: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            telefono: '',
            email: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            const emailAvailable = await checkEmail(values.email);
            const dniAvailable = await checkDni(values.dni);
            if (!emailAvailable || !dniAvailable) {
                toast.error('Por favor, corrobore los campos antes de continuar');
            } else {
                values.fechaNacimiento = fechaTransform(values.fechaNacimiento);
                dispatch(setNewUser(values));
                resetForm();
                nextPage();
            }
            setIsLoading(false);
            setFormSubmitted(true);
        }
    });

    const nextPage = () => {
        window.location.href = '/create-password';
    }

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
                <CreateAccountData>
                    <h2>Creá tu cuenta</h2>
                    <CreateAccountInputs onSubmit={handleSubmit}>
                        <InputContainer>
                            <Input
                                isError={errors.dni && touched.dni}
                                errorMessage={errors.dni}
                                icon={<PiIdentificationCardLight className='icon-input' />}
                                placeholder={'DNI'}
                                name={'dni'}
                                id={'dni'}
                                inputMode={'numeric'}
                                {...getFieldProps('dni')}
                            />
                            {formSubmitted && !dniExists && (
                                <ErrorContainer>
                                    <IoWarningOutline />
                                    <p>DNI existente, por favor ingrese otro</p>
                                </ErrorContainer>
                            )}
                        </InputContainer>

                        <InputContainer>
                            <Input
                                isError={errors.nombre && touched.nombre}
                                errorMessage={errors.nombre}
                                icon={<AiOutlineUser className='icon-input' />}
                                placeholder={'Nombre'}
                                name={'nombre'}
                                id={'nombre'}
                                {...getFieldProps('nombre')}
                            />
                        </InputContainer>

                        <InputContainer>
                            <Input
                                isError={errors.apellido && touched.apellido}
                                errorMessage={errors.apellido}
                                icon={<AiOutlineUser className='icon-input' />}
                                placeholder={'Apellido'}
                                name={'apellido'}
                                id={'apellido'}
                                {...getFieldProps('apellido')}
                            />
                        </InputContainer>

                        <InputContainer>
                            <InputCalendar
                                isError={errors.fechaNacimiento && touched.fechaNacimiento}
                                errorMessage={errors.fechaNacimiento}
                                placeholder={"Fecha de nacimiento"}
                                name={'fechaNacimiento'}
                                id={'fechaNacimiento'}
                                {...getFieldProps('fechaNacimiento')}
                            />
                        </InputContainer>

                        <InputContainer>
                            <Input
                                isError={errors.telefono && touched.telefono}
                                errorMessage={errors.telefono}
                                icon={<AiOutlineMobile className='icon-input' />}
                                placeholder={'Telefono'}
                                name={'telefono'}
                                id={'telefono'}
                                inputMode={'numeric'}
                                {...getFieldProps('telefono')}
                            />
                        </InputContainer>

                        <InputContainer>
                            <Input
                                isError={errors.email && touched.email}
                                errorMessage={errors.email}
                                icon={<AiOutlineMail className='icon-input' />}
                                type="email"
                                placeholder={'Email'}
                                name={'email'}
                                id={'email'}
                                {...getFieldProps('email')}
                            />
                            {formSubmitted && !emailExists && (
                                <ErrorContainer>
                                    <IoWarningOutline />
                                    <p>Correo electronico existente, por favor ingrese otro</p>
                                </ErrorContainer>
                            )}
                        </InputContainer>
                        <ButtonLogin type='submit'>
                            {isLoading ? (
                                <>
                                    <LoaderIcon />
                                </>
                            ) : (
                                'Continuar'
                            )}
                        </ButtonLogin>
                    </CreateAccountInputs>
                </CreateAccountData>
                <p>¿Ya tienes cuenta? <NavLink to={'/login'}>Inicia Sesion</NavLink></p>
            </CreateAccountWrapper>

            <LoginWrapperInfo>
                <img src="./Logos/logoCopaRelampago.png" alt="Logo Copa Relampago" className='logo-cr' />
                <span>Únete a la Competencia</span>
                <h3>Crea tu cuenta para seguir a tus equipos favoritos, ver resultados y disfrutar de toda la emoción de Copa Relámpago. ¡Forma parte del torneo! </h3>
            </LoginWrapperInfo>
            <Toaster />
        </CreateAccountContainerStyled>
    )
}

export default CreateAccount
