import styled from "styled-components"

export const StatsOldMatchesWrapper = styled.div`
    background-color: var(--gray-400);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    /* min-width: 85%; */
    width: 100%;
`
export const StatsOldMatchesContainer = styled.div`
    display: flex;
    align-items: start;
    justify-content: center;
    gap: 30px;
    width: 100%;
`

export const LocalContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    gap: 20px;
`
export const VisitaContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;
    width: 100%;
    gap: 20px;
`

export const OldMatchContainer = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    img {
        width: 30px;
    }
`
export const OldMatchResultContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
    border-radius: 5px;
    padding: 5px;
    min-width: 75px;
`