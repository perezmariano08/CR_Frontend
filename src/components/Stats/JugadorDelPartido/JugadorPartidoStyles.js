import styled from "styled-components";

export const JugadorPartidoContainer = styled.div`
    background-color: var(--black-900);
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
`

export const JugadorPartidoTitulo = styled.div`
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: center;
    padding: 20px;
    width: 100%;
    border-bottom: 1px solid var(--black-800);
    svg {
        color: var(--yellow);
    }
`

export const JugadorPartidoDetalle = styled.div`
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    width: 100%;
    border-bottom: 1px solid var(--black-800);

    img {
        width: 40px;
    }
`

export const Jugador = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
    padding: 30px ;
    span {
        font-size: 40px;
        font-weight: 700;
    }
`;

export const JugadorDatos = styled.div`
    display: flex;
    flex-direction: column;

    h4 {
        font-size: 26px;
    }

    p {
        font-size: 14px;
        color: var(--black-300);
    }
`;


export const LogoJugador = styled.div`
    display: flex;
    position: relative;

    .logo-jugador {
        height: 70px;
        border-radius: 50%;
    }

    .logo-equipo {
        height: 40px;
        position: absolute;
        right: -7px;
        bottom: -7px;
    }
`;