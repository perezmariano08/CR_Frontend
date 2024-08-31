import styled from "styled-components";

export const LayoutContainerStyled = styled.main`
    width: 100%;
    height: 100vh;
`

export const PrivateLayoutContainerStyled = styled.main`
    width: 100%;
    
    @media (max-width: 968px) {
        padding-bottom: 90px;
    }
`
export const LayoutAuxContainerStyled = styled.main`
    width: 100%;
    padding-top: 20px;
`

export const LayoutAdminContainerStyled = styled.main`
    display: flex;
    width: 100%;

    height: 100vh;
`

export const Footer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--gray-200);
    padding: 0px 0 35px 0;

    @media (max-width: 968px) {
        font-size: 14px;
    }
`