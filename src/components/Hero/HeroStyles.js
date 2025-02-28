import styled from "styled-components";

export const HeroContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    background-image: url(https://coparelampago.com/uploads/CR/img_hero.jpg);
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%; /* Agregar altura */
        background: linear-gradient(to top, var(--black-950-rgba) 0%, rgba(13, 13, 13, .45) 100%);
    }
`;


export const HeroWrapper = styled.div`
    width: 100%;
    max-width: 1260px;
    padding: 170px 30px;
    z-index: 2;
    @media (max-width: 900px) {
        padding: 100px 30px;
    }
`

export const HeroText = styled.div`
    width: 55%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    h2 {
        font-weight: 700;
        line-height: 35px;
        font-size: 35px;
        text-transform: uppercase;
        @media (max-width: 900px) {
            font-size: 30px;
            line-height: 30px;
        }
        span {
            font-weight: 700;
            color: var(--green);
        }
    }

    @media (max-width: 900px) {
        width: 100%;
    }
`