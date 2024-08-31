import React, { useEffect } from 'react'
import Aside from '../Aside/Aside'
import { Footer, LayoutAdminContainerStyled } from './LayoutStyles'
import { useLocation } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';

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
            <Footer>© 2024 Copa Relámpago. Todos los derechos reservados. Sistema en versión beta</Footer>
        </>
        
    )
}

export default Layout