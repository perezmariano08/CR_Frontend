import { motion } from "framer-motion";
import styled from "styled-components";

export const ModalContainerStyled = styled(motion.div)`
    min-width: 1000px;
    background-color: var(--gray-500);
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    z-index: 3;
    max-height: 80vh;
    overflow-y: auto;
    @media (max-width: 968px) {
        width: 90%;
        min-width: 600px;
    }
`

export const ModalHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    font-size: 18px;
    align-items: center;
    i, svg {
        cursor: pointer;
    }
    p {
        font-weight: 700;
    }
`

export const ModalForm = styled.form`
    display: flex;
    width: 100%;
    /* flex-direction: column; */
    gap: 20px;
    z-index: 99;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`

export const ModalButtons = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: end;
    padding-top: 20px;
`

export const ModalFormLeft = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`

export const ModalFormRight = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`
export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Estilos para el checkbox
export const StyledCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:checked {
    background-color: var(--green);
    border-color: var(--green);
    position: relative;
  }

  &:checked::after {
    content: "✔";
    color: white;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

// Estilos para el texto del label
export const CheckboxLabel = styled.span`
  font-size: 14px;
  color: var(--gray-100);
`;