import { DataTable } from "primereact/datatable";
import styled from "styled-components";

export const TablaEstadisticasWrapper = styled(DataTable)`
    background-color: transparent;
    padding: 20px 32px;
    @media (max-width: 968px) {
        padding: 20px;
    }
    tr {
        background-color: inherit;
        padding: 20px 0;
        height: auto;
        // Quitar el border-bottom de todos los td en el último tr
        &:first-child th {
            border-bottom: none;
        }

        &:last-child td {
            border-bottom: none;
        }
    }
    

    th, td {
        background-color: inherit;
        border: none;
        border-bottom: 1px solid var(--gray-300);
        padding: 10px 0;
    }

    th {
        &:last-child {
            display: flex;
            align-items: center;
            justify-content: end;
        }
    }

    th {
        color: #a8a8a8;
        text-transform: uppercase;
        font-size: 12px;
    }
`

export const JugadorBodyTemplate = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    img {
        width: 30px;
    }
`

export const EstadisticaNumero = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
`

export const JugadorBodyTemplateNombre = styled.div`
    display: flex;
    flex-direction: column;

    span {
        font-size: 10px;
        color: #a8a8a8;
    }
`