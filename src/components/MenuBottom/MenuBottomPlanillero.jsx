import React from 'react'
import { MenuBottomContainerStyled, MenuBottomItem, MenuBottomWrapper } from './MenuBottomStyles'
import { HiHome, HiBars3BottomRight, HiAdjustmentsVertical} from 'react-icons/hi2'
import { FaTrophy } from "react-icons/fa";

const MenuBottomPlanillero = () => {
  return (
    <MenuBottomContainerStyled>
      <MenuBottomWrapper>
        <MenuBottomItem to={'/planillero'} end>
          <HiHome/>
          <h4>HOME</h4>
        </MenuBottomItem>

        <MenuBottomItem to={'/planillero/categorias'}>
          <FaTrophy/>
          <h4>CATEGORÍAS</h4>
        </MenuBottomItem>

        {/* <MenuBottomItem to={'/planiller/more'}>
          <HiBars3BottomRight/>
          <h4>MÁS</h4>
        </MenuBottomItem> */}

      </MenuBottomWrapper>
    </MenuBottomContainerStyled>
  )
}

export default MenuBottomPlanillero