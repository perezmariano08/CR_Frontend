import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const TablasTemporadaContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 60px;
`

export const TablaTemporada = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;

    h2 {
        font-weight: 600;
    }
`

export const DataItemTemporada = styled(NavLink)`
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

export const DataItemEstado = styled.div`
    display: flex;
    align-items: center;
    width: fit-content;
    border-radius: 5px;
    padding: 4px 12px;
    font-size: 12px;
    &.gray {
        background-color: var(--gray-200);
        color: var(--white);
    }

    &.blue {
        background-color: var(--import);
        color: var(--white);
    }
`
