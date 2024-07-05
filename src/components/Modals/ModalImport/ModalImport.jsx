import React from 'react';
import { ModalButtons, ModalContainerStyled, ModalHeader } from '../ModalsStyles';
import { IoClose } from "react-icons/io5";

const ModalImport = ({ title, buttons, onClickClose, initial, animate, exit, transition, fileName }) => {
    return (
        <ModalContainerStyled
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
        >
            <ModalHeader>
                <p>{title}</p>
                <IoClose onClick={onClickClose} />
            </ModalHeader>
            <p>Antes de cargar tus archivos a continuación, asegúrate de que tu archivo sea listo para importarse.</p>
            {fileName && <p>Archivo seleccionado: {fileName}</p>}
            <ModalButtons>
                {buttons}
            </ModalButtons>
        </ModalContainerStyled>
    );
}

export default ModalImport;
