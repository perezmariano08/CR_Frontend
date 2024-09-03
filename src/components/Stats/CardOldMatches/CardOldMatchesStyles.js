import styled from "styled-components";

export const CardOldMatchesWrapper = styled.div`
    background-color: var(--gray-400);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    width: 100%;

    @media (max-width: 780px) {
        min-width: 85%;
        width: 100%;
    }

    &.myteam {
        width: 50%;
    }
`

export const CardOldMatchesItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 5px;
    cursor: pointer;
`

export const MatchesItemDescription = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    p {
        font-size: 10px;
        font-weight: 300;
        color: var(--gray-200);
    }
    .fecha {
        color: var(--green);
    }
`

export const MatchesItemTeams = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 30px;
`

export const MatchesItemTeam = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 8px;
    width: 30%;

    text-align: center;
    img {
        width: 30px;
    }
    p {
        font-size: 12px;
    }

    &.local {
        justify-content: end;
    }
`

export const MatchesItemResult = styled.div`
    padding: 7px 5px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 10px;
    background-color: var(--gray-200);
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 20%;
    width: 20%;
`
