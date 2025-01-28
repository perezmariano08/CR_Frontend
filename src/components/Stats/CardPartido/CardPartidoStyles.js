import styled, { keyframes }  from "styled-components";

export const CardPartidoWrapper = styled.div`
    background-color: var(--gray-400);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
    position: relative;
`

export const CardPartidoTitulo = styled.div`
    display: flex;
    width: 100%;
    padding: 15px;
    font-size: 14px;
    justify-content: center;
    border-bottom: 1px solid var(--black-800);
`

export const CardPartidoDetalles = styled.div`
    display: flex;
    width: 100%;
    font-size: 14px;
    gap: 15px;
    padding: 10px;
    justify-content: center;
    border-bottom: 1px solid var(--black-800);
    color: var(--black-300);
`

export const CardPartidoDetallesItem = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
`

export const CardPartidoTitles = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    text-align: center;

    h3 {
        font-size: 13px;
        font-weight: 600;
        line-height: 12px;
    }

    .ida-vuelta {
        font-weight: 800;
        color: var(--green);
    }

    p {
        font-size: 9px;
        font-weight: 300;
        color: var(--green)
    }
`

const pulseAnimation = keyframes`
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
`;

export const WatchFixtureContainer = styled.span`
    position: absolute;
    left: 20px;
    top: 16px;
    margin: 0;
`

export const WatchContainer = styled.span`
    &i,svg {
        font-size: 16px;
        color: var(--green);
        animation: ${pulseAnimation} 1s ease-in-out infinite;
    }
`

export const CardPartidoTeams = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 40px;
    padding: 30px;
    align-items: center;
    @media (max-width: 768px) {
        padding: 25px 10px;
    }
`
export const CardPartidoTeam = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    img {
        width: 40px;
    }

    h4 {
        font-size: 20px;
        font-weight: 400;

        &.local {
            text-align: end;
        }
    }
    &.local {
        justify-content: end;
    }

    .miEquipo {
        color: var(--green);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        &.local {
            flex-direction: column-reverse;
        }
        h4 {
            text-align: center;
            font-size: 16px;
        }
        img {
            width: 30px;
        }
    }
`
export const CardPartidoInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;

    h5 {
        font-size: 18px;
        font-weight: 800;
    }

    p {
        font-size: 10px;
        font-weight: 300; 
    }

    h4 {
        font-size: 36px;
        line-height: 36px;
        font-weight: 800;
    }

    span {
        font-size: 14px;
        line-height: 14px;
        font-weight: 800;
    }
`

export const CardPartidoDivider = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--gray-200);
`

export const CardPartidoStats = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; 
    
    a {
        font-size: 12px;
        font-weight: 600;
        color: var(--gray-200);
    }
`
export const CardPartidoGoalsContainer= styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: start;
    gap: 40px;
    padding: 15px 15px 40px 15px;

    & svg, i {
        color: var(--gray-200);
        width: 60px;
    }
`
export const CardPartidoGoalsColumn = styled.div`
    display: flex;
    flex-direction: column;
    text-align: end;
    gap: 2px;
    width: 100%;

    h5 {
        font-size: 10;
        font-weight: 300;
        width:100%;
    }

    &.visita {
        text-align: start;
    }
`

