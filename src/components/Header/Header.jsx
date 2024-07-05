import React from 'react'
import { HeaderContainerStyled, HeaderWrapper } from './HeaderStyles'
import { HiOutlineBars3 } from "react-icons/hi2";
import Divider from '../Divider/Divider';

const Header = () => {
  return (
    <>
    <HeaderContainerStyled>
      <HeaderWrapper>
        <HiOutlineBars3 />
      </HeaderWrapper>
    </HeaderContainerStyled>
    </>
    
  )
}

export default Header