import styled from "styled-components";

export const PlanillaContainerStyled = styled.div`
    padding-top: 100px;
`
export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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
        cursor: not-allowed
    }
`

export const InputDescContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    gap: 10px;
    background-color: var(--gray-300);
    padding: 20px;
    border-radius: 15px;

    button {
        width: 20%;
    }

    input {
        height: 150px;
        background-color: var(--gray-400);
        border-radius: 15px;
    }
`