import styled from "styled-components";

export const DividerWrapper = styled.div`
    height: 1px;
    background-color: ${({ color }) => color || 'var(--default-color)'};
    width: 100%;
`;
