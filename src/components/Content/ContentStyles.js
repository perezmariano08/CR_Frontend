import { motion } from "framer-motion";
import styled from "styled-components";

export const ContentContainerStyled = styled(motion.div)`
    margin-left: ${({ isOpen }) => (isOpen ? '16rem' : '0')};
    width: ${({ isOpen }) => (isOpen ? 'calc(100% - 16rem)' : '100%')};
    transition: margin-left 0.3s ease, width 0.3s ease;
    @media (max-width: 968px) {
        width: 100%;
        margin-left: 0;
    }
    height: fit-content;
`;

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

