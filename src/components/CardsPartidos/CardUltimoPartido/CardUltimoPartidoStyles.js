import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const CardUltimoPartidoWrapper = styled(NavLink)`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 16px 24px;
    text-transform: uppercase;
    width: 100%;
    background-color: var(--black-900);
`

export const CardUltimoPartidoInfo = styled.div`
    display: flex;
    gap: 15px;
    padding: 10px 0;
    width: 100%;

    img {
        height: 58px;
    }
`

export const CardUltimoPartidoDetalle = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`

export const CardUltimoPartidoDescripcion = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
`

export const CardUltimoPartidoDiaJornada = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    p {
        font-size: 12px;
        font-weight: 600;
        color: var(--black-200);
        &.jornada {
            color: var(--black-500);
        }
    }

    .vivo {
        font-size: 10px;
        color: var(--green);
    }
`

export const CardUltimoPartidoEquipos= styled.div`
    display: flex;
    flex-direction: column;
    p {
        font-size: 22px;
        font-weight: 600;

        &.my-team {
            color: var(--green);
        }
    }
    
`

export const CardUltimoPartidoEquipoLink = styled(NavLink)`
    color: var(--black-100);
    &:hover {
        text-decoration: underline
    }
`

export const CardUltimoPartidoResultado= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--black-50);
    padding: 10px 16px;
    height: fit-content;
    font-size: 24px;
    font-weight: 700;
    background-color: var(--black-800);
    position: relative;
`

export const CardUltimoPartidoResultadoVivo = styled.div`
    color: var(--green);
    font-size: 10px;
    gap: 5px;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -30px;
    display: flex;
    flex-direction: column;

    .vivo {
        width: 40%;
        height: 1px;
        position: relative;
        overflow: hidden;
        
        &:after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background-color: var(--green);
            animation: vivo-animation 1s infinite ease-in-out;
        }
    }

    @keyframes vivo-animation {
        0% {
            width: 0;
            left: 0;
        }
        50% {
            width: 100%;
            left: 0;
        }
        100% {
            width: 0;
            left: 100%;
        }
    }
`



export const CardUltimoPartidoPenales= styled.div`
    font-size: 10px;
`

export const CardUltimoPartidoLink= styled.div`
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    a {
        color: var(--black-500);
        font-weight: 700;
        font-size: 12px;
        transition: all 2s ease-in-out;

        &:hover {
            text-decoration: underline;
        }
    }
`