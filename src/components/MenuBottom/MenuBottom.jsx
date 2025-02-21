import React from 'react'
import { MenuBottomContainerStyled, MenuBottomItem, MenuBottomWrapper } from './MenuBottomStyles'
import { HiHome, HiOutlineUserGroup, HiAdjustmentsVertical, HiBars3BottomRight, HiMiniTableCells} from 'react-icons/hi2'
import { FaTrophy } from "react-icons/fa";

const MenuBottom = () => {
  return (
    <MenuBottomContainerStyled>
      <MenuBottomWrapper>
        <MenuBottomItem to={'/'}>
          <HiHome/>
          <h4>HOME</h4>
        </MenuBottomItem>

        <MenuBottomItem to={'/categorias'}>
          <FaTrophy />
          <h4>EDICIONES</h4>
        </MenuBottomItem>

        <MenuBottomItem to={'/my-team'}>
          <HiOutlineUserGroup/>
          <h4>MI EQUIPO</h4>
        </MenuBottomItem>
        
        {/* <MenuBottomItem to={'/stats'}>
          <HiAdjustmentsVertical/>
          <h4>ESTADISTICAS</h4>
        </MenuBottomItem> */}

        <MenuBottomItem to={'/noticias'}>
          <HiMiniTableCells/>
          <h4>NOTICIAS</h4>
        </MenuBottomItem>

        {/* <MenuBottomItem to={'/more'}>
          <HiBars3BottomRight/>
          <h4>MÁS</h4>
        </MenuBottomItem> */}
      </MenuBottomWrapper>
    </MenuBottomContainerStyled>
  )
}

export default MenuBottom