import styled from "styled-components";

export const DashboardItemsWrapper = styled.div`
    display: flex;
    gap: 30px;
    width: 100%;
    flex-wrap: wrap;
`

export const DashboardItemWrapper = styled.div`
    display: flex;
    gap: 10px;
    svg {
        width: 20px;
        height: 20px;
        color: var(--green);
    }
`

export const DashboardItemInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 14px;
    line-height: 14px;
    min-width: 120px;
    
    .numero {
        font-size: 20px;
        line-height: 20px;
        font-weight: 700;
    }

    .titulo {
        font-weight: 400;
    }

    .descripcion {
        color: var(--gray-200);
    }

    .link {
        color: var(--green);
        text-decoration: underline;
    }
`

export const DashboardItemDivider = styled.div`
    height: auto;
    width: 1px;
    background-color: var(--green);
`