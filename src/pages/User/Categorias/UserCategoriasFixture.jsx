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
import { HiArrowLeft } from "react-icons/hi";
import UseNavegador from './UseNavegador';

const UserCategoriasFixture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);
    const partidos = useSelector((state) => state.partidos.data);
    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const categoriaFiltrada = categorias.find((c) => c.id_categoria === id_categoria);
    const edicionFiltrada = ediciones.find((e) => e.id_edicion === categoriaFiltrada.id_edicion);

    const { GoToCategorias } = UseNavegador();


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
        jornadas.sort((a, b) => a - b); // Ordena las jornadas en orden ascendente
        setJornadasDisponibles(jornadas);
        setJornadaActual(jornadas[jornadas.length - 1] || 1); // Establece la última jornada disponible como predeterminada
    }, [partidos, id_categoria]);
    
    const partidosCategoria = partidos
    .filter((p) => p.id_categoria === categoriaFiltrada.id_categoria && p.jornada === jornadaActual)
    .sort((a, b) => a.hora.localeCompare(b.hora)); // Ordena por hora de menor a mayor

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

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio", 
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    
    const nombreMes = (numeroMes) => {
    return meses[numeroMes - 1]; 
    };

    const partidosPorFecha = partidosCategoria.reduce((acc, partido) => {
        const fechaPartido = `${partido.dia_nombre}, ${partido.dia_numero} de ${nombreMes(partido.mes)} de ${partido.año}`;
        if (!acc[fechaPartido]) {
            acc[fechaPartido] = [];
        }
        acc[fechaPartido].push(partido);
        return acc;
    }, {});
    
    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                    <ContentUserTituloContainerStyled>
                        <ContentUserTituloContainer>
                            <TituloContainer>
                                <HiArrowLeft onClick={() => GoToCategorias('/categorias')} />
                                <img src={`${URLImages}/uploads/CR/logo-clausura-2024.png`} />
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
                            ) : (
                                <>
                                    <ContentUserSubMenuTitulo>
                                        <ContentMenuLink>
                                            <NavLink to={`/categoria/fixture/${id_categoria}`}>
                                                Liguilla
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
    
                                    {Object.keys(partidosPorFecha).map((fecha, index) => (
                                        <React.Fragment key={index}>
                                            <JornadasFixtureDia>{fecha}</JornadasFixtureDia>
                                            {zonasFiltradas.length > 1 ? (
                                            zonasFiltradas.map((zona) => {
                                                const partidosDeZona = partidosPorFecha[fecha].filter(p => p.id_zona === zona.id_zona);
                                                
                                                // Solo renderizamos si la zona tiene partidos
                                                if (partidosDeZona.length > 0) {
                                                    return (
                                                        <React.Fragment key={zona.id_zona}>
                                                            <JornadasFixtureZona>
                                                                {zona.nombre_zona}
                                                            </JornadasFixtureZona>
                                                            {partidosDeZona.map((partido) => (
                                                                <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)}>
                                                                    <JornadasFixturePartidoEquipo>
                                                                    <p className={partido.id_equipoLocal === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoLocal)}</p>
                                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                                                                    </JornadasFixturePartidoEquipo>
                                                                    <JornadasFixtureResultado className={partido.estado === 'F' || partido.estado === 'S' ? '' : 'hora'}>
                                                                        {partido.estado === 'F' || partido.estado === 'S'
                                                                            ? `${partido.goles_local} - ${partido.goles_visita}`
                                                                            : partido.estado === 'A'
                                                                                ? <span style={{ fontSize: '10px', color: '#a8a8a8' }}>POSTERGADO</span>
                                                                                : formatHour(partido.hora)}
                                                                    </JornadasFixtureResultado>
                                                                    <JornadasFixturePartidoEquipo className='visita'>
                                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                                                                        <p className={partido.id_equipoVisita === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoVisita)}</p>
                                                                    </JornadasFixturePartidoEquipo>
                                                                </JornadasFixturePartido>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                } else {
                                                    return null; // Si no hay partidos en esa zona, no renderizamos nada
                                                }
                                            })
                                        ) : (
                                            partidosPorFecha[fecha].map((partido) => (
                                                <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)} className={partido.estado === 'A' ? 'suspendido' : ''}>
                                                    <JornadasFixturePartidoEquipo>
                                                        <p className={partido.id_equipoLocal === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoLocal)}</p>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                                                    </JornadasFixturePartidoEquipo>
                                                    <JornadasFixtureResultado className={partido.estado === 'F' || partido.estado === 'S' ? '' : 'hora'}>
                                                        {partido.estado === 'F' || partido.estado === 'S'
                                                            ? `${partido.goles_local} - ${partido.goles_visita}`
                                                            : partido.estado === 'A'
                                                                ? <span style={{ fontSize: '10px', color: '#a8a8a8' }}>POSTERGADO</span>
                                                                : formatHour(partido.hora)}
                                                    </JornadasFixtureResultado>
                                                    <JornadasFixturePartidoEquipo className='visita'>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                                                        <p className={partido.id_equipoVisita === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoVisita)}</p>
                                                    </JornadasFixturePartidoEquipo>
                                                </JornadasFixturePartido>
                                            ))
                                        )}
                                        </React.Fragment>
                                    ))}
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
