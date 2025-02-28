import styled from "styled-components";

export const MyTeamTitleContainer = styled.div`
    width: 100%;
    background-color: var(--gray-300);
    border-radius: 0 0 20px 20px;
    padding: 50px;
    background-image: url(/imagen_log.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .7;
        z-index: 0;
    }
`

export const MyTeamInfo = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 5px;
    img {
        width: 50px;
        z-index: 2;

    }

    h2 {
        font-size: 18px;
        font-weight: 800;
        z-index: 2;

    } 

    h3 {
        font-size: 10px;
        font-weight: 400;
        color: var(--green);
        z-index: 2;
    } 
`
export const MyTeamName = styled.div`
    display: flex;
    flex-direction: column;
`
export const MyTeamContainerStyled = styled.div`
    
`
export const MyTeamWrapper = styled.div`
    flex-direction: column;
    gap: 40px;
`
export const MyTeamMatches = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    background-color: var(--gray-400);
    border-radius: 20px;
    padding: 30px;
`
export const MyTeamMatchesItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    background-color: var(--gray-300);
    border-radius: 20px;
    align-items: center;

    h4 {
        font-family: 'League Gothic';
        font-size: 24px;
        min-width: 34px;
        text-align: center;
    }

    h5 {
        font-weight: 600;
        font-size: 14px;
    }

    &.pg h4 {
        color: var(--green);
    }

    &.pp h4 {
        color: var(--red);
    }

    &.pe h4 {
        color: var(--yellow);
    }
`

export const MyTeamMatchesDivisor = styled.div`
    background-color: var(--gray-200);
    height: 1px;
    width: 100%;
`
export const MyTeamSectionTop = styled.div`
    display: flex;
    align-items: start;
    justify-content: center;
    width: 100%;
    gap: 10px;

    @media (max-width: 968px) {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 15px;
    }
`
export const MyTeamSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: start;

    h2 { 
        font-size: 16px;
        line-height: 16px;
        font-weight: 600;
    }

`;

export const EstadisticasContainer = styled.div`
    
`;

export const EstadisticasTemporada = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 40px 0;
    border-bottom: 1px solid var(--black-800);
    h3 {
        font-size: 22px;
        font-weight: 600;
        color: var(--green);
    }
`;

export const EstadisticasTemporadaGeneral = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;

    div {
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 1px solid var(--black-800);
        background-color: var(--black-900);
        border-radius: 10px;
        h5 {
            font-size: 40px;
            font-weight: 800;
        }
    }
`;


export const EstadisticasTemporadaDetallesWrapper = styled.div`
    display: flex;
    gap: 100px;
`;

export const EstadisticasTemporadaDetalles = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    h4 {
        font-size: 20px;
        font-weight: 600;
    }
`;

export const EstadisticasTemporadaDetallesItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
        font-weight: 800;
    }
`;

export const EquipoPartidosWrapper = styled.div`
    display: flex;
    gap: 20px;

`;

export const TrofeosContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 24px;
    background-color: var(--black-900);
`;

export const TrofeosItem = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    svg {
        width: 18px;
    }

    div {
        display: flex;
        flex-direction: column;
        h4 {
            font-size: 18px;
            font-weight: 700;
        }

        p {
            font-size: 14px;
            text-transform: uppercase;
            color: var(--green);
        }
    }

    
`;