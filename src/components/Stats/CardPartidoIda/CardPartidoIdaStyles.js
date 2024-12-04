import styled from "styled-components";

export const CardPartidoIdaWrapper = styled.div`
    background-color: var(--gray-400);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    gap: 20px;
    border-radius: 20px;


`
export const CardPartidoIdaTitles = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    h3 {
        font-size: 14px;
    }

    h4 {
        font-size: 12px;
        color: var(--green);
    }
`

export const ContentPartidoIda = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
`
export const EquipoContainer = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;

    img {
        width: 60px;
    }

    h4 {
        font-size: 12px;
    }
`
export const PartidoIdaResultado = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--gray-200);
    border-radius: 10px;
    color: var(--gray-100);
    padding: 15px;
    font-size: 20px;
`