import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const CardProximoPartidoWrapper = styled(NavLink)`
    color: var(--black-50);
    padding: 16px 24px;
    gap: 15px;
    display: flex;
    flex-direction: column;
    text-transform: uppercase;
    background-color: var(--black-900);

    &.empty {
        text-transform: none;
    }
`

export const ProximoPartidoInfo = styled.div`
    padding: 10px 0;
    gap: 15px;
    display: flex;
    width: 100%;

    img {
        height: 58px;
    }
`

export const ProximoPartidoDetalle = styled.div`
    justify-content: space-between;
    display: flex;
    width: 100%;
`

export const ProximoPartidoDescripcion = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const ProximoPartidoEquipos = styled.div`
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

export const ProximoPartidoDiaJornada = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;

    p {
        font-size: 12px;
        color: var(--black-200);
        &.jornada {
            color: var(--black-500);
        }
    }
`

export const ProximoPartidoCancha = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;

    svg {
        color: var(--green);
        font-size: 30px;
    }
`

export const ProximoPartidoDivisor = styled.div`
    width: 100%;
    background-color: var(--black-800);
    height: 1px;
`

export const ProximoPartidoCuentaRegresivaWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    gap: 30px;
`


export const ProximoPartidoCuentaRegresivaItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    &.disabled {
        color: var(--black-500);
    }

    p {
        font-size: 30px;
        font-weight: 600;
    }

    span {
        font-size: 10px;
    }
`

export const ProximoPartidoCuentaRegresivaDivisor= styled.div`
    font-size: 20px;
    font-weight: 600;
`