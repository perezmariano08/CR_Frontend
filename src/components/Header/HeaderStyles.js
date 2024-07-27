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
    z-index: 2;
`

export const HeaderWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
`

export const HeaderMenuBars = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    padding: 5px;
    transition: all .3s ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: var(--green);
        i, svg {
            color: var(--black);
        }
    }
    i, svg {
        font-size: 20px;
    }
`

export const HeaderUser = styled.div`
    display: flex;
    height: 50px;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    img {
        width: 20px;
        border-radius: 50%;
    }

    &i,svg{
        color: red;
        cursor: pointer;
    }
`