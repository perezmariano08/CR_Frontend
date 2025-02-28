import React, { useState, useEffect } from 'react';
import { NavbarContainerStyled, NavbarList, NavbarLogo, NavbarWrapper } from './NavbarStyles';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // Agregado useLocation
import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice';

export const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isFooterInView, setIsFooterInView] = useState(false);
    const location = useLocation(); // Obtener la ubicación actual

    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchTemporadas());
    }, [dispatch]);

    // Detectar si el Footer está en vista usando IntersectionObserver
    useEffect(() => {
        const footerElement = document.getElementById('footer');
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            setIsFooterInView(entry.isIntersecting);
        }, { threshold: 0.5 });

        if (footerElement) {
            observer.observe(footerElement);
        }

        return () => observer.disconnect(); // Cleanup on unmount
    }, []);

    const openLogin = () => {
        navigate('/login')
    };

    const handleInicioClick = (e) => {
        e.preventDefault()
        if (location.pathname === '/') {
            // Si estamos en la página de inicio, desplazamos al top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/')
        }
    };

    const handleFooterClick = (e) => {
        e.preventDefault(); // Evitar que se navegue a la sección
        document.getElementById('footer').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <NavbarContainerStyled>
            <NavbarWrapper>
                <NavbarLogo onClick={handleInicioClick}>
                    <img src="/Logos/logoCopaRelampago.png" alt="Logo Copa Relampago" />
                </NavbarLogo>
                <NavbarList>
                    <li>
                        <NavLink
                            to={'/'}
                            end  // Solo se activa en la ruta exacta
                            onClick={handleInicioClick} // Añadimos el onClick aquí
                            style={({ isActive }) => ({
                                color: isActive ? 'var(--green)' : 'inherit', // Verde cuando está activo
                                transition: 'color 0.3s ease-in-out'
                            })}
                        >
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/categorias'}
                            style={({ isActive }) => ({
                                color: isActive ? 'var(--green)' : 'inherit',
                                transition: 'color 0.3s ease-in-out'
                            })}
                        >
                            Categorias
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/noticias'}
                            style={({ isActive }) => ({
                                color: isActive ? 'var(--green)' : 'inherit',
                                transition: 'color 0.3s ease-in-out'
                            })}
                        >
                            Noticias
                        </NavLink>
                    </li>
                    <li>
                        <a
                            href="#footer"
                            onClick={handleFooterClick} // Llamamos la función para hacer scroll
                            style={{
                                color: isFooterInView ? 'var(--green)' : 'inherit',
                                transition: 'color 0.3s ease-in-out'
                            }}
                        >
                            Contacto
                        </a>
                    </li>
                    <FaUserCircle onClick={openLogin} />
                </NavbarList>
            </NavbarWrapper>
        </NavbarContainerStyled>
    );
};
