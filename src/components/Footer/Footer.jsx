import React, { useState } from 'react'
import { BottomFooter, ButtonFooterContainer, FooterBottomContainer, FooterContacto, FooterContainerStyled, FooterForm, FooterLinksContainer, FooterMiddle, FooterRightItems, FooterSocial, FooterTop, FooterWrapper } from './FooterStyles'
import { Button, ButtonsContaier } from '../../pages/Administrador/Noticias/NoticiasStyles'
import CrLogo from '../../assets/Logos/CR-Logo.png'
import { FaInstagram, FaFacebookF, FaWhatsapp, FaRegUser, FaYoutube } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { CiTextAlignLeft } from "react-icons/ci";
import Input from '../UI/Input/Input';
import { toast, Toaster } from 'react-hot-toast';
import { URL } from '../../utils/utils';
import { enviarMensajeContacto } from '../../utils/dataFetchers';
import { Link } from 'react-router-dom';  // Importar Link

const Footer = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleNombreChange = (event) => {
        const newNombre = event.target.value;
        setNombre(newNombre);
    }

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
    }

    const handleMensajeChange = (event) => {
        const newMensaje = event.target.value;
        setMensaje(newMensaje);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Mostrar el toast de loading
        const loadingToast = toast.loading('Enviando mensaje...');

        try {
            const response = await enviarMensajeContacto(nombre, email, mensaje);

            // Mostrar el mensaje de éxito
            if (response?.message) {
                toast.success(response.message);
            }

        } catch (error) {
            console.error('Error al enviar el mensaje:', error);

            // Mostrar el mensaje de error si no se pudo enviar
            toast.error(error.response?.data?.error || 'Error al enviar el mensaje');
        } finally {
            // Descartar el toast de loading y limpiar los inputs
            toast.dismiss(loadingToast);
            setNombre('');
            setEmail('');
            setMensaje('');
        }
    };

    const openWhatsapp = () => {
        window.open('https://api.whatsapp.com/send?phone=+5493518182129&text=Hola%20Copa%20Rel%C3%A1mpago%20-%20https%3A%2F%2Fcoparelampago.com%2F', '_blank');
    }

    return (
        <FooterContainerStyled id='footer'>
            <FooterWrapper>
                <FooterTop>
                    <img src={CrLogo} alt="Logo CR" />
                    <h3>Queres ser parte del mejor torneo de futbol 7 de Cordoba?</h3>
                    <FooterBottomContainer>
                        <Button className='more' onClick={openWhatsapp}>Quiero ser parte</Button>
                        <Button onClick={openWhatsapp}>Saber mas</Button>
                    </FooterBottomContainer>
                </FooterTop>
                <FooterMiddle>
                    {/* <img src={CrLogo} alt="Logo CR" /> */}
                    {/* <h3>Queres ser parte del mejor torneo de futbol 7 de Cordoba?</h3> */}
                    <FooterRightItems>
                        <FooterLinksContainer>
                            <FooterContacto>
                                <h2>Navega</h2>
                                <FooterSocial>
                                    <Link to="/">Inicio</Link>  {/* Ruta a la página principal */}
                                </FooterSocial>
                                <FooterSocial>
                                    <Link to="/categorias">Categorias</Link>  {/* Ruta a la página de categorías */}
                                </FooterSocial>
                                <FooterSocial>
                                    <Link to="/noticias">Noticias</Link>  {/* Ruta a la página de noticias */}
                                </FooterSocial>
                            </FooterContacto>
                            <FooterContacto>
                                <h2>Nuestras redes</h2>
                                <FooterSocial onClick={() => window.open('https://www.instagram.com/coparelampago/', '_blank')}>
                                    coparelampago
                                    <FaInstagram />
                                </FooterSocial>
                                <FooterSocial onClick={() => window.open('https://www.facebook.com/coparelampagocba/', '_blank')}>
                                    coparelampago
                                    <FaFacebookF />
                                </FooterSocial>
                                <FooterSocial onClick={openWhatsapp} >
                                +54 9 3518 18-2129
                                    <FaWhatsapp />
                                </FooterSocial>
                                <FooterSocial onClick={() => window.open('https://www.youtube.com/channel/UC-2-3-5-6-7', '_blank')}>
                                    coparelampago
                                    <FaYoutube />
                                </FooterSocial>
                            </FooterContacto>
                        </FooterLinksContainer>

                        <FooterContacto className='contacto'>
                            <h2>Contacto</h2>
                            <FooterForm onSubmit={handleSubmit}>
                                <Input
                                    icon={<FaRegUser className='icon-input error' />}
                                    placeholder='Escriba su nombre'
                                    name={'nombre'}
                                    id={'nombre'}
                                    inputMode={'text'}
                                    onChange={handleNombreChange}
                                    value={nombre}
                                />
                                <Input
                                    icon={<MdEmail className='icon-input error' />}
                                    placeholder='Indique su email'
                                    name={'email'}
                                    id={'email'}
                                    // inputMode={'text'}
                                    type='email'
                                    onChange={handleEmailChange}
                                    value={email}
                                />
                                <Input
                                    placeholder='Escriba su mensaje'
                                    name={'mensaje'}
                                    id={'mensaje'}
                                    type={'textarea'}
                                    inputMode={'text'}
                                    onChange={handleMensajeChange}
                                    value={mensaje}
                                />
                                <ButtonFooterContainer>
                                    <Button className='footer'>Enviar</Button>
                                </ButtonFooterContainer>
                            </FooterForm>

                        </FooterContacto>
                    </FooterRightItems>
                </FooterMiddle>
                {/* <BottomFooter>
                    Copa Relampago 2025 - Todos los derechos reservados - Version Beta
                </BottomFooter> */}
            </FooterWrapper>
            <Toaster />
        </FooterContainerStyled>
    )
}

export default Footer