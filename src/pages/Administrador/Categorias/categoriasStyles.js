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

export const CategoriaFormatoWrapper = styled.div`
    display: flex;
    width: 100%;
    border-radius: 10px;
    overflow-y: scroll;
    background-color: var(--gray-400);
`

export const FormatoFaseWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 450px;
    height: 100%;
    max-width: 450px;
    gap: 20px;
`

export const FaseDivider = styled.div`
    display: flex;
    height: 100%;
    width: 1px;
    background-color: var(--gray-300);
`

export const FormatoFaseTitulo = styled.div`
    display: flex;
    width: 100%;
    height: fit-content;
    align-items: center;
    background-color: var(--gray-300);
    padding: 12px 24px;
    justify-content: space-between;
    border-radius: 10px;
`

export const FormatoZonasWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
`

export const FormatoZonaContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
    border-bottom: 1px solid var(--gray-300);
    &.no-expandido:hover {
        background-color: var(--gray-300);
    }

    &:first-child {
        border-top: 1px solid var(--gray-300);
        border-bottom: 1px solid var(--gray-300);
    }
`

export const FormatoZonaVacantes = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    gap: 10px;
    /* Estilo aplicado cuando está expandido */
    &.expandido {
        max-height: 1000px; /* Ajusta según el contenido que quieras expandir */
        transition: max-height 0.3s ease-in;
        padding-bottom: 20px;
        gap: 10px;
    }
`

export const VacanteWrapper = styled.div`
    width: calc(50% - 10px);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 35px 15px 15px 15px;
    border-radius: 10px;
    border: 1px solid var(--import);
    transition: all .2s ease-in;
    cursor: pointer;
    position: relative;

    &:hover {
        background-color: var(--gray-300);
    }

    &.equipo {
        border-color: var(--green);
    }

    a {
        text-decoration: underline;
        color: var(--import);
    }

     /* Agregar un estilo para el texto A1 */
    .vacante-texto {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        width: 40px;
        background-color: var(--import);
        top: 0;
        left: 0;
        font-size: 14px; /* Ajusta el tamaño del texto si es necesario */
        font-weight: bold;
        border-radius: 0 0 5px;

        &.existe {
            background-color: var(--green);
            color: var(--black);
        }
    }

    .relative {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        transition: all .2s ease-in;

        .modales {
            position: absolute;
            display: none;
            right: 0;
            top: 30px;
            background-color: var(--gray-200);
            width: 170px;
            z-index: 2;

            div {
                padding: 10px;
                width: 100%;
                transition: all .2s ease-in;
                color: var(--white);

                &:hover {
                    background-color: var(--green);
                    color: var(--black);
                    &.eliminar {
                        background-color: var(--danger);
                        color: var(--white);
                    }
                }
            }
        }

        &:hover {
            /* Puedes agregar aquí estilos adicionales si lo necesitas */
            color: var(--black);
            background-color: var(--green);
        }

        /* Ocultar el modal por defecto */
        .modales {
            display: none;
        }

        /* Mostrar el modal cuando se hace hover en el contenedor relativo */
        &:hover .modales {
            display: block;
        }
    }
`

export const VacanteEquipo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    img {
        height: 20px;
    }
`

export const FormatoZona = styled.div`
    display: flex;
    width: 100%;
    padding: 25px;
    gap: 15px;
    transition: all .3s ease-in-out;
    cursor: pointer;

    svg {
        transition: transform 0.3s ease;
        &.icono-rotado {
            transform: rotate(180deg);
            transition: transform 0.3s ease;
        }
    }

    .kebab {
        transform: rotate(90deg);
        font-size: 18px;
    }

    .relative {
        position: relative;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        transition: all .2s ease-in;

        .modales {
            position: absolute;
            display: none;
            right: 0;
            top: 30px;
            background-color: var(--gray-200);
            width: 150px;
            z-index: 2;

            div {
                padding: 10px;
                width: 100%;
                transition: all .2s ease-in;
                color: var(--white);

                &:hover {
                    background-color: var(--green);
                    color: var(--black);
                    &.eliminar {
                        background-color: var(--danger);
                        color: var(--white);
                    }
                }
            }
        }

        &:hover {
            /* Puedes agregar aquí estilos adicionales si lo necesitas */
            color: var(--black);
            background-color: var(--green);
        }

        /* Ocultar el modal por defecto */
        .modales {
            display: none;
        }

        /* Mostrar el modal cuando se hace hover en el contenedor relativo */
        &:hover .modales {
            display: block;
        }
    }
`

export const FormatoZonaInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin-right: auto;
    gap: 5px;
    p {
        span {
            color: var(--gray-100);
        }
        text-transform: uppercase;
    }

    span {
        color: orange;
        font-weight: 300;
        &.completo {
            color: var(--green);
        }
    }
`



export const EquipoExiste = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
        font-size: 22px;
    }
`

export const EquipoExisteDivider = styled.div`
    width: 100%;
    height: 1px;
    background-color: var(--gray-300);
`

export const EquipoExisteLista = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const EquipoExisteItem = styled.div`
    display: flex;
    background-color: var(--black);
    padding: 20px;
    justify-content: space-between;
`

export const EquipoExisteEscudo = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;

    img {
        width: 30px;
    }
`

export const EquipoNoExiste = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    background-color: var(--black);
    padding: 20px;
    font-size: 14px;
    p {
        width: 50%;
    }

    p span {
        font-weight: 700;
        color: var(--white);
    }
`