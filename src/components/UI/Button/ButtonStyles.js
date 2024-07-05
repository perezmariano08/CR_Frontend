import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const ButtonWrapper = styled(motion(NavLink))`
    display: flex;
    padding: 10.5px 17.5px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    background-color: var(--green);
    height: fit-content;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
    color: ${({ color }) => `var(--${color})`};
    border: 1px solid ${({ border }) => `var(--${border})`};
    background: ${({ background }) => `var(--${background})`};
    transition: all .1s ease-in-out;

    &:hover {
        opacity: .9;
        @media (maxwidth: 768px) {
            opacity: 1;
        }
    }
`

export const ButtonSubmit = styled.button`
    display: flex;
    padding: 10.5px 17.5px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    background-color: var(--green);
    height: fit-content;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
    color: ${({ color }) => `var(--${color})`};
    border: 1px solid ${({ border }) => `var(--${border})`};
    background: ${({ background }) => `var(--${background})`};
    transition: all .1s ease-in-out;

    &:hover {
        opacity: .9;
        @media (maxwidth: 768px) {
            opacity: 1;
        }
    }
`