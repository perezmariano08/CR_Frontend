import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import {
    ContentMenuLink, ContentPageWrapper,
    ContentUserContainer, ContentUserMenuTitulo, ContentUserSubMenuTitulo,
    ContentUserTituloContainer, ContentUserTituloContainerStyled,
    ContentUserWrapper, TituloContainer, TituloText
} from '../../../components/Content/ContentStyles';
import useGetStatsHandler from '../../../hooks/useGetStatsHandler';
import { URLImages } from '../../../utils/utils';
import { DataTable } from 'primereact/datatable';
import TablaEstadisticas from '../../../components/TablaEstadisticas/TablaEstadisticas';
import { JugadorBodyTemplate } from '../../../components/TablaEstadisticas/TablaEstadisticasStyles';
import { LoaderIcon } from 'react-hot-toast';
import { LiaFutbol } from 'react-icons/lia';

const UserCategoriasGoleadores = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);
    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);

    const categoriaFiltrada = categorias.find((c) => c.id_categoria === id_categoria);
    const edicionFiltrada = ediciones.find((e) => e.id_edicion === categoriaFiltrada.id_edicion);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchCategorias());
    }, [dispatch]);

    const { estadisticaZona, getEstadisticasZonaHandler } = useGetStatsHandler(categoriaFiltrada.id_categoria, 'Goleadores');
    
    useEffect(() => {
        if (categoriaFiltrada) {
            getEstadisticasZonaHandler().finally(() => setLoading(false)); // Ocultar el loader una vez que se obtienen las estadísticas
        }
    }, [categoriaFiltrada, getEstadisticasZonaHandler]);

    const DataColumnsGoleadores = [
        {
            field: 'nombre_completo', header: "jugador"
        },
        {
            field: 'G', 
            header: 'Goles'
        }
        
    ]

    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                    <ContentUserTituloContainerStyled>
                        <ContentUserTituloContainer>
                            <TituloContainer>
                                <img src={`${URLImages}/uploads/CR/logo-clausura-2024.png`}/>
                                <TituloText>
                                    <h1>{categoriaFiltrada?.nombre}</h1>
                                    <p>{`${edicionFiltrada?.nombre} ${edicionFiltrada?.temporada}`}</p>
                                </TituloText>
                            </TituloContainer>
                        </ContentUserTituloContainer>
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
                            >
                                Estadísticas
                            </NavLink>
                            </ContentMenuLink>
                        </ContentUserMenuTitulo>
                    </ContentUserTituloContainerStyled>
                    <ContentPageWrapper>
                    <ContentUserSubMenuTitulo>
                        <ContentMenuLink>
                            <NavLink to={`/categoria/estadisticas/goleadores/${id_categoria}`}>
                                Goleadores
                            </NavLink>
                            <NavLink to={`/categoria/estadisticas/asistentes/${id_categoria}`}>
                                Asistencias
                            </NavLink>
                            <NavLink to={`/categoria/estadisticas/expulsados/${id_categoria}`}>
                                Expulsados
                            </NavLink>
                        </ContentMenuLink>
                    </ContentUserSubMenuTitulo>
                    {loading ? (
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0'}}>
                            <LoaderIcon />
                        </div>
                        
                    ) : (
                        <TablaEstadisticas
                            data={estadisticaZona}
                            dataColumns={DataColumnsGoleadores}
                        />
                    )}
                    </ContentPageWrapper>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
};

export default UserCategoriasGoleadores;
