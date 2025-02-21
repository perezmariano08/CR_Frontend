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
    min-height: 410px;
    height: 100%;

    &.home { 
        min-height: auto;

        @media (max-width: 1200px) { 
            height: 450px;
        }
    }
`;

export const Fila = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    height: 100%;
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

    .logo-jugador-admin {
        height: 45px;
        border-radius: 50%;
    }

    .logo-equipo {
        height: 24px;
        position: absolute;
        right: -7px;
        bottom: -7px;
    }

    .agregar-jugador {
        height: 28px;
        width: 28px;
        position: absolute;
        font-size: 16px;
        font-weight: 700;
        right: -9px;
        bottom: -9px;
        background-color: var(--import);
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        transition: all .1s ease-in-out;

        &:hover {
            opacity: .8;
        }
        
        &.eliminar { 
            background-color: var(--red);
            color: white;
        }
    }
`;

export const NombreJugador = styled.div`
    margin-top: 5px;
    font-size: 12px;
    
    &.dt-admin { 
        font-size: 14px;
        margin-top: 10px;
    }
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
