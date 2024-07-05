import React, { useEffect } from 'react'
import { PrivateLayoutContainerStyled } from '../Layout/LayoutStyles'
import { Navbar } from '../Navbar/Navbar'
import MenuBottom from '../MenuBottom/MenuBottom'
import { useLocation } from 'react-router-dom'

const PrivateLayout = ({children}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
        <Navbar/>
        <PrivateLayoutContainerStyled>
            {
                children
            }
        </PrivateLayoutContainerStyled>
        <MenuBottom/>
    </>
  )
}

export default PrivateLayout