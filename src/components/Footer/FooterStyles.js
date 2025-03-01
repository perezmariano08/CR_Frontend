import styled from "styled-components";

export const FooterContainerStyled = styled.footer`
    margin-top: 20px;
    padding: 30px 80px;
    z-index: 100;
    display: flex;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: var(--gray-500);

    @media (max-width: 968px) {
        display: flex;
        padding: 20px;
    }
`;

export const FooterWrapper = styled.div`
    max-width: 1200px;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: flex-start; 
    flex-wrap: wrap;

    @media (max-width: 968px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const FooterTop = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;

    h3 {
        font-size: 35px;
        font-weight: 700;
        width: 100%;
    }

    img {
        width: 90px;
    }

    @media (max-width: 1200px) { 
        h3 {
            width: 70%;
            font-size: 30px;
        }
    }

    @media (max-width: 968px) {
        width: 100%;
        align-items: flex-start;
        text-align: left;

        h3 {
            font-size: 25px;
        }

        img {
            width: 80px;
        }
    }
`;

export const FooterBottomContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
`;

export const FooterMiddle = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;

    img {
        width: 100px;
    }

    h3 {
        font-size: 40px;
        font-weight: 700;
        width: 100%;
    }

    @media (max-width: 968px) {
        margin-top: 20px;
        width: 100%;
        align-items: flex-start;
        text-align: left;
    }
`;

export const FooterContacto = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;

    &.contacto { 
        width: 300px;
    }

    @media (max-width: 968px) {
        align-items: flex-start;
        gap: 20px;
    }
`;

export const FooterSocial = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 10px;
    cursor: pointer;
    transition: all .2s ease-in-out;
    color: var(--gray-200);

    &:hover {
        color: var(--green);
    }

    @media (max-width: 968px) {
        justify-content: flex-start;
    }

    a {
        color: inherit;
        text-decoration: none;
    }
`;

export const FooterBottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
`;

export const FooterRightItems = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: start;
    gap: 60px;

    @media (max-width: 968px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
`;

export const FooterForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
    width: 100%;

    @media (max-width: 968px) {
        align-items: flex-start;
    }
`;

export const FooterLinksContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: end;
    gap: 40px;

    @media (max-width: 968px) {
        align-items: flex-start;
        gap: 20px;
    }
`;

export const ButtonFooterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;

    @media (max-width: 968px) {
        justify-content: flex-start;
    }
`;

export const BottomFooter = styled.div`
    margin-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    border-top: 1px solid var(--gray-300);
    padding-top: 20px;

    @media (max-width: 968px) {
        
    }
`