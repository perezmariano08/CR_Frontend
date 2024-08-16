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
    align-items: center;
    width: 100%;
    gap: 10px;
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
    gap: 20px; /* Space between teams and result */
`

export const MatchesItemTeam = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    max-width: 30%; /* Adjusted to ensure proper spacing */
    text-align: center;
    img {
        width: 30px;
    }
    p {
        font-size: 12px;
        width: 100%;
    }
`

export const MatchesItemResult = styled.div`
    padding: 5px 8px;
    font-size: 16px;
    font-weight: 400;
    border-radius: 10px;
    background-color: var(--gray-200);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%; /* Fixed width to ensure result is centered */
    min-width: 60px; /* Ensures a minimum width for visibility */
`
