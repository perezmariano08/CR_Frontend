import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const NavbarContainerStyled = styled.header`
    width: 100%;
    height: 70px;
    background-color: var(--gray-400);
    display: flex;
    justify-content: center;
    position: sticky;
    top: 0;
    border-bottom: 1px solid black;
    z-index: 1000;
    user-select: none;
    @media (max-width: 968px) {
        height: 50px;
    }
`

export const NavbarWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    width: 100%;
    max-width: 1260px;
    height: 100%;
    position: relative;
    

    @media (max-width: 968px) {
        padding: 0 15px;
    }
`

export const NavbarLogo = styled(NavLink)`
    height: 30%;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
        height: 100%;
    }
`
export const ContainerNoti = styled.button`
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    & i,svg {
        font-size: 15px;
        color: white;
        cursor: pointer;
    }
`

export const NavbarList = styled.ul`
    display: flex;
    align-items: center;
    gap: 30px;

    li a {
        color: var(--white);
        font-size: 18px;
        font-weight: 600;
    }

    @media (max-width: 968px) {
        
        li {
            display: none;
        }
    }

    svg {
        cursor: pointer;
    }

    .active {
        color: var(--green);
    }

    img {
        width: 30px;
    }
`

export const SelectTeamContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* padding: 20px; */
`