import styled from 'styled-components';

export const DreamTeamCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--black-800);
    width: 100%;
    color: white;
    position: relative;
    padding: 20px 0;
    gap: 20px;
`;

export const Fila = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    gap: 20px;
    z-index: 2;
`;

export const Jugador = styled.div`
    display: flex;
    gap: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 12px;
`;

export const LogoJugador = styled.div`
    display: flex;
    position: relative;

    .logo-jugador {
        height: 33px;
        border-radius: 50%;
    }

    .logo-equipo {
        height: 24px;
        position: absolute;
        right: -7px;
        bottom: -7px;
    }
`;

export const NombreJugador = styled.div`
    margin-top: 5px;
    font-size: 12px;
`;

// Estilos para el SVG en el fondo
export const SvgBackground = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 15%;
    overflow: hidden;
    rotate: 180deg;
    z-index: 1;

    svg {
        fill: var(--black-700);
        opacity: .4;
    }
`;

// export const CalificacionJugador = styled.div`
//   margin-top: 5px;
//   background-color: #4CAF50;
//   color: white;
//   padding: 3px 8px;
//   border-radius: 12px;
//   font-size: 14px;
// `;
