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

    &&.suspender {
        background: var(--red);
        border: 1px solid var(--red);
        cursor: pointer;
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
export const SelectMvp = styled.select`
    border-radius: 10px;
    width: 100%;
    background-color: transparent;
    color: var(--gray-100);
    height: 100%;
    padding: 10px 10px 10px 36px;
    border: none;
    outline: none;
    appearance: none; /* Oculta el estilo por defecto del select */
    -webkit-appearance: none; /* Para navegadores WebKit */
    -moz-appearance: none; /* Para navegadores Mozilla */
    z-index: 2;
    cursor: pointer;
    &:focus {
        outline: 0 none;
        outline-offset: 0;
        box-shadow: 0 0 0 1px var(--green);
        border-color: var(--green);
    }

    &:focus + .icon-select {
        color: var(--green); /* Cambia el color del ícono al estar en foco */
    }

    option {
        background-color: var(--gray-500);
        color: var(--white);
        cursor: pointer;
        border: none;
        &:disabled {
            display: none;
        }
        &:hover {
            background-color: red
        }
    }
`

export const SelectContainerStyled = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--gray-400);
    border: none;
    border-radius: 10px;
    gap: 15px;
    width: 100%;
    padding: 20px;

    .arrow {
        position: absolute;
        right: 12px;
        color: var(--gray-100);
    }

    .icon-select {
        position: absolute;
        left: 12px;
        color: var(--gray-100);
    }

    /* Estilo cuando el select está en foco */
    select:focus ~ .icon-select {
        color: var(--green); /* Cambia el color del ícono al estar en foco */
    }

    span {
        color: var(--yellow);
    }
`