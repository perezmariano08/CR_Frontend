import styled from "styled-components";

export const EliminacionDirectaWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: start;
    padding: 32px;
    gap: 20px;
    overflow-x: auto; /* Cambiar scroll a auto para que el scroll aparezca solo cuando sea necesario */

    /* Cada fase es una columna */
    .round {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        background-color: var(--gray-300);
        height: 100%;
        padding: 20px;
        border-radius: 20px;
    }

    .round h3 {
        color: white;
        margin-bottom: 20px;
    }

    /* Estilo para cada partido */
    .match {
        background-color: var(--gray-400);
        border-radius: 10px;
        padding: 10px;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        .equipo {
            display: flex;
            justify-content: space-between;
            .nombre {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            &.perdedor {
                color: var(--gray-200);
            }

            img {
                width: 20px;
            }
        }
    }

    /* Conectar con una línea entre partidos */
    .line {
        height: 30px;
        width: 2px;
        background-color: white;
        margin: 0 auto;
    }



    /* Opcional: bordes y separaciones como en la imagen */
    .bracket-line {
        height: 20px;
        width: 100px;
        border-top: 2px solid white;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

`