import styled from "styled-components";

export const CardOldMatchesWrapper = styled.div`
    background-color: var(--gray-300);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
`

export const CardOldMatchesItem = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
`

export const MatchesItemDescription = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    p {
        font-size: 10px;
        font-weight: 300;
        color: var(--gray-200);
    }
`

export const MatchesItemTeams = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 10px;
`

export const MatchesItemTeam = styled.div`
    display: flex;
    gap: 5px;
    img {
        width: 25px;
    }
`

export const MatchesItemResult = styled.div`
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 400;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--green);
`