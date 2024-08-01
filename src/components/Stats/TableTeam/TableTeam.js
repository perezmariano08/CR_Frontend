import { DataTable } from "primereact/datatable";
import styled from "styled-components";

export const TableTeamWrapper = styled(DataTable)`
    background: var(--gray-300) !important;
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;

    // Estilo del header
    .p-column-header-content {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 4px;
        padding: 0;
        color: var(--gray-200);
        & :nth-child(2) {
            display: none;
        }
    }

    // Estilo del header de la columna ordenada activa
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
        padding: 0 15px 10px 25px;
        background: var(--gray-300) !important;
        border: none;
        min-width: 30px
    }

    .player {
        display: flex;
        gap: 5px;

        img {
            width: 20px;
            height: 20px;
        }
    }
`
