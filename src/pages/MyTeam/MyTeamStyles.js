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
    width: 100%;
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
