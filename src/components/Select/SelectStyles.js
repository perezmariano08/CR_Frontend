import styled from "styled-components";

export const SelectContainerStyled = styled.div`
    display: flex;
    align-items: center;
    background-color: var(--gray-300);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    gap: 5px;
    position: relative;
    cursor: pointer;
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

    select:focus ~ .icon-select {
        color: var(--green);
    }

    &.planilla {
        width: 60%;
    }
`
export const SelectWrapper = styled.select`
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

    &:disabled {
        color: var(--gray-200);
        background-color: var(--gray-500);
        cursor: not-allowed;
        transition: all .2s ease-in-out;
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