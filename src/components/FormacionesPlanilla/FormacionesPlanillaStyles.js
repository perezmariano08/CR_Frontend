import { color } from "framer-motion";
import styled from "styled-components";

export const FormacionesPlanillaWrapper = styled.div`
    background-color: var(--gray-300);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
`
export const FormacionesPlanillaTitle = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    h3 {
        font-weight: 600;
    }

    img {
        width: 30px;
    }
`

export const FormacionesPlanillaHeader = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    img {
        width: 30px;
    }
`


export const PlanillaButtons = styled.button`
    background: transparent;
    padding: 5px;
    color: white;
    border-radius: 10px;
    border: 1px solid var(--green);
    cursor: pointer;
    width: 50%;
    font-size: 12px;
    transition: all .2s ease-in-out;
    &.active {
        background-color: var(--green);
    }
`;
export const TablePlanillaWrapper = styled.table`
    background-color: var(--gray-300);
    width: 100%;
    border-collapse: collapse;
    display: flex;
    flex-direction: column;

    tr {
        &.playerEventual {
            color: var(--yellow);  
        }
        margin-bottom: 10px;

        &.expulsado {
            color: var(--red);
            pointer-events: none;
            opacity: 0.5
        }
    }

    td {
        padding: 10px;
    }

    th {
        text-align: start;
        color: var(--gray-200); 
        font-size: 12px;
        padding: 20px 10px 20px 10px;
        width: 100%;
        width: fit-content;
        &.th-dorsal {
            min-width: 40px;
        }

        &.th-dni {
            min-width: 80px;
        }

        &.th-nombre {
            min-width: 40px;
        }
    }

    .head {
        display: flex;
        align-items: center;
        width: 100%;

        .info-player {
            width: 70%;
        }

        .dorsal {
            min-width: 40px;
        }

        .dni {
            min-width: 90px;
        }
        .editar {
            width: 30%;
            text-align: end;
        }
    } 

    tbody tr {
        display: flex;
        width: 100%;

        .info-player {
            display: flex;
            width: 70%;
        }
    }

    td {
        display: flex;
        align-items: center;
        justify-content: start;
        text-align: start;
        &.dni {
            min-width: 90px;
        }

        &.nombre {
            width: 100%;
        }
        &.disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    
    &.tdActions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 30%;
        gap: 10px;
        font-size: 20px;
        .edit {
            color: var(--green);
            cursor: pointer;
        }

        .delete {
            color: var(--red);
            cursor: pointer;
        }

        .star {
            color: var(--yellow);
            cursor: pointer;
        }

        .disabled {
            opacity: 0.5;
            pointer-events:none;        }
    }}

    td.dorsal {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'League Gothic';
        min-width: 40px;
        min-height: 30px;
        background: var(--green);
        color: var(--gray-300);
        font-weight: 400;
        font-size: 20px;
        border-radius: 8px;
        cursor: pointer;

        &.disabled {
            background-color: var(--white);
            opacity: .1;
            pointer-events: none;
        }
    }

    .text {
        text-align: start;
        font-weight: 600;
        font-size: 12px;
    }
`;

export const PlayerEventContainer = styled.div`
    padding: 10px 0; 
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    p {
        cursor: pointer;
        color: var(--gray-600);
        position: relative;
        transition: color 0.3s ease; 
    }

    p::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 2px;
        background-color: transparent;
        transition: background-color 0.3s ease;
    }

    p:hover {
        color: var(--gray-800);
    }

    p:hover::after {
        background-color: var(--green);
    }
`
