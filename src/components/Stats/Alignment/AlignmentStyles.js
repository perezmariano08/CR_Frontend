import styled from "styled-components";

export const AlignmentWrapper = styled.div`
    background-color: var(--gray-300);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
`
export const AlignmentDivider = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--gray-200);
`
export const AlignmentTeams = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`
export const AlignmentTeam = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;

    img {
        width: 50px;
    }

    h3 {
        font-size: 12px;
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
        font-size: 10px;
        font-weight: 600;
    }

    p  {
        font-size: 10px;
        font-weight: 300;
    }
`
export const AlignmentPlayerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%
`