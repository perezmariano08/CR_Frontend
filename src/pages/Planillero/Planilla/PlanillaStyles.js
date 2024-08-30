import styled from "styled-components";

export const PlanillaContainerStyled = styled.div`
    padding-top: 100px;
    display: flex;
    justify-content: center;
    gap: 40px;
    width: 100%;
`
export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`
export const ButtonMatch = styled.button`
    display: flex;
    padding: 10px 12px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    background-color: var(--green);
    color: var(--white);
    height: fit-content;
    border: 1px solid var(--green);
    border-radius: 10px;
    cursor: pointer;

    &&.started {
        background: transparent;
    }

    &&.finish {
        background: var(--red);
        border: 1px solid var(--red);
        pointer-events: none;
    }
`

export const InputDescContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    gap: 10px;
    background-color: var(--gray-400);
    padding: 20px;
    border-radius: 15px;
`