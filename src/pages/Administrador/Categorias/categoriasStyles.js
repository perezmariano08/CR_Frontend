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
