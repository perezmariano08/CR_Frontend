import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const PartidosGenericosContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    :last-child {
        border: none
    }
`

export const CardPartidoGenericoWrapper = styled(NavLink)`
    color: var(--white);
    display: flex;
    align-items: stretch; /* Asegura que los hijos ocupen toda la altura */
    width: 100%;
    background-color: var(--black-900);
    padding: 16px 24px;
    gap: 20px;
    border-bottom: 1px solid var(--black-800);
    transition: all .1s ease-in-out;
    &:hover {
        cursor: pointer;
        background-color: var(--black-950);
    }

    @media (max-width: 500px){
        padding: 12px 16px;
        gap: 15px;
    }
`

export const CardPartidoGenericoResultado = styled.div`
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    text-transform: uppercase;
    min-width: 50px;

    @media (max-width: 500px){
        font-size: 14px;
        min-width: 40px;
    }

    &.programado {
        gap: 2px;
        color: var(--black-400);
        span {
            color: var(--black-500);
            font-size: 12px;
        }
    }

    &.finalizado {
        color: var(--black-50);
        gap: 2px;
        span {
            color: var(--black-500);
            font-size: 12px;
        }
    }

    &.en-juego {
        color: var(--green);
        font-size: 10px;
        gap: 5px;
        justify-content: center;
        align-items: center;
        
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


    &.programado {
        color: var(--black-400);
    }

    &.suspendido {
        color: var(--red);
    }

    &.postergado {
        color: var(--yellow);
    }
`

export const CardPartidoGenericoDivisor = styled.div`
    width: 1px;
    height: inherit;
    background-color: var(--black-800);
`

export const CardPartidoGenericoEquipos = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2px;
`

export const CardPartidoGenericoEquipo = styled.div`
    display: flex;
    align-items: center;
    min-height: 24px;
`

export const CardPartidoGenericoEquipoDetalle = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;

    img {
        height: 14px;
    }

    
`

export const CardPartidoGenericoEquipoLink = styled.a`
    color: var(--black-100);
    &:hover{
        text-decoration: underline
    }
    
    p {
        margin-right: 20px;
        &.my-team {
            font-weight: 600;
            color: var(--black-50);
        }
        @media (max-width: 500px){
            font-size: 14px;
            min-width: 40px;
        }
    }
`

export const CardPartidoGenericoEstadisticas = styled.div`
    display: flex;
    align-items: center;
`

export const CardPartidoGenericoRojas = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: inherit;

    div {
        background-color: var(--red);
        height: 3px;
        width: 6px;
    }
`

export const CardPartidoGenericoGoles = styled.div`
    display: flex;
    justify-content: center;
    min-width: 45px;
    gap: 2px;
    align-items: center;
    background-color: var(--black-800);
`

export const CardPartidoGenericoPenales = styled.div`
    font-size: 8px;
`
