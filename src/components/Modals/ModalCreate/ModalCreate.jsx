import React from 'react'
import { ModalButtons, ModalContainerStyled, ModalForm, ModalHeader } from '../ModalsStyles'
import { IoClose } from "react-icons/io5";

const ModalCreate = ({ title, buttons, form, onClickClose, initial, animate, exit, transition}) => {
    return (
        <ModalContainerStyled
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
        >
            <ModalHeader>
                <p>{title}</p>
                <IoClose onClick={onClickClose}/>
            </ModalHeader>
            <ModalForm>
                {form}
            </ModalForm>
            <ModalButtons>
                {buttons}
            </ModalButtons>
        </ModalContainerStyled>
    )
}

export default ModalCreate