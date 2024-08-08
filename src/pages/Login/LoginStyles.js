import styled from "styled-components";

export const LoginContainerStyled = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    @media (max-width: 700px) {
        position: relative;
    }
`

export const LoginWrapperInfo = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    gap: 10px;
    width: 100%;
    min-width: 50%;
    padding: 50px 100px;
    height: 100%;
    background-image: url(./imagen_log.png);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    &::before {
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8); /* Capa semi-transparente negra */
        z-index: 1; /* Asegúrate de que la capa esté sobre la imagen de fondo */
    }

    .logo-cr {
        position: absolute;
        width: 275px;
        top: 50px;
        left: 50px;
        z-index: 2;
    }

    span {
        font-size: 14px;
        font-weight: 700;
        padding: 5px 10px;
        background-color: var(--green);
        text-transform: uppercase;
        z-index: 2;
        color: var(--black);
    }

    h2 {
        font-size: 30px;
        font-weight: 400px;
        z-index: 2;
    }

    @media (max-width: 1200px) {
        padding: 0 50px;
    }

    @media (max-width: 950px) {
        display: none;
    }
`

export const LoginWrapperForm = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50px 100px;
    width: 100%;
    min-width: 50%;
    gap: 30px;
    height: 100%;
    background-color: var(--gray-500);

    .logo-cr {
        width: 78px;
        @media (max-width: 700px) {
            display: none;
        }
    }

    @media (max-width: 1200px) {
        padding: 50px;
    }

    @media (max-width: 700px) {
        position: absolute;
        justify-content: start;
        bottom: 0;
        height: 64%;
        padding: 30px;
        border-radius: 30px 30px 0 0;
    }
`

export const LoginWrapperUp = styled.div`
    display: none;
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

    @media (max-width: 700px) {
        display: flex;
    }

`

export const LoginDataContainer = styled.form`
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
        color: var(--white);
        transition: color .5s ease; /* Aplica la transición solo al color */
    }

    a:hover {
        color: var(--green);
    }
    
`
export const ButtonLogin = styled.button`
    display: flex;
    padding: 10.5px 17.5px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    background-color: var(--green);
    height: fit-content;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
    color: var(--black);
    border: 1px solid var(--green);
    background: var(--green);
    transition: all .3s ease-in-out;
    width: 100%;
    &:hover {
        opacity: .9;
        @media (maxwidth: 768px) {
            opacity: 1;
        }
    }

    &:disabled {
        opacity: .5;
        cursor: not-allowed;
    }

    .go1858758034 {
        width: 12px;
        height: 12px;
        box-sizing: border-box;
        border: 2px solid;
        border-radius: 100%;
        border-color: black;
        border-right-color: var(--green);
        animation: go1268368563 1s linear infinite;
    }
`
export const ActivInfoContainer = styled.div`
    & p {
        text-align: start;
        font-size: 14px;
        color: var(--green);
    }
`
