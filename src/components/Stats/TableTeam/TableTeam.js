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
        min-width: 30px;
        font-size: 14px;
    }

    .player {
        display: flex;
        align-items: center;
        gap: 5px;

        img {
            width: 20px;
            height: 20px;
        }
    }

    // Estilos de la paginación
    .p-paginator {
        width: 100%;
        display: flex;
        color: var(--white) !important;
        gap: 20px;
        padding: 10px 15px;

        > button {
            color: var(--gray-200);
            font-size: 14px;
            border: none;
            border-radius: 50%;
            
            &:hover {
                color: var(--gray-100);
                transition: all .2s ease-in;
            }

            &.p-disabled {
                background-color: transparent;
                opacity: .5;
                visibility: hidden;
            }
        }

        .p-paginator-pages {
            display: flex;
            gap: 2px;

            > button {
                color: var(--gray-200);
                font-size: 12px;
                border: none;
                border-radius: 50%;

                &:hover {
                    background-color: var(--gray-200);
                    color: var(--gray-100);
                    transition: all .2s ease-in;
                }

                &.p-highlight {
                    background-color: var(--green-opacity);
                    color: var(--green);
                }
            }
        }
    }

    // Estilos del dropdown de filas por página
    .p-dropdown {
        background: var(--gray-300) !important;
        color: var(--gray-200) !important;
        border: none;
        border-radius: 4px;
        font-size: 10px;

        .p-dropdown-trigger {
            background: var(--gray-400) !important;
            border: none;
            border-radius: 4px;
            height: 30px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background: var(--gray-500) !important;
                color: var(--white) !important;
            }
        }

        .p-dropdown-items {
            background: var(--gray-300) !important;
            color: var(--gray-200) !important;
            border: 1px solid var(--gray-400) !important;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

            .p-dropdown-item {
                padding: 8px 12px;
                font-size: 14px;

                &:hover {
                    background: var(--gray-400) !important;
                    color: var(--white) !important;
                }

                &.p-highlight {
                    background: var(--green-opacity) !important;
                    color: var(--green) !important;
                }
            }
        }
    }
`
