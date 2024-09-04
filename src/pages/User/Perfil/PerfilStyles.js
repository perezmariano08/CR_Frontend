import styled from "styled-components";

export const PerfilContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

export const PerfilWrapper = styled.div`
    max-width: 1260px;
    width: 100%;
    padding: 30px;
    display: flex;
`

export const PerfilContentWrapper = styled.div`
    display: flex;
    gap: 20px;
    flex-direction: column;
    width: 100%;
    background-color: var(--gray-400);
    padding: 16px 32px;
    border-radius: 20px;

    h2 {
        width: 100%;
        border-bottom: 1px solid var(--gray-300);
        padding: 16px 0 ;
    }
`

export const PerfilMiEquipo = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    img {
        width: 40px;
    }
`

export const PerfilMisDatos = styled.div`
    display: flex;
    width: 50%;
    flex-direction: column;
    gap: 30px;
    align-items: end;

`
export const ButtonContainer = styled.div`
    width: 50%;

    button {
        width: 100%;
        display: flex;
        padding: 10.5px 17.5px;
        gap: 10px;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        background-color: var(--green);
        height: fit-content;
        border-radius: 10px;
        cursor: pointer;
        user-select: none;
        color: ${({ color }) => `var(--${color})`};
        border: 1px solid ${({ border }) => `var(--${border})`};
        background: var(--green);
        transition: all .1s ease-in-out;

    &:hover {
        opacity: .9;
        @media (maxwidth: 768px) {
            opacity: 1;
        }
    }

    &.disabled {
        cursor: not-allowed;
        opacity: .5;
    }
    }
`