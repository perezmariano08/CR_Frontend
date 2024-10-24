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
        justify-content: center;
    }

    thead tr:first-child th:nth-child(2) .p-column-header-content {
        justify-content: start;
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
        text-align: start;
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

    .my-team-row {
        color: var(--green); /* Un color verde claro de fondo */
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


// Posiciones

export const TablaPosiciones = styled(DataTable)`
    padding: 10px 10px 10px 0;
    .p-column-header-content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        padding: 0;
        & :nth-child(2) {
            display: none;
        }
    }

    th.p-highlight {
        color: var(--green) !important;
        & :nth-child(2) {
            display: flex;
            svg {
                color: var(--green);
                width: 8px
            }
        }
    }

    tr:hover {
        td {
            background-color: var(--gray-300);
        }

        .team {
            text-decoration: underline;
        }
    }

    td, th {
        height: 36px;
        text-align: center;
        background-color: var(--gray-400);
        border: none;

        @media (max-width: 768px) {
            font-size: 0.9em;
        }
    }

    th {
        color: var(--gray-200) !important;
    }


    tr th:nth-child(2) .p-column-header-content  {
        justify-content: start;
    }

    // Estadisticas puntos
    tr th.p-sortable-column:nth-child(1){
        width: 50px;
        @media (max-width: 768px) {
            width: 40px;
        }

        .p-column-header-content  {
            width: 100%;
        }
    }

    // Estadisticas puntos
    tr th.p-sortable-column:nth-child(3), 
    tr th.p-sortable-column:nth-child(4), 
    tr th.p-sortable-column:nth-child(5), 
    tr th.p-sortable-column:nth-child(6), 
    tr th.p-sortable-column:nth-child(7), 
    tr th.p-sortable-column:nth-child(8),
    tr th.p-sortable-column:nth-child(9),
    tr th.p-sortable-column:nth-child(10) {
        width: 50px;

        @media (max-width: 768px) {
            width: 30px;
        }

        .p-column-header-content  {
            width: 100%;
        }
    }

    // Estadisticas puntos
    tr td:nth-child(3) {
        font-weight: 700;
    }

    td .team {
        text-align: left;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 108px;
            img {
            height: 15px;
        }

        &:hover {
            color: var(--gray-100);
        }
    }

    .pos {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        /* padding-left: 5px; */
        span {
            position: absolute;
            width: 2px;
            height: 70%;
            left: 0;
            top: 50%;
            transform: translateY(-50%);

            &.green {
                background-color: var(--green);
            }

            &.orange {
                background-color: orange;
            }

            &.blue {
                background-color: #0046A7;
            }

            &.yellow {
                background-color: yellow;
            }

            &.red {
                background-color: var(--red);
            }
        }
    }
`

export const EstadisticaTabla = styled.div`
    border: 1px solid red;
    background-color: var(--gray-100);
`

export const TablaFormatoDetalle = styled.div`
    padding: 16px 16px 24px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
`

export const FormatoDetalleItem = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    span {
        width: 8px;
        background-color: var(--green);
        height: 8px;
        border-radius: 50%;
        &.green {
            background-color: var(--green);
        }

        &.orange {
            background-color: orange;
        }

        &.blue {
            background-color: #0046A7;
        }

        &.yellow {
            background-color: yellow;
        }

        &.red {
            background-color: var(--red);
        }
    }

    p {
        font-size: 12px;
        color: var(--gray-100);
    }
`