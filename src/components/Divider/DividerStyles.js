import styled from "styled-components";

export const DividerWrapper = styled.div`
    height: 1px;
    background: ${({ color }) => `var(--${color})`};
    width: 100%;
`