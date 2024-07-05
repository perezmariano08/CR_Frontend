import React from 'react'
import { ModalButtons, ModalContainerStyled, ModalMessage, ModalHeader } from '../ModalsStyles'
import { IoClose } from "react-icons/io5";
import { GoAlert } from "react-icons/go";

const ModalDelete = ({ buttons, message, onClickClose, initial, animate, exit, transition }) => {
    return (
        <ModalContainerStyled
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
        >
            <ModalHeader>
                <p>Confirmar</p>
                <IoClose onClick={onClickClose}/>
            </ModalHeader>
            <ModalMessage>
                <GoAlert/>
                ¿Estas seguro que deseas eliminar { message } seleccionadas?
            </ModalMessage>
            <ModalButtons>
                {buttons}
            </ModalButtons>
        </ModalContainerStyled>
    )
}

export default ModalDelete