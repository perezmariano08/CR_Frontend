import styled from 'styled-components';

export const HomeContainerStyled = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    width: 100%;
`;

export const HomeWrapper = styled.div`
    gap: 40px;
    width: 100%;
    display: flex;
    align-items: start;
    max-width: 1260px;
    padding: 40px 30px;
    &.planilla {
        flex-direction: column;
    }
`;

export const HomeLeftWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 300px;
    gap: 40px;
`;

export const HomeMediumWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 500px;
    gap: 40px;
`;

export const HomeRightWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 300px;
    gap: 40px;
`;

export const CardsMatchesContainer = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: hidden;
    padding-bottom: 20px;
    width: 100%;

    @media (min-width: 600px) {
        margin: 0 auto;
    }
`;

export const CardsMatchesWrapper = styled.div`
    display: flex;
    gap: 20px;
    height: 100%;
    overflow-x: auto;
    padding: 0px 0 15px 0;
    width: 100%;

    @media (min-width: 600px) {
        margin: 0 auto;
    }
`;

export const ViewMoreWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ViewMore = styled.a`
    display: flex;
    align-items: center;
    width: fit-content;
    justify-content: center;
    background-color: var(--green);
    padding: 8px 16px;
    border-radius: 20px;
    transition: all .1s ease-in-out;
    cursor: pointer;
    color: var(--black);

    &.menos {
        background-color: transparent;
        border: 1px solid var(--white);
        color: var(--white);
    }
    &:hover {
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;
