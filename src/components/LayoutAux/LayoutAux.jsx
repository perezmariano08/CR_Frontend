import React from 'react'
import { LayoutAuxContainerStyled, PrivateLayoutContainerStyled } from '../Layout/LayoutStyles'
import MenuBottom from '../MenuBottom/MenuBottom'

const LayoutAux = ({children}) => {
  return (
    <>
        <LayoutAuxContainerStyled>
            {
                children
            }
        </LayoutAuxContainerStyled>

        <MenuBottom/>
    </>

  )
}

export default LayoutAux