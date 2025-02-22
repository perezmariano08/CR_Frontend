import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const MenuBottomContainerStyled = styled.footer`
    width: 100%;
    padding: 0 10px 20px 10px;
    height: 90px;
    position: fixed;
    bottom: 30px;
    z-index: 100;
    display: flex;
    justify-content: center;
    display: none;
    @media (max-width: 968px) {
        display: flex;
    }
`;

export const MenuBottomWrapper = styled.div`
    background-color: var(--gray-500);
    border-radius: 30px;
    display: inline-flex;
    justify-content: space-between;
    gap: 35px;
    align-items: center;
    padding: 20px 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra suave */

    h4 {
        font-size: 10px;
        font-weight: 400;
    }
`;

export const MenuBottomItem = styled(NavLink)`
    display: flex;
    flex-direction: column;
    color: var(--white);
    align-items: center;
    i, svg {
        font-size: 20px;
    }

    &.active {
        color: var(--green);
    }
`;
