import React, { useEffect, useState } from "react";
import {
    BackToLogin,
    CreateAccountContainerStyled,
    CreateAccountData,
    CreateAccountInputs,
    CreateAccountWrapper,
    ForgotPasswordTitle,
    InputContainer,
} from "../../CreateAccount/CreateAccountStyles";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { PiWarningCircleLight } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import Input from "../../../components/UI/Input/Input";
import { ButtonLogin, LoginWrapperInfo } from "../LoginStyles";
import { URL } from "../../../utils/utils";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resend, setResend] = useState(false);
    const [counter, setCounter] = useState(0);

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };

    const checkEmail = async (email) => {
        try {
            setLoading(true);
            const response = await axios.post(`${URL}/auth/check-email`, { email, bandera: true });
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("Email no registrado en la base de datos");
            } else {
                toast.error("Error al procesar la solicitud");
            }
            console.error("Error en la solicitud HTTP:", error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const sendEmail = async (email) => {
        try {
            setLoading(true);
            const response = await axios.post(`${URL}/auth/forgot-password`, { email });
            if (response.status === 200) {
                toast.success("Mail de recuperación enviado");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error.response?.data || error.message);
            toast.error("Error al enviar el mail de recuperación");
        } finally {
            setLoading(false);
        }
    };

    const handleSendForgotEmail = async () => {
        if (!email) {
            toast.error("Por favor, ingrese un email válido");
            return;
        }

        const emailExists = await checkEmail(email);
        if (emailExists) {
            await sendEmail(email);
            setResend(true);
            const initialCounter = 180;
            setCounter(initialCounter);
            localStorage.setItem("counter", initialCounter); // Save counter in localStorage
            const expirationTime = Date.now() + initialCounter * 1000; // Save expiration time in milliseconds
            localStorage.setItem("expirationTime", expirationTime); // Save expiration time in localStorage
        }

        setEmail("");
    };

    // Recover the counter from localStorage when the page loads
    useEffect(() => {
        const storedExpirationTime = localStorage.getItem("expirationTime");

        if (storedExpirationTime) {
            const timeLeft = Math.max(0, Math.floor((storedExpirationTime - Date.now()) / 1000));
            setCounter(timeLeft);

            if (timeLeft > 0) {
                setResend(true);
            } else {
                localStorage.removeItem("counter");
                localStorage.removeItem("expirationTime");
            }
        }
    }, []);

    // Handle counter decrement
    useEffect(() => {
        let timer;
        if (counter > 0) {
            timer = setTimeout(() => {
                setCounter(counter - 1);
                localStorage.setItem("counter", counter - 1); // Update counter in localStorage
            }, 1000);
        } else if (counter === 0) {
            localStorage.removeItem("counter");
            localStorage.removeItem("expirationTime");
        }
        return () => clearTimeout(timer);
    }, [counter]);

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
                <CreateAccountData>
                    <ForgotPasswordTitle>
                        <PiWarningCircleLight />
                        <h2>Recuperar contraseña</h2>
                    </ForgotPasswordTitle>
                    <p>Ingrese su mail y le enviaremos un link para la recuperación de su contraseña.</p>
                    <CreateAccountInputs>
                        <InputContainer>
                            <Input
                                placeholder="example@mail.com"
                                icon={<AiOutlineMail className="icon-input" />}
                                required
                                value={email}
                                onChange={handleSetEmail}
                            />
                        </InputContainer>
                    </CreateAccountInputs>
                    <ButtonLogin disabled={!email || counter > 0} onClick={handleSendForgotEmail}>
                        {loading ? (
                            <>
                                <LoaderIcon />
                            </>
                        ) : (
                            <>
                                {counter > 0 ? `Reintentar en ${counter}s` : "Enviar"}
                            </>
                        )}
                    </ButtonLogin>
                    <BackToLogin to="/login">
                        <IoIosArrowBack />
                        Volver al login
                    </BackToLogin>
                </CreateAccountData>
            </CreateAccountWrapper>
            <LoginWrapperInfo>
                <img src="./Logos/logoCopaRelampago.png" alt="Logo Copa Relampago" className='logo-cr' />
                <span>Recupera el Acceso</span>
                <h3>Introduce tu dirección de correo electrónico para comenzar el proceso de recuperación de acceso. Te enviaremos las instrucciones necesarias para restablecer tu cuenta y seguir disfrutando de todo lo que Copa Relámpago tiene para ofrecerte</h3>
            </LoginWrapperInfo>
            <Toaster />
        </CreateAccountContainerStyled>
    );
};

export default ForgotPassword;
