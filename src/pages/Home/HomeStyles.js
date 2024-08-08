import styled from "styled-components";

export const HomeContainerStyled = styled.div`
`

export const HomeWrapper = styled.div`
    flex-direction: column;
    gap: 40px;
    width: 100%;
    display: flex;
`

export const CardsMatchesContainer = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: hidden;
    padding-bottom: 20px;
`
export const CardsMatchesWrapper = styled.div`
    display: flex;
    gap: 20px;
    height: 100%;
    overflow-x: auto;
    padding: 0px 0 15px 0;
    width: 100%;
`
export const ViewMore = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & a {
        color: var(--gray-200);
    }
    
    & a:hover {
        color: var(--gray-300);
    }
`