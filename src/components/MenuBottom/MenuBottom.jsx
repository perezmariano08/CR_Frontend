import React from 'react'
import { MenuBottomContainerStyled, MenuBottomItem, MenuBottomWrapper } from './MenuBottomStyles'
import { HiHome, HiOutlineUserGroup, HiAdjustmentsVertical, HiBars3BottomRight, HiMiniTableCells} from 'react-icons/hi2'
const MenuBottom = () => {
  return (
    <MenuBottomContainerStyled>
      <MenuBottomWrapper>
        <MenuBottomItem to={'/'}>
          <HiHome/>
          <h4>HOME</h4>
        </MenuBottomItem>
        <MenuBottomItem to={'/my-team'}>
          <HiOutlineUserGroup/>
          <h4>MI EQUIPO</h4>
        </MenuBottomItem>
        
        <MenuBottomItem to={'/stats'}>
          <HiAdjustmentsVertical/>
          <h4>ESTADISTICAS</h4>
        </MenuBottomItem>

        <MenuBottomItem to={'/news'}>
          <HiMiniTableCells/>
          <h4>NOTICIAS</h4>
        </MenuBottomItem>

        <MenuBottomItem to={'/more'}>
          <HiBars3BottomRight/>
          <h4>MÁS</h4>
        </MenuBottomItem>
      </MenuBottomWrapper>
    </MenuBottomContainerStyled>
  )
}

export default MenuBottom