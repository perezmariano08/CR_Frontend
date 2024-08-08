import React, { useState } from "react";
import { BackToLogin, CreateAccountContainerStyled, CreateAccountData, CreateAccountInputs, CreateAccountWrapper, ForgotPasswordTitle, InputContainer } from "../../CreateAccount/CreateAccountStyles";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { PiWarningCircleLight } from "react-icons/pi";
import { AiOutlineMail } from 'react-icons/ai';
import Input from "../../../components/UI/Input/Input";
import { ButtonLogin } from "../LoginStyles";
import { URL } from "../../../utils/utils";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };

    const checkEmail = async (email) => {
        try {
            setLoading(true)
            const response = await axios.post(`${URL}/auth/check-email`, { email, bandera: true });
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('Email no registrado en la base de datos');
            } else {
                toast.error('Error al procesar la solicitud');
            }
            console.error("Error en la solicitud HTTP:", error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false)
        }
    };

    const sendEmail = async (email) => {
        try {
            setLoading(true);
            const response = await axios.post(`${URL}/auth/forgot-password`, { email });
            if (response.status === 200) {
                toast.success('Mail de recuperación enviado');
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error.response?.data || error.message);
            toast.error('Error al enviar el mail de recuperación');
        } finally {
            setLoading(false);
        }
    };

    const handleSendForgotEmail = async () => {
        if (!email) {
            toast.error('Por favor, ingrese un email válido');
            return;
        }

        const emailExists = await checkEmail(email);
        if (emailExists) {
            await sendEmail(email);
        }

        setEmail('')
    };

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
                <CreateAccountData>
                    <ForgotPasswordTitle>
                        <PiWarningCircleLight/>
                        <h2>Recuperar contraseña</h2>
                    </ForgotPasswordTitle>
                    <p>Ingrese su mail y le enviaremos un link para la recuperación de su contraseña.</p>
                    <CreateAccountInputs>
                        <InputContainer>
                            <Input
                                placeholder='example@mail.com'
                                icon={<AiOutlineMail className='icon-input' />}
                                required
                                value={email}
                                onChange={handleSetEmail}
                            />
                        </InputContainer>
                    </CreateAccountInputs>
                    <ButtonLogin
                        disabled={!email}
                        onClick={handleSendForgotEmail}
                    >
                        {
                            loading ? (
                                <>
                                    <LoaderIcon/>
                                </>
                            ) : (
                                <>
                                    Enviar
                                </>
                            )
                        }
                    </ButtonLogin>
                    <BackToLogin to='/login'>
                        <IoIosArrowBack/>
                        Volver al login
                    </BackToLogin>
                </CreateAccountData>
            </CreateAccountWrapper>
            <Toaster />
        </CreateAccountContainerStyled>
    );
};

export default ForgotPassword;
