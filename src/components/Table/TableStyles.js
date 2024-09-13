import { DataTable } from "primereact/datatable";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const TableContainerStyled = styled(DataTable)`
    /* background-color: var(--gray-300) !important; */
    border-radius: 10px;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    user-select: none;

    td, th {
        text-align: left;
        overflow: hidden; /* Oculta el contenido que desborda */
        text-overflow: ellipsis; /* Muestra puntos suspensivos si el contenido desborda */
        padding: 15px 20px; /* Espaciado interno de las celdas */
        min-width: fit-content;
        background-color: var(--gray-400);
        /* user-select: none; */
    }
    th {
        color: var(--gray-200);
        border: none;
        border-bottom: 1px solid var(--gray-300);
        text-transform: uppercase;
        &.p-sortable-column .p-column-header-content {
            gap: 10px;

            svg {
                color: var(--gray-200);
            }
        }

        &.p-highlight {
            color: var(--green);
        }
    }

    td {
        padding: 15px 20px;
        width: fit-content;
        height: 100%;
        border: none;
        border-bottom: 1px solid var(--gray-300);
    }
    tbody tr {
        border-bottom: 1px solid var(--gray-300) !important;
    }

    tbody tr:last-child td {
        border-bottom: none !important;
    }

    tr:nth-last-child(1) {
        border: none;
    }

    tbody tr:hover {
        cursor: pointer;
        opacity: .85;
        transition: all .2s ease-in-out;
    }
    


    input.checkbox {
        appearance: none; /* Anular los estilos por defecto del navegador */
        width: 14px;
        height: 14px;
        background-color: transparent;
        border: 1px solid var(--white);
        border-radius: 4px;
        cursor: pointer; /* Cambia el cursor al pasar por encima */
        transition: all .2s ease-in;
        &:checked {
            background-color: var(--green);
            border-color: var(--green);
        }
    }
    tr.check {
        background-color: var(--green-opacity);
        color: var(--green);
        width: 80px;
    }
    .ellipsis {
        font-size: 20px;
        color: var(--green);
    }
    th.th-checkbox,
    th.th-team {
        min-width: fit-content;
        max-width: 10px;
        width: 10px; /* Asegura que el ancho sea exactamente de 10px */
        white-space: nowrap; /* Evita que el contenido se ajuste y sobrepase el ancho máximo */
        overflow: hidden; /* Oculta el contenido que desborda */
        text-overflow: ellipsis; /* Muestra puntos suspensivos si el contenido desborda */
    }
    th.th-team {
    }

    th .p-column-title {
        width: 100%;
    }

    td img {
        height: 20px;
    }
    
    .td-team {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .td-user {
        display: flex;
        gap: 5px;
        img {
            border-radius: 50%;
        }
    }

    .td-player {
        display: flex;
        gap: 5px;
        align-items: center;
        .circulo {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            &.verde {
                background-color: var(--green);
            }
            &.rojo {
                background-color: red;
            }
        }
    }

    .td-estado {
        display: flex;
        gap: 2px;
        align-items: center;
        width: fit-content;
        font-size: 13px;
        padding: 2px 10px;
        border-radius: 10px;
        color: var(--white);
        &.activo {
            background-color: var(--green);
        }
        &.inactivo {
            background-color: var(--red);
        }
        &.proceso {
            background-color: orange;
        }
    }

    .td-temporada {
        display: flex;
        gap: 2px;
        align-items: center;
        width: fit-content;
        font-size: 13px;
        padding: 2px 10px;
        border-radius: 10px;
        color: var(--white);

        &.orange {
            background-color: #ee9410;
        }
    }

    .p-paginator {
        width: 100%;
        display: flex;
        color: var(--white) !important;
        gap: 50px;
        padding: 15px 20px;

        > button {
            color: var(--gray-200);
            font-size: 16px;
            height: 42px;
            width: 42px;
            border-radius: 50%;
            
            
            &:hover {
                background-color: var(--gray-200);
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
            gap: 10px;

            > button {
                color: var(--gray-200);
                font-size: 16px;
                height: 42px;
                width: 42px;
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

    .p-datatable-emptymessage {
        display: none;
    }

    .p-dropdown  {
        gap: 10px;
        padding: 5px 10px;
        border-radius: 10px;
        border: 1px solid var(--gray-200);
    }

    

    .p-checkbox .p-checkbox-box {
        background-color: var(--gray-300);
        border: 1px solid var(--green);
    }

    .p-checkbox.p-highlight .p-checkbox-box {
        border-color: var(--green);
        background: var(--green)
    }

    tr.p-highlight {
        background-color: rgba(42, 209, 116, 0.3) !important;
    }

    tr.p-selectable-row[data-p-highlight="true"] td {
        background-color: rgba(42, 209, 116, 0.3) !important;
        color: var(--green) !important;
        border-bottom: 1px solid var(--green);
        transition: all .2s ease-in-out;
    }

`

export const EstadoBodyTemplate = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-width: 80px;
    font-size: 13px;
    padding: 2px 10px;
    border-radius: 10px;
    color: var(--white);
    background-color: ${({ $bg }) => `var(--${$bg})` || 'var(--gray-200)'};
`

export const AccionesBodyTemplate = styled.div`
    display: flex;
    gap: 10px;
    max-width: fit-content;
    color: var(--white);
    button {
        padding: 6px 10px;
    }
`

export const EquipoBodyTemplate = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 160px;
    &.local {
        flex-direction: row-reverse;
        text-align: end;
    }
`

export const ResultadoBodyTemplate = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;

    .ganador {
        font-weight: 800;
    }
`

export const LinkBodyTemplate = styled(NavLink)`
    color: var(--green);
    text-decoration: underline;
    transition: all .2s ease-in-out;
    &:hover {
        opacity: .7;
    }
`

export const DataItemTemplate = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--white);
    width: fit-content;

    svg {
        font-size: 20px;
        color: var(--green);
    }
`