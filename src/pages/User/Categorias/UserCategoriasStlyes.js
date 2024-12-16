import styled from "styled-components";

export const CategoriasWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: center;
    max-width: 1260px;
    padding: 24px 30px;
    
    @media (max-width: 1160px) {
        gap: 20px;
        flex-direction: column;
    }  

    @media (max-width: 568px) {
        padding: 20px;
    }
`;

export const CategoriasContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
    justify-content: center;

    @media (max-width: 1160px) {
        width: 100%;
    }  
`;