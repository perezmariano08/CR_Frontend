import React, { useEffect } from 'react'
import { ContentMenuLink, ContentUserMenuTitulo } from '../../../components/Content/ContentStyles'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';

const UserCategoriasMenuNav = ({id_categoria, children}) => {
    const location = useLocation();
    const dispatch = useDispatch()
    const zonas = useSelector((state) => state.zonas.data);
    const zonasFiltradas = zonas.filter((z) => z.id_categoria == id_categoria)

    useEffect(() => {
        dispatch(fetchZonas());
    }, [dispatch]);
    
    return (
        <ContentUserMenuTitulo>
            <ContentMenuLink>
                <NavLink to={`/categoria/posiciones/${id_categoria}`}>
                    Posiciones
                </NavLink>
                <NavLink to={`/categoria/fixture/${id_categoria}`}>
                    Fixture
                </NavLink>
                <NavLink 
                    to={`/categoria/estadisticas/goleadores/${id_categoria}`}
                    className={({ isActive }) =>
                        isActive || location.pathname.startsWith(`/categoria/estadisticas`)
                            ? 'active'  // Define una clase activa
                            : ''
                    }
                >
                    Estadísticas
                </NavLink>
                {
                    zonasFiltradas.find((z) => z.tipo_zona === "eliminacion-directa") && 
                    <NavLink to={`/categoria/playoff/${id_categoria}`}>
                        PlayOff
                    </NavLink>
                }
                {children}
            </ContentMenuLink>
        </ContentUserMenuTitulo>
    )
}

export default UserCategoriasMenuNav