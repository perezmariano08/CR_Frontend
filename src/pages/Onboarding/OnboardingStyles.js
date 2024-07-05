import styled from "styled-components";

export const OnboardingContainerStyled = styled.div`
    padding: 30px;
    background-image: url(/imagen_log.png);
    background-position: center;
    background-size: cover;
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    height: 100vh;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .85;
        z-index: 0;
    }
`

export const OnboardingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
    width: 100%;
    img {
        width: 60px;
        z-index: 1;
    }

    button {
        width: 100%;
    }
`

export const OnboardingButtonsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 1;
`