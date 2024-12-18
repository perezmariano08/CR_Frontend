import styled from "styled-components";

export const IndicentsWrapper = styled.div`
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
export const IndicentsContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`
export const IncidentLocal = styled.div`
    display: flex;
    gap: 10px;
    padding: 10px 0;
    /* border-top: 1px solid var(--gray-200); */
    align-items: center;

    h3 {
        font-size: 14px;
        font-weight: 600;
    }

    &i,svg {
        color: var(--green);
        font-size: 17px;
    }

    h4 {
        font-size: 15px;
        font-weight: 400;
    }

    p {
        font-size: 10px;
        font-weight: 300;
        color: var(--gray-200);
        
    }

    &.visit {
        justify-content: end;
    }

    .red {
        color: var(--red);
    }

    .yellow {
        color: yellow;
    }
`

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    i,svg {
        font-size: 16px;
    }

    .delete {
        color: var(--red);
        font-size: 16px;
    }
`