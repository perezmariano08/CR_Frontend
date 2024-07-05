import styled from "styled-components";

export const InputContainerStyled = styled.div`
    border: none;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
    font-size: 16px;
    width: 100%;
    position: relative;
    height: 100%;

    .hi-eye {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 10px;
        padding: 0 5px;
        color: var(--green);
        top: 10px;
        font-size: 18px;

        i {
            transition: all 0.2s;
        }
        .eye-off {
            color: var(--gray-200);
        }
    }

    .icon-input {
        position: absolute;
        left: 10px;
        top: 12px;
        transition: all 0.2s;
    }

    .p-calendar {
        height: 100%;
        width: 100%;
        
        input {
            background-color: var(--gray-300);
            border-radius: 10px;
            border: 1px solid var(--gray-300); 
            color: var(--white);
            outline: none; 
            width: 100%;
            padding: 10px 36px;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
            appearance: none;
            border-radius: 6px;
            outline-color: transparent;

            &:focus {
                outline: 0 none;
                outline-offset: 0;
                box-shadow: 0 0 0 1px var(--green);
                border-color: var(--green);
                
                :focus-within .icon-input {
                    /* Estilos del icono cuando el contenedor principal tiene el foco */
                    color: var(--green);
                }
            }

            
        }
    }

    span {
        font-size: 14px;
        font-weight: 300;
        padding-bottom: 5px;
        color: var(--danger);
    }
`

export const InputWrapper = styled.input`
    background-color: var(--gray-300);
    border-radius: 10px;
    border: 1px solid var(--gray-300); 
    color: var(--white);
    outline: none; 
    width: 100%;
    padding: 10px 36px;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    border-radius: 6px;
    outline-color: transparent;
    font-size: 14px;
    display: flex;
    align-items: center;

    &:focus {
        outline: 0 none;
        outline-offset: 0;
        box-shadow: 0 0 0 1px var(--green);
        border-color: var(--green);

        ~ .icon-input {
            color: var(--green);
        }
    }

    &.error {
        outline: 0 none;
        outline-offset: 0;
        box-shadow: 0 0  0 var(--red);
        border-color: var(--red);

        ~ .icon-input {
            color: var(--red);
        }
    }
`;
export const InputContainerStyled2 = styled.div`
    background-color: var(--gray-300);
    border: none;
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--gray-200);
    font-size: 16px;
    width: 100%;
`



export const InputWrapper2 = styled.input`
    background-color: transparent;
    border-radius: 5px;
    color: var(--white);
    border: 1px solid var(--gray-200);
    outline: none; 
    width: 100%;
    padding: 8px;
    width: 60%;
    
    &.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
    }
`