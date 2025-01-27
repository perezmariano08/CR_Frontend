import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const NotFoundContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--gray-400);
    `
export const NotFoundTitle = styled.h1`
    font-size: 100px;
    font-weight: 900;
    color: var(--green);
    margin-bottom: 20px;
`
export const NotFoundSubtitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-200);
    /* margin-bottom: 10px; */
`
export const NotFoundButton = styled(NavLink)`
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: var(--green);
    color: var(--white);
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
        opacity: 0.7;
    }
`