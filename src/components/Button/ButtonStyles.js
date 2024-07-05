import styled from "styled-components";

export const ButtonWrapper = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    gap: 6px;
    background: ${({ $bg }) => `var(--${$bg})`};
    color: ${({ color }) => `var(--${color})`};
    border: none;
    border-radius: 10px;
    font-size: 14px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    
    &:hover {
        opacity: ${({ disabled }) => (disabled ? 0.9 : 0.9)};
    }
` 