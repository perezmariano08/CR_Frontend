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
        color: var(--gray-200);
    }

    .icon-select {
        position: absolute;
        left: 12px;
        color: var(--gray-200);
    }
`
export const SelectWrapper = styled.select`
    min-width: 200px;
    width: 100%;
    background-color: transparent;
    color: var(--gray-200);
    height: 100%;
    padding: 10px 10px 10px 34px;
    border: none;
    outline: none;
    appearance: none; /* Oculta el estilo por defecto del select */
    -webkit-appearance: none; /* Para navegadores WebKit */
    -moz-appearance: none; /* Para navegadores Mozilla */
    z-index: 2;
    cursor: pointer;

    option {
        background-color: var(--gray-300);
        color: var(--white);
        cursor: pointer;
        border: none;
        &:disabled {
            display: none;
        }
    }
`