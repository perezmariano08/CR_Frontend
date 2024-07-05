import styled from "styled-components";

export const InputContainerStyled = styled.div`
    background-color: var(--gray-300);
    border: none;
    padding: 10px 12px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--gray-200);
    font-size: 16px;
    width: 100%;
`
export const InputContainerStyled2 = styled.div`
    background-color: var(--gray-300);
    border: none;
    display: flex;
    align-items: start;
    gap: 5px;
    color: var(--gray-200);
    font-size: 14px;
    width: 100%;
`

export const InputWrapper = styled.input`
    background-color: transparent;
    border: none; 
    color: var(--white);
    outline: none; 
    width: 100%;
    text-align: start;
    vertical-align: bottom;
    &::placeholder {
        color: var(--gray-200); /* Cambia el color del placeholder */
        /* Otros estilos del placeholder, si es necesario */
    }
`;

export const InputWrapper2 = styled.input`
    background-color: transparent;
    border-radius: 5px;
    color: var(--white);
    border: 1px solid var(--gray-200);
    outline: none; 
    width: 100%;
    padding: 8px;
    width: 60%;
`