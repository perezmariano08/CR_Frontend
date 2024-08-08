import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const CreateAccountContainerStyled = styled.div`
    padding: 30px;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
`

export const CreateAccountWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
    width: 100%;
    height: 100%;

    p a {
        color: var(--green);
    }
`

export const CreateAccountData = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 30px;
    h2 {
        font-size: 18px;
        font-weight: 600;
        width: 100%;
    }

    a {
        width: 100%;
    }
`
export const ForgotPasswordTitle = styled.div`
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 15px;

    h2 {
        text-align: center;
    }

    i,svg {
        color: var(--green);
        font-size: 70px;
    }
`

export const CreateAccountInputs = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    input {
        width: 100%;
    }
`
export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;

    p {
        font-size: 12px;
        color: var(--red);
    }
`
export const ErrorContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;

    p, svg {
        color: var(--red);
        font-size: 12px;
    }
`
export const BackToLogin = styled(NavLink)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--gray-200);
    transition: color ease .5s;

    &:hover {
        color: var(--gray-100);
    }
`