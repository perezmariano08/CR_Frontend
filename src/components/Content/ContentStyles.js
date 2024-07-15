import styled from "styled-components";

export const ContentContainerStyled = styled.div`
    margin-left: 16rem;
    width: calc(100% - 16rem);
    @media (max-width: 968px) {
        width: 100%;
        margin-left: 0px;
    }
    height: fit-content;
`

export const ContentWrapper = styled.div`
    padding: 30px;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 35px;
    @media (max-width: 968px) {
        padding: 20px 15px;
    }
`

export const ContentTitle = styled.h1`
    font-size: 20px;
    font-weight: 600;
`