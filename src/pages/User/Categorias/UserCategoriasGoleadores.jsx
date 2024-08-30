import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import {
    ContentJornadasFixture, ContentMenuLink, ContentPageWrapper,
    ContentUserContainer, ContentUserMenuTitulo, ContentUserSubMenuTitulo,
    ContentUserTituloContainer, ContentUserTituloContainerStyled,
    ContentUserWrapper, JornadasFixtureDia, JornadasFixturePartido,
    JornadasFixturePartidoEquipo, JornadasFixtureResultado, JornadasFixtureWrapper,
    JornadasFixtureZona, TituloContainer, TituloText
} from '../../../components/Content/ContentStyles';
import useGetStatsHandler from '../../../hooks/useGetStatsHandler';

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
            getEstadisticasZonaHandler();
        }
    }, []);

    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                    <ContentUserTituloContainerStyled>
                        <ContentUserTituloContainer>
                            <TituloContainer>
                                <img src="https:/coparelampago.com/uploads/CR/logo-clausura-2024.png" alt="" />
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
                    </ContentPageWrapper>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
};

export default UserCategoriasGoleadores;
