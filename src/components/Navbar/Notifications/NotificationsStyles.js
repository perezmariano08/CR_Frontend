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
    overflow-y: scroll;

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
    max-height: 100%;
    height: 100vh;
    overflow-y: auto;
`;

export const NotificationContainer = styled.div`
    display: flex;
    width: 100%;
    background-color: var(--gray-500);
`;

export const NotificationLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--green);
    padding: 10px;

    &i,svg {
        font-size: 50px;
        color: var(--green);
    }
`;

export const NotificationRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
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
    

    &i,svg {
        color: var(--green);
        cursor: pointer;
    }
`