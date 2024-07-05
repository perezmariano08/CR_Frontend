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

    h3 {
        font-weight: 600;
    }

    img {
        width: 30px;
    }
`
export const PlanillaButtons = styled.button`
    background: transparent;
    padding: 5px 10px;
    color: white;
    border-radius: 10px;
    border: 1px solid var(--green);
    cursor: pointer;
    &.active {
        background-color: var(--green);
        font-size: 15px;
    }
`;
export const TablePlanillaWrapper = styled.table`
    background-color: var(--gray-300);
    width: 100%;
    border-collapse: collapse;
    display: flex;
    flex-direction: column;

    tr{
        &.playerEventual {
            color: var(--yellow);  
        }
    }

    td, th {
        padding: 10px;
    }
    th {
        color: var(--gray-200);
    }

    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    tbody tr {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    td {
        text-align: end;

        &.disabled{
            opacity: 0.5;
            pointer-events: none;
        }
    
    &.tdActions {
        display: flex;
        align-items: center;
        gap: 5px;

        .edit {
            color: var(--green);
            cursor: pointer;
        }

        .delete {
            color: var(--red);
            cursor: pointer;
        }

        .disabled {
            pointer-events: none;
            opacity: 0.5;
        }
    }}

    .dorsal {
        min-width: 60px;
        background: white;
        color: var(--gray-300);
        font-weight: 700;
        font-size: 17px;
        border-radius: 15px;
        text-align: center;
        cursor: pointer;
    }

    .text {
        text-align: center;
        min-width: 100px;
        font-weight: 600;
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
