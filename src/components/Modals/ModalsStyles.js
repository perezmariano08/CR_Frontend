import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const ModalContainerStyled = styled(motion.div)`
    min-width: 550px;
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
export const ModalFormWrapper = styled.div`
    display: flex;
    gap: 15px;
    align-items: start;
    width: 100%;
    select {
        width: 100%;
    }

    @media (max-width: 600px) {
        width: 100%;
        flex-wrap: wrap;
    }
`

export const ModalFormInputContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    font-size: 12px;
    text-transform: uppercase;

    p {
        transition: all .2s ease-in-out;
        color: var(--white);
        font-weight: 500;
        text-transform: initial;
        span {
            font-weight: 700;
            color: var(--green);
        }
    }

    .error {
        color: var(--red);
    }
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

export const ModalExample = styled.a`
    display: flex;
    gap: 5px;
    width: 100%;
    align-items: center;
    color: var(--green);
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
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

export const ModalSettingsUserWrapper = styled.div`
    position: absolute;
    right: 30px;
    flex-direction: column;
    top: calc(100% + 20px);
    display: flex;
    border-radius: 20px;
    background-color: var(--gray-300);
    min-width: 250px;
    font-size: 18px;
    user-select: none;
    overflow: hidden;
    @media (max-width: 600px) {
        width: 100%;
        min-width: 0;
        left: 0;
        border-radius: 0;
        top: 40px;
    }
`

export const ModalSettingsItem = styled(NavLink)`
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid var(--gray-400);
    color: var(--white);
    img {
        width: 20px;
    }

    &:hover {
        text-decoration: underline;

        svg {
            color: var(--danger);
        }
    }

    @media (max-width: 600px) {
        width: 100%;
        min-width: 0;
    }
`
export const SelectPerfil = styled.select`
    background-color: var(--gray-300);
    border-radius: 10px;
    border: 1px solid var(--gray-300); 
    color: var(--white);
    width: 100%;
    padding: 10px;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    /* appearance: none; */
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

    &::placeholder {
        color: var(--gray-200);
    }
`