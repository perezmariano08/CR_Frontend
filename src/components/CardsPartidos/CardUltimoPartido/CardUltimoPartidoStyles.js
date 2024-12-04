import styled from "styled-components";

export const CardUltimoPartidoWrapper = styled.div`
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

export const CardUltimoPartidoResultado= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    height: fit-content;
    font-size: 24px;
    font-weight: 700;
    background-color: var(--black-800);
`

export const CardUltimoPartidoPenales= styled.div`
    font-size: 8px;
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