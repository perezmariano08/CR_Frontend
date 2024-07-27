import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const AsideContainerStyled = styled(motion.aside)`
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    width: 16rem;
    background-color: var(--gray-500);
    font-size: 14px;
    z-index: 2; // para asegurarse de que esté encima del contenido

    @media (max-width: 968px) {
        width: 100%;
    }

    &.page-temporadas .submenu {
        height: auto;
        background-color: transparent;
    }
`;

export const AsideHeader = styled.div`
    display: flex;
    padding: 0 30px;
    height: 50px;
    width: 100%;
    align-items: center;
    img {
        height: 13px    
    }
`

export const AsideUser = styled.div`
    display: flex;
    padding: 0 30px;
    height: 50px;
    width: 100%;
    align-items: center;
    gap: 10px;
    img {
        width: 20px;
        border-radius: 50%;
    }

    &i,svg{
        color: red;
        font-size: 20px;
        cursor: pointer;
    }
`

export const AsideMenuWrapper = styled.ul`
    overflow-y: auto;
    max-height: calc(100vh - 51px);

    &::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

`

export const AsideMenu = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
`

export const MenuItem = styled.li`
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
`

export const NavLinkItem = styled(motion(NavLink))`
    display: flex;
    gap: 10px;
    padding: 10px;
    width: 100%;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
    z-index: 2;
    color: var(--white);
    i, svg {
        color: var(--green);
    }


    &.active {
        background-color: var(--gray-400);
        color: var(--green);
    }

    &.custom-navlink {
        background-color: transparent;
        color: var(--white);
    }

    &:hover {
        background-color: var(--gray-400);
        transition: all .2s;
    }
`

export const NavLinkAngleDown = styled(motion.div)`
    height: auto;
    display: flex;
    align-items: center;
    i, svg {

    }
`

export const SubMenu = styled(motion.ul)`
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--green);
    margin-left: 17px;
    padding-left: 7px;
    z-index: 1;
    transition: max-height .45s cubic-bezier(.86,0,.07,1);
`

export const SubMenuItem = styled(NavLink)`
    display: flex;
    gap: 10px;
    padding: 10px;
    width: 100%;
    align-items: center;
    cursor: pointer;
    color: var(--white);
    &.active {
        color: var(--green);
    }
`