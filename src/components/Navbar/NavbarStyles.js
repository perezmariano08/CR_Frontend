import styled from "styled-components";

export const NavbarContainerStyled = styled.header`
    width: 100%;
    height: 40px;
    background-color: var(--gray-400);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
`

export const NavbarWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    width: 100%;
    max-width: 1200px;
    height: 100%;

    img {
        height: 30%;
    }
`
export const ContainerNoti = styled.button`
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    &i,svg {
        font-size: 15px;
        color: white;
        cursor: pointer;
    }
`