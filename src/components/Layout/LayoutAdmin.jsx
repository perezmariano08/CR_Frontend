import React, { useEffect } from 'react'
import Aside from '../Aside/Aside'
import { LayoutAdminContainerStyled } from './LayoutStyles'
import { useLocation } from 'react-router-dom';

const Layout = ({children, className}) => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <>
            <Aside className={className}/>
            <LayoutAdminContainerStyled>
                {children}
            </LayoutAdminContainerStyled>
        </>
        
    )
}

export default Layout