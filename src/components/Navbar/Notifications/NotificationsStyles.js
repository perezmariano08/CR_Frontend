import { motion } from "framer-motion";
import styled from "styled-components";

export const NotificationsStyledContainer = styled(motion.div)`
    background-color: var(--gray-300);
    width: 100%;
    height: 100%;
    z-index: 1000;
    top: 0;
    right: 0;
    position: fixed;
    padding: 20px;
    overflow: hidden;
    overflow-y: auto; /* Permite el scroll interno */

    /* Estilos del scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--gray-500);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: var(--gray-400);
    }
`;

export const NotificationsWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    color: white;
    gap: 20px;   

    h3 {
        font-size: 16px;
        font-weight: 700;
    }
`;

export const NotificationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 15px;
    padding: 15px;
    background-color: var(--gray-400);
    height: auto; 
    max-height: 100vh; /* Ajusta la altura máxima para permitir scroll interno */
    overflow-y: auto; /* Permite el scroll dentro del contenedor */
`;

export const NotificationContainer = styled.div`
    display: flex;
    width: 100%;
    background-color: var(--gray-500);
    padding: 10px;
    box-sizing: border-box; /* Asegura que padding no afecte el tamaño del contenedor */
`;

export const NotificationLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--green);
    padding: 10px;

    &i, svg {
        font-size: 50px;
        color: var(--green);
    }
`;

export const NotificationRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Ajusta al inicio para que el contenido no esté centrado */
    width: calc(100% - 60px); /* Ajusta según el tamaño de NotificationLeft */
    padding-left: 10px; /* Añade espacio entre el contenido y el borde izquierdo */
`;

export const NotificationTitle = styled.div`
    border-bottom: 1px solid var(--green);
    width: 100%;
    padding: 10px;
    text-align: center;

    h4 {
        font-size: 13px;
        font-weight: 800;
    }
`;

export const NotificationText = styled.div`
    padding: 10px;
    width: 100%;
    text-align: start;

    p {
        font-size: 11px;
        font-weight: 300;
    }
`;

export const NotiTopContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: start;
    align-items: center;
    gap: 10px;
    
    &i, svg {
        color: var(--green);
        cursor: pointer;
    }
`;