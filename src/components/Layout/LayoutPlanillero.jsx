import React, { useEffect } from 'react'
import { Footer, PrivateLayoutContainerStyled } from '../Layout/LayoutStyles'
import { Navbar } from '../Navbar/Navbar'
import { useLocation } from 'react-router-dom'
import MenuBottomPlanillero from '../MenuBottom/MenuBottomPlanillero'

const PrivateLayoutPlanillero = ({children}) => {
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
        <MenuBottomPlanillero/>
        <Footer>© 2024 Copa Relámpago. Todos los derechos reservados. Sistema en versión beta</Footer>
    </>
  )
}

export default PrivateLayoutPlanillero