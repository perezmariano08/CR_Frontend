import styled from "styled-components";

export const LoginContainerStyled = styled.div`
    height: 100vh;
    position: relative;
    width: 100%;

`
export const LoginWrapperUp = styled.div`
    display: flex;
    height: 40%;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-image: url(/back_login.jpg);
    background-position: center;
    background-size: cover;
    position: absolute;
    top: 0;
    img {
        width: 60px;
        z-index: 1;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .8;
        z-index: 0;
    }
`
export const LoginWrapperDown = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 64%;
    background-color: var(--gray-400);
    width: 100%;
    padding: 30px;
    border-radius: 30px 30px 0 0;
`
export const LoginDataContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 50px;

    p {
        text-align: center;
        font-weight: 300;

        a {
            color: var(--green);
            font-weight: 500;
        }
    }
`

export const LoginDataWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;

    h1 {
        font-size: 18px;
        font-weight: 500;
    }
`
export const LoginDataInputs = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`
export const LoginDataPassword = styled.div`
    display: flex;
    justify-content: end;

    a {
        font-weight: 300;
        color: var(--white)
    }
`
export const ButtonLogin = styled.button`
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
    color: var(--white);
    border: 1px solid var(--green);
    background: var(--green);
    transition: all .1s ease-in-out;

    &:hover {
        opacity: .7;
        @media (maxwidth: 768px) {
            opacity: 1;
        }
    }

    &:disabled {
        opacity: .3;
        cursor: not-allowed;
        pointer-events: none;
    }
`

