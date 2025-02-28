import styled from "styled-components";

export const SelectContainerStyled = styled.div`
    display: flex;
    align-items: center;
    background-color: var(--gray-300);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    gap: 5px;
    position: relative;
    cursor: pointer;
    .arrow {
        position: absolute;
        right: 12px;
        color: var(--gray-100);
    }

    .icon-select {
        position: absolute;
        left: 12px;
        color: var(--gray-100);
    }

    select:focus ~ .icon-select {
        color: var(--green);
    }

    &.planilla {
        width: 60%;
    }
`
export const SelectWrapper = styled.select`
    border-radius: 10px;
    width: 100%;
    background-color: transparent;
    color: var(--gray-100);
    height: 100%;
    padding: 10px 10px 10px 36px;
    border: none;
    outline: none;
    appearance: none; /* Oculta el estilo por defecto del select */
    -webkit-appearance: none; /* Para navegadores WebKit */
    -moz-appearance: none; /* Para navegadores Mozilla */
    z-index: 2;
    cursor: pointer;
    &:focus {
        outline: 0 none;
        outline-offset: 0;
        box-shadow: 0 0 0 1px var(--green);
        border-color: var(--green);
    }

    &:focus + .icon-select {
        color: var(--green); /* Cambia el color del ícono al estar en foco */
    }

    &:disabled {
        color: var(--gray-200);
        background-color: var(--gray-500);
        cursor: not-allowed;
        transition: all .2s ease-in-out;
    }

    option {
        background-color: var(--gray-500);
        color: var(--white);
        cursor: pointer;
        border: none;
        &:disabled {
            display: none;
        }
        &:hover {
            background-color: red
        }
    }
`

// SELECT NUEVO
export const SelectContainer = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
`;

export const Selected = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #1e1e1e;
    color: #fff;
    cursor: pointer;
    border-radius: 20px;
    padding: 16px 24px;
`;

export const Logo = styled.img`
    width: 20px;
    margin-right: 8px;
    border-radius: 50%;
`;

export const OptionsList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #1e1e1e;
    margin: 5px 0;
    padding: 0;
    list-style: none;
    max-height: 350px;
    overflow-y: auto;
    border-radius: 10px;
    z-index: 10;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")}; /* Cambia isOpen a $isOpen */    

    /* Estilos personalizados para la barra de desplazamiento */
    &::-webkit-scrollbar {
        width: 8px; /* Ancho de la barra */
    }

    &::-webkit-scrollbar-track {
        background: #2a2a2a; /* Color del fondo del track */
        border-radius: 10px; /* Bordes redondeados */
    }

    &::-webkit-scrollbar-thumb {
        background: #555; /* Color del "thumb" */
        border-radius: 10px; /* Bordes redondeados */
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #777; /* Color del "thumb" al pasar el mouse */
    }

    /* Compatibilidad con Firefox */
    scrollbar-width: thin; /* Ancho del scrollbar */
    scrollbar-color: #555 #2a2a2a; /* thumb color y track background */
`;


export const Option = styled.li`
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 16px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #333;
    }

    img {
        width: 16px;
    }

    &.active {
        background-color: #333;
        color: var(--green);
    }
`;

export const Arrow = styled.span`
    margin-left: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")}; /* Cambia isOpen a $isOpen */
    transition: transform 0.3s;
`;


export const SelectVistaPartidoWrapper = styled.div`
    position: relative;
    padding: 16px 24px;
    user-select: none;
`;

export const SelectVistaPartidoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    height: fit-content;
`;

export const SelectVistaPartidoIcon = styled.span`
    margin-left: 10px;
    display: flex;
    align-items: center;
`;

export const SelectVistaPartidoOptions = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--black-800);
    border-radius: 10px;
    overflow: hidden;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)}; // Cambio de visibilidad con opacidad
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')}; // Para ocultar el contenido cuando está cerrado
    pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')}; // Desactivar interacción cuando está cerrado
    z-index: 10;
`;

export const SelectVistaPartidoOption = styled.div`
    padding: 10px;
    cursor: pointer;

    &:hover {
        background-color: var(--black-700);
    }
`;