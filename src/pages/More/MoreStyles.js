import styled from "styled-components";

export const MoreStyledContainer = styled.div`
    padding: 30px 30px 140px 30px;
`
export const MoreWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`
export const MoreTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid var(--gray-200);
    padding-bottom: 10px;

    h2 {
        font-size: 30px;
        font-weight: 800;
    }
`
export const MoreContainerImg = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;

    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        border-radius: 60%;
    }
`

export const MoreMid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const MoreAction = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: start;
    background: var(--gray-500);
    padding: 15px;
    border-radius: 15px;
    cursor: pointer;
`
export const MoreIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background: var(--green);
    color: white;
`
export const ButtonLogout = styled.button`
    display: flex;
    padding: 10.5px 17.5px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    background-color: transparent;
    height: fit-content;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
    color: var(--white);
    border: 1px solid var(--red);
    background: var(--red);
    transition: all .1s ease-in-out;

    &:hover {
        opacity: .7;
        @media (maxwidth: 768px) {
            opacity: 1;
        }
    }

    &:disabled {
        opacity: .3;
        cursor: not-allowed;
        pointer-events: none;
    }

    &i,svg {
        font-size: 20px;
    }
`