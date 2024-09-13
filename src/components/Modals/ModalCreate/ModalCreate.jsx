import React from 'react'
import { ModalButtons, ModalContainerStyled, ModalForm, ModalHeader } from '../ModalsStyles'
import { IoClose } from "react-icons/io5";

const ModalCreate = ({ title, buttons, form, onClickClose, initial, animate, exit, transition, texto}) => {
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
            {
                form && (
                    <ModalForm>
                        {form}
                    </ModalForm>
                )
            }
            {texto}
            <ModalButtons>
                {buttons}
            </ModalButtons>
        </ModalContainerStyled>
    )
}

export default ModalCreate