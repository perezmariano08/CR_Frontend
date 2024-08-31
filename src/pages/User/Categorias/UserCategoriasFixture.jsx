import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import {
    ArrowJornadasFixture,
    ContentJornadasFixture, ContentMenuLink, ContentPageWrapper,
    ContentUserContainer, ContentUserMenuTitulo, ContentUserSubMenuTitulo,
    ContentUserTituloContainer, ContentUserTituloContainerStyled,
    ContentUserWrapper, JornadasEmpty, JornadasFixtureDia, JornadasFixturePartido,
    JornadasFixturePartidoEquipo, JornadasFixtureResultado, JornadasFixtureWrapper,
    JornadasFixtureZona, TituloContainer, TituloText
} from '../../../components/Content/ContentStyles';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { getZonas } from '../../../utils/dataFetchers';
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';

const UserCategoriasFixture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);
    const partidos = useSelector((state) => state.partidos.data);
    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);

    const categoriaFiltrada = categorias.find((c) => c.id_categoria === id_categoria);
    const edicionFiltrada = ediciones.find((e) => e.id_edicion === categoriaFiltrada.id_edicion);

    const [zonas, setZonas] = useState([]);
    const [jornadasDisponibles, setJornadasDisponibles] = useState([]);
    const [jornadaActual, setJornadaActual] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchZonas = async () => {
            setLoading(true);
            try {
                const data = await getZonas();
                setZonas(data);
            } catch (error) {
                console.error('Error en la petición', error);
            } finally {
                setLoading(false);
            }
        };
        fetchZonas();
    }, []);

    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchPartidos());
        dispatch(fetchCategorias());
    }, [dispatch]);

    useEffect(() => {
        const jornadas = Array.from(new Set(partidos.filter(p => p.id_categoria === id_categoria).map(p => p.jornada)));
        setJornadasDisponibles(jornadas);
        setJornadaActual(jornadas[0] || 1); // Set the first available jornada as default
    }, [partidos, id_categoria]);

    const partidosCategoria = partidos.filter((p) => p.id_categoria === categoriaFiltrada.id_categoria && p.jornada === jornadaActual);

    const { escudosEquipos, nombresEquipos } = useEquipos();

    const zonasFiltradas = zonas.filter(zona => zona.id_categoria === id_categoria);

    const handlePreviousJornada = () => {
        const currentIndex = jornadasDisponibles.indexOf(jornadaActual);
        if (currentIndex > 0) {
            setJornadaActual(jornadasDisponibles[currentIndex - 1]);
        }
    };

    const handleNextJornada = () => {
        const currentIndex = jornadasDisponibles.indexOf(jornadaActual);
        if (currentIndex < jornadasDisponibles.length - 1) {
            setJornadaActual(jornadasDisponibles[currentIndex + 1]);
        }
    };

    const formatHour = (hora) => {
        if (!hora || !hora.includes(':')) return 'Hora inválida';
        const [horaParte, minutoParte] = hora.split(':');
        return `${horaParte}:${minutoParte}`;
    };

    const handleStatsOfTheMatch = (id) => {
        navigate(`/stats-match?id=${id}`);
    };

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
                                <NavLink to={`/categoria/estadisticas/goleadores/${id_categoria}`}>
                                    Estadísticas
                                </NavLink>
                            </ContentMenuLink>
                        </ContentUserMenuTitulo>
                    </ContentUserTituloContainerStyled>
                    <ContentPageWrapper>
                        {
                            partidosCategoria.length === 0 ? (
                                <JornadasEmpty>No se encontraron partidos</JornadasEmpty>
                            )
                            : (
                                <>
                                    <ContentUserSubMenuTitulo>
                            <ContentMenuLink>
                                <NavLink to={`/categoria/fixture/${id_categoria}`}>
                                    Liguilla
                                </NavLink>
                                <NavLink to={'/'}>
                                    Fase 2
                                </NavLink>
                            </ContentMenuLink>
                        </ContentUserSubMenuTitulo>
                        <ContentJornadasFixture>
                            
                            <JornadasFixtureWrapper>
                                <ArrowJornadasFixture
                                    onClick={handlePreviousJornada}
                                    style={{ cursor: jornadasDisponibles.indexOf(jornadaActual) > 0 ? 'pointer' : 'not-allowed', opacity: jornadasDisponibles.indexOf(jornadaActual) > 0 ? 1 : 0.5 }}
                                >
                                    <AiOutlineLeft />
                                </ArrowJornadasFixture>
                                
                                Fecha {jornadaActual}
                                <ArrowJornadasFixture
                                    onClick={handleNextJornada}
                                    style={{ cursor: jornadasDisponibles.indexOf(jornadaActual) < jornadasDisponibles.length - 1 ? 'pointer' : 'not-allowed', opacity: jornadasDisponibles.indexOf(jornadaActual) < jornadasDisponibles.length - 1 ? 1 : 0.5 }}
                                >
                                    <AiOutlineRight />
                                </ArrowJornadasFixture>
                            </JornadasFixtureWrapper>
                        </ContentJornadasFixture>

                        {partidosCategoria.length !== 0 && (
                            <JornadasFixtureDia>
                                {partidosCategoria[0]?.dia_nombre}, {partidosCategoria[0]?.dia_numero} de {partidosCategoria[0]?.mes} de {partidosCategoria[0]?.año}
                            </JornadasFixtureDia>
                        )}

                        {partidosCategoria.length === 0 ? (
                            <p style={{ textAlign: 'center' }}>No hay partidos disponibles para esta jornada.</p>
                        ) : (
                            zonasFiltradas.length > 1 ? (
                                zonasFiltradas.map((zona) => (
                                    <React.Fragment key={zona.id_zona}>
                                        <JornadasFixtureZona>
                                            {zona.nombre_zona}
                                        </JornadasFixtureZona>
                                        {partidosCategoria.filter(p => p.id_zona === zona.id_zona).map((partido) => (
                                            <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)}>
                                                <JornadasFixturePartidoEquipo>
                                                    {nombresEquipos(partido.id_equipoLocal)}
                                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                                                </JornadasFixturePartidoEquipo>
                                                <JornadasFixtureResultado className={partido.estado === 'F' ? '' : 'hora'}>
                                                    {partido.estado === 'F'
                                                    ? `${partido.goles_local} - ${partido.goles_visita}`
                                                    : partido.estado === 'S'
                                                        ? <span style={{ fontSize: '10px', color:'#a8a8a8' }}>POSTERGADO</span>
                                                        : formatHour(partido.hora)}
                                                </JornadasFixtureResultado>
                                                <JornadasFixturePartidoEquipo className='visita'>
                                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                                                    {nombresEquipos(partido.id_equipoVisita)}
                                                </JornadasFixturePartidoEquipo>
                                            </JornadasFixturePartido>
                                        ))}
                                    </React.Fragment>
                                ))
                            ) : (
                                partidosCategoria.map((partido) => (
                                    <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)} className={partido.estado === 'S' ? 'suspendido' : ''}>
                                        <JornadasFixturePartidoEquipo>
                                            {nombresEquipos(partido.id_equipoLocal)}
                                            <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                                        </JornadasFixturePartidoEquipo>
                                        <JornadasFixtureResultado className={partido.estado === 'F' ? '' : 'hora'}>
                                            {partido.estado === 'F'
                                                ? `${partido.goles_local} - ${partido.goles_visita}`
                                                : partido.estado === 'S'
                                                    ? <span style={{ fontSize: '10px', color:'#a8a8a8' }}>POSTERGADO</span>
                                                    : formatHour(partido.hora)}
                                        </JornadasFixtureResultado>
                                        <JornadasFixturePartidoEquipo className='visita'>
                                            <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                                            {nombresEquipos(partido.id_equipoVisita)}
                                        </JornadasFixturePartidoEquipo>
                                    </JornadasFixturePartido>
                                ))
                            )
                        )}
                                </>
                            )
                        }  
                        
                    </ContentPageWrapper>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
};

export default UserCategoriasFixture;
