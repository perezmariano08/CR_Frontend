import styled from "styled-components";

export const StatsContainerStyled = styled.div`
`
export const StatsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
`
export const StatsHeadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
`
export const StatsFilter = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    flex-wrap: wrap;
    row-gap:10px;
    justify-content: center;
`
export const StatsFilterButton = styled.button`
    display: flex;
    padding: 6px 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    background-color: var(--gray-300);
    color: var(--white);
    height: fit-content;
    border: 1px solid ${({ border }) => `var(--${border})`};
    border-radius: 10px;
    cursor: pointer;

    &.active {
        background-color: var(--green);
    }
`