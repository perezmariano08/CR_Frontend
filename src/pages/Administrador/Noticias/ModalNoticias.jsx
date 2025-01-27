import React from 'react'
import { ModalButtons, ModalContainerStyled, ModalForm, ModalHeader } from './ModalNoticiasStyles'
import { IoClose } from "react-icons/io5";

const ModalNoticias = ({ closeModal, buttons,title, form, initial, animate, exit, transition }) => {
  return (
    <ModalContainerStyled
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
    >
        <ModalHeader>
            {title}
            <IoClose onClick={closeModal}/>
        </ModalHeader>
        {
            form && (
                <ModalForm>
                    {form}
                </ModalForm>
            )
        }
        <ModalButtons>
            {
                buttons
            }
        </ModalButtons>
    </ModalContainerStyled>
  )
}

export default ModalNoticias