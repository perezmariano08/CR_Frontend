import styled from "styled-components";

export const CategoriaEquiposEmpty = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--gray-300);
    gap: 20px;
    padding: 10px 15px;
    max-width: 400px;
    width: 100%;
    border-radius: 10px;
`

export const EquipoDetalleInfo = styled.div`
    display: flex;
    width: 100%;
    background-color: var(--gray-300);
    padding: 20px 30px;
    border-radius: 10px;
    justify-content: space-between;
    align-items: center;

    button {
        height: fit-content;
    }
`

export const EquipoWrapper= styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    img {
        height: 45px;
    }

    h1 {
        font-size: 30px;
    }
`

export const ResumenItemsContainer = styled.div`
    display: flex;
    gap: 10px;
`

export const ResumenItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--gray-400);
    width: 30%;
    border-radius: 20px;
    overflow: hidden;
`

export const ResumenItemTitulo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    font-size: 14px;
    border-bottom: 0.5px solid var(--gray-300);
    text-transform: uppercase;
    min-height: 60px;
    span {
        background-color: var(--gray-300);
        padding: 5px 10px;
        border-radius: 10px;
    }

    svg {
        color: var(--green);
        font-size: 16px;
    }
`

export const ResumenItemDescripcion = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 20px;
    min-height: 150px;

    a {
        margin-top: 30px;
        color: var(--green);
        text-decoration: underline;
    }
`

export const EquiposDetalle = styled.div`
    display: flex;
    align-items: center;
    height: fit-content;
    h3 {
        font-weight: 600;
        min-width: 60px;
    }

    p {

    }
`
