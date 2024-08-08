import { motion } from "framer-motion";
import styled from "styled-components";

export const ModalContainerStyled = styled(motion.div)`
    width: 450px;
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
    flex-direction: column;
    gap: 20px;
    z-index: 99;
`

export const ModalFormInputContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    font-size: 12px;
    text-transform: uppercase;
`

export const ModalFormInputImg = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`

export const ModalButtons = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: end;
`

export const ModalMessage = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    align-items: center;

    i, svg {
        font-size: 40px;
    }
`