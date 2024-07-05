import styled from "styled-components";

export const HeaderContainerStyled = styled.header`
    width: 100%;
    height: 50px;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 0 25px;
    background-color: var(--gray-500);
`

export const HeaderWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: start;

    i, svg {
        font-size: 18px;
        cursor: pointer;
    }
`