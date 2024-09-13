import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const ContentContainerStyled = styled(motion.div)`
    margin-left: ${({ isOpen }) => (isOpen ? '16rem' : '0')};
    width: ${({ isOpen }) => (isOpen ? 'calc(100% - 16rem)' : '100%')};
    transition: margin-left 0.3s ease, width 0.3s ease;
    @media (max-width: 968px) {
        width: 100%;
        margin-left: 0;
    }
    height: fit-content;
`;

export const ContentWrapper = styled.div`
    padding: 30px;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 35px;
    @media (max-width: 968px) {
        padding: 20px 15px;
    }
`

export const ContentTitle = styled.h1`
    font-size: 20px;
    font-weight: 600;
`
const underlineAnimation = keyframes`
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
`;

export const ContentNavWrapper = styled.ul`
    display: flex;
    gap: 20px;
    a {
        position: relative;
        color: var(--gray-100);
        text-decoration: none;
        padding: 8px 0;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2.5px;
            background-color: var(--green);
            border-radius: 0 0px 20px 20px;
            transition: all 0.2s ease;
        }

        &.active::after {
            animation: ${underlineAnimation} 0.3s forwards;
        }

        &.active {
            color: var(--white);
        }
    }
`;

export const ContentDividerOpcionesAvanzadas = styled.div`
    width: 100%;
    height: 1px;
    background-color: var(--gray-200);
    margin: 15px 0;
`

export const ContentOpcionesAvanzadas = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 30px;
    width: 100%;
    padding: 10px 0;
    font-size: 16px;

    div {
        cursor: pointer;
        user-select: none;
    }
`

export const MenuContentTop = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--white);
    a {
        color: var(--green);
    }
`

export const ConfigFormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 0;
    gap: 40px;
    width: 100%;
`

export const ConfigForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 20px;
    max-width: 600px;
    h2 {
        margin-bottom: 20px;
        width: 100%;
    }
    @media (max-width: 600px) {
        min-width: 100%;
    }
`

export const FixtureFechasWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const FixtureFechas = styled.div`
    display: flex;
    align-items: center;
    gap: 40px;

    svg {
        color: var(--green);
    }
`

export const TituloPartidoDetalle = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: var(--gray-400);
    padding: 20px 0;
    align-items: center;
    gap: 30px;
    border-radius: 20px;
`

export const TituloPartidoEquipo = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    img {
        width: 50px;
    }
`

export const TituloPartidoResultado = styled.div`
    font-size: 30px;
    font-weight: 800;
    gap: 10px;
    display: flex;
`

export const FormacionesPartido = styled.div`
    display: flex;
    gap: 20px;
`

export const FormacionEquipo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`

export const FormacionEquipoImg = styled.div`
    display: flex;
    gap: 5px;
    img {
        width: 20px;
    }
`



export const ContentUserContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    @media (max-width: 968px) {
        font-size: 14px;
    }
`;

export const ContentUserWrapper= styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1260px;
    padding: 40px 30px;
    width: 100%;
    @media (max-width: 968px) {
        padding: 20px 15px;
    }
`;

export const ContentUserTituloContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    width: 100%;
    overflow: hidden;
`;

export const ContentUserTituloContainer = styled.div`
    display: flex;
    background-color: var(--gray-400);
    padding: 20px 32px;
    width: 100%;
`;


export const TituloContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    img {
        width: 40px;
    }

    svg {
        cursor: pointer;
        color: var(--green);
    }
`;

export const TituloText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    h1 {
        font-size: 20px;
        font-weight: 600;
    }

    p {
        color: #a8a8a8;
        font-size: 12px;
    }
`;

export const ContentUserMenuTitulo = styled.div`
    display: flex;
    width: 100%;
    background-color: var(--gray-400);
    padding: 0 32px;
    @media (max-width: 968px) {
        padding: 0 20px;
    }
`;

export const ContentMenuLink = styled.ul`
    display: flex;
    gap: 30px;
    a {
        position: relative;
        color: #a8a8a8;
        text-decoration: none;
        padding: 16px 0;
        padding-bottom: 18px;
        overflow: hidden;
        transition: all .1s ease-in-out;

        &:hover {
            opacity: 0.8;
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--green);
            border-radius: 0 0px 20px 20px;
            transition: all 0.2s ease;
        }

        &.active::after {
            animation: ${underlineAnimation} 0.3s forwards;
        }

        &.active {
            color: var(--white);
        }
    }
`;

export const ContentPageWrapper = styled.ul`
    width: 100%;
    border-radius: 20px;
    background-color: var(--gray-400);
    overflow: hidden;
`;

export const ContentUserSubMenuTitulo = styled(ContentUserMenuTitulo)`
    border-bottom: 1px solid var(--gray-300);
`;


export const ContentJornadasFixture = styled.div`
    width: 100%;
    padding: 16px 32px;
    @media (max-width: 968px) {
        padding: 12px 20px;
    }
`;

export const JornadasFixtureWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
`;

export const ArrowJornadasFixture = styled.div`
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        background-color: var(--gray-300);
    }

    svg {
        color: var(--green);
    }

    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: antiquewhite;
    }
`;

export const JornadasFixtureDia = styled.div`
    width: 100%;
    padding: 16px 32px;
    background-color: var(--gray-300);
    @media (max-width: 968px) {
        padding: 12px 20px;
    }
    @media (max-width: 568px) {
        font-size: 12px;
    }
`;

export const JornadasEmpty = styled.div`
    width: 100%;
    padding: 16px 32px;
    background-color: var(--gray-400);
    @media (max-width: 968px) {
        padding: 12px 20px;
    }
`;

export const JornadasFixtureZona = styled.div`
    width: 100%;
    padding: 16px 32px;
    font-size: 14px;
    color: #a8a8a8;
    @media (max-width: 968px) {
        padding: 12px 20px;
    }
`;

export const JornadasFixturePartido = styled.div`
    display: flex;
    width: 100%;
    padding: 16px 32px;
    justify-content: center;
    gap: 20px;
    @media (max-width: 968px) {
        padding: 12px 20px;
    }
    cursor: pointer;
    transition: all ease .2s;
    
    &:hover {
        background-color: var(--gray-300);
    }

    &.suspendido {
        background-color: var(--black);
    }
`;


export const JornadasFixturePartidoEquipo = styled.div`
    display: flex;
    gap: 10px;
    min-width: 200px;
    width: 100%;
    justify-content: end;
    align-items: center;
    text-align: end;
    &.visita {
        justify-content: start;
        text-align: start;
    }
    img {
        width: 20px;
    }

    @media (max-width: 968px) {
        min-width: 0;
    }
    @media (max-width: 568px) {
        font-size: 12px;
    }
`;

export const JornadasFixtureResultado = styled.div`
    min-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--white);
    font-weight: 700;
    font-size: 18px;

    &.hora {
        font-weight: 500;
        color: #a8a8a8;
        font-size: 16px;
        @media (max-width: 568px) {
            font-size: 14px;
        }
    }

    @media (max-width: 568px) {
        font-size: 16px;
    }
`;

export const MenuCategoriasContainer = styled.div`
    background-color: var(--gray-400);
    min-width: 250px;
    border-radius: 20px;
    display: flex;
    overflow: hidden;
    flex-direction: column;
`;

export const MenuCategoriasItem = styled(NavLink)`
    background-color: var(--gray-400);
    padding: 12px 20px;
    width: 100%;
    cursor: pointer;
    color: var(--white);
    transition: all ease .2s;

    &:hover {
        background-color: var(--gray-300);
    }
`;

export const MenuCategoriasDivider = styled.div`
    display: flex;
    align-items: center;
    color: var(--green);
    padding: 10px 20px;
    gap: 20px;
    span {
        width: 100%;
    }
    div {
        height: 1px;
        background-color: var(--green);
    }
`;

export const MenuCategoriasTitulo = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 10px;
    font-weight: 700;

    img {
        width: 20px;
    }
`;

export const MenuPosicionesContainer = styled.div`
    width: 100%;
    padding: 16px 32px;
    border-bottom: 1px solid var(--gray-300);
    @media (max-width: 968px) {
        padding: 12px 20px;
    }
`;

export const MenuPosicionesItemFilter = styled.div`
    background-color: var(--white);
    border: 1px solid var(--white);
    color: black;
    border-radius: 20px;
    padding: 6px 12px;
    width: fit-content;
    cursor: pointer;
    font-weight: 600;
`;

export const TablePosicionesContainer = styled.div`
    width: 100%;
    padding: 16px 32px;

    h2 {
        color: var(--green);
        font-size: 14px;
        padding-left: 18px;
    }
`;