import styled from "styled-components";

export const PenaltyWrapper = styled.div`
    background-color: var(--gray-400);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
    width: 100%;
`;

export const PenaltyContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 15px;
`;

export const OptionContainer = styled.span`
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 10px;
    width: 100%;
    transition: all ease 1s;
    
    h3 {
        font-size: 15px;
    }
`;

export const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
    appearance: none;
    width: 24px;
    height: 24px;
    background-color: var(--gray-200);
    border: 2px solid var(--green);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:checked {
        background-color: var(--green);
        border-color: var(--green);
    }

    &:checked::after {
        content: '✔';
        color: white;
        font-size: 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        border-color: var(--green);
    }
`;

export const CheckboxLabel = styled.p`
    font-size: 16px;
`;

export const CustomInput = styled.input.attrs({ type: 'number' })`
    width: 60px;
    padding: 10px;
    font-size: 16px;
    background-color: var(--gray-200);
    border: 2px solid var(--gray-400);
    border-radius: 6px;
    text-align: center;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
        outline: none;
        border-color: var(--green);
        box-shadow: 0 0 5px var(--green);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &:hover {
        border-color: var(--green);
    }
`;

export const HiddenOptionContainer = styled.div`
    width: 100%;
    overflow: hidden;
    transition: max-height 0.6s ease, opacity 0.6s ease;
    max-height: ${({ show }) => (show ? '200px' : '0')};
    opacity: ${({ show }) => (show ? 1 : 0)};
`;

export const TeamContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;

    img {
        width: 30px;
    }

    h3 {
        font-size: 14px;
    }
`