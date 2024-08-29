import { DataTable } from "primereact/datatable";
import styled from "styled-components";

export const TableContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--gray-400);
    border-radius: 20px;
    overflow: hidden;
    padding: 20px 0;
    gap: 20px;
    max-width: 100%;
`

export const TableTitle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 25px;
    h3 {
        font-weight: 600;
        font-size: 16px;
        line-height: 16px;
    }

    p {
        font-weight: 300;
        font-size: 14px;
        line-height: 14px;
        color: var(--green);
    }
`

export const TableTitleDivider = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--gray-300);
`

export const TableWrapper = styled(DataTable)`
    width: 100%;
    border-collapse: collapse;
    
    .p-column-header-content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        padding: 0;
        & :nth-child(2) {
            display: none;
        }
    }

    th.p-highlight {
        color: var(--green);
        & :nth-child(2) {
            display: flex;
            svg {
                color: var(--green);
                width: 8px
            }
            
        }
    }

    td, th {
        padding: 0 0 10px 0;
        background: var(--gray-400) !important;
        border: none;
        text-align: center;
        min-width: 30px
    }

    th {
        padding-right: 0px;
    }

    thead tr:first-child th:first-child .p-column-header-content {
        justify-content: start;
        padding-left: 17px;
    }

    tbody tr td .pos {
        text-align: start;
        &.red {
            border-left: 2px solid red ;
        }
        &.green {
            border-left: 2px solid var(--green) ;
        }
        &.orange {
            border-left: 2px solid orange ;
        }
        padding-left: 15px;
    }
    
    tbody tr td{
        margin-top: 10px;
    }

    th {
        text-align: center;
        text-align: start;
    }

    .my-team {
        color: var(--green);
    }

    .team {
        text-align: left;
        display: flex;
        align-items: center;
        gap: 5px;
        min-width: 108px
    }

    .team img {
        height: 15px;
    }

    th {
        color: var(--gray-200);
    }

    .one {
        border-left: 2px solid var(--green);
    }

    .two {
        border-left: 2px solid var(--red);
    }

    .three {
        border-left: 2px solid var(--red);
    }

    .CardYellow {
        color: yellow;
    }

    .CardRed {
        color: red;
    }

    
`
export const TableFoot = styled.div`
    display: flex;
    gap: 20px;
    padding: 0 20px;
    flex-wrap: wrap;
`

export const TableFootItem = styled.div `
    display: flex;
    gap: 6px;
    align-items: center;

    h3 {
        font-weight: 400;
        font-size: 14px;
        line-height: 10px;
    }

    div {
        border-radius: 50%;
        height: 6px;
        width: 6px;
        background-color: red;

        &.one {
            background-color: var(--green);
        }

        &.two {
            background-color: orange;
        }

        &.three {
            background-color: red;
        }
    }
`