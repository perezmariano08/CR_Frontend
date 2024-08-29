import { motion } from "framer-motion";
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



