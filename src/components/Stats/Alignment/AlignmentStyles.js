import styled from "styled-components";

export const AlignmentWrapper = styled.div`
    background-color: var(--gray-400);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
    width: 100%;
`
export const AlignmentDivider = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--gray-300);
`
export const AlignmentTeams = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 10px;
`
export const AlignmentTeam = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    /* width: 50%; */

    &.visita {
        justify-content: end;
    }

    img {
        width: 30px;
    }

    h3 {
        font-size: 14px;
        font-weight: 600;
    }
`

export const AlignmentLocal = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
`
export const AlignmentVisit = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 5px;
`
export const AlignmentPlayer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;

    h4 {
        font-size: 12px;
        font-weight: 600;
        color: var(--green);
    }

    p  {
        font-size: 11px;
        font-weight: 300;
    }
`
export const AlignmentPlayerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%
`