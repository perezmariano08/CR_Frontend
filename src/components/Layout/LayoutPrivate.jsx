import React, { useEffect } from 'react'
import { PrivateLayoutContainerStyled } from '../Layout/LayoutStyles'
import { Navbar } from '../Navbar/Navbar'
import MenuBottom from '../MenuBottom/MenuBottom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../Auth/AuthContext'
import MenuBottomPlanillero from '../MenuBottom/MenuBottomPlanillero'
import { NavbarPlanillero } from '../Navbar/NavbarPlanillero'
import Footer from '../Footer/Footer'

const PrivateLayout = ({children}) => {
  const { pathname } = useLocation();
  const {userRole} = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>  
      {
        userRole === 2 ? (
          <NavbarPlanillero/>
        ) : (
          <Navbar/>
        )
      }
        <PrivateLayoutContainerStyled>
            {
                children
            }
        </PrivateLayoutContainerStyled>
        {
          userRole === 2 ? (
            <MenuBottomPlanillero/>
          ) : (
            <MenuBottom/>
          )
        }
        <Footer/>
    </>
  )
}

export default PrivateLayout