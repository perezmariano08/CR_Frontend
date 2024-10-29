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
import { MdOutlineWatchLater } from "react-icons/md";
import { WatchContainer, WatchFixtureContainer } from '../../../components/Stats/CardPartido/CardPartidoStyles';
import useMatchesUser from '../../../hooks/useMatchesUser';
import UserCategoriasMenuNav from './UserCategoriasMenuNav';
import { LoaderIcon } from 'react-hot-toast';

const UserCategoriasFixture = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);
    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const categoriaFiltrada = categorias.find((c) => c.id_categoria === id_categoria);
    const edicionFiltrada = ediciones.find((e) => e.id_edicion === categoriaFiltrada.id_edicion);

    const { GoToCategorias } = UseNavegador();

    const { partidos } = useMatchesUser()

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
        dispatch(fetchCategorias());
    }, [dispatch]);

    useEffect(() => {
        const jornadas = Array.from(new Set(partidos.filter(p => p.id_categoria === id_categoria).map(p => p.jornada)));
        jornadas.sort((a, b) => a - b); // Ordena las jornadas en orden ascendente
        
        // Filtrar la última jornada con ambos equipos presentes
        let jornadaSeleccionada = jornadas[jornadas.length - 1] || 1;
        
        // Verificar que todos los partidos de esta jornada tienen ambos equipos definidos
        while (jornadaSeleccionada > 1) {
            const partidosJornada = partidos.filter(p => p.jornada === jornadaSeleccionada && p.id_categoria === id_categoria);
            const jornadaCompleta = partidosJornada.every(p => p.id_equipoLocal && p.id_equipoVisita);
            
            if (jornadaCompleta) break; // Si todos los partidos tienen ambos equipos, esta es la jornada a mostrar
            jornadaSeleccionada -= 1; // Sino, intentar la jornada anterior
        }
    
        setJornadasDisponibles(jornadas);
        setJornadaActual(jornadaSeleccionada);
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
    
    const partido = partidos.find((p) => p.id_categoria === id_categoria && p.jornada === jornadaActual);
    const zonaPartido = partido ? zonas.find((z) => z.id_zona === partido.id_zona) : null;


    const traerEquiposPartidoPrevio = (id_partido) => {    
        const partido = partidos.find((p) => p.id_partido === id_partido);
        if (!partido) {
            console.error('Partido no encontrado');
            return null; 
        }
        const {id_equipoLocal, id_equipoVisita} = partido;
        const nombreLocal = nombresEquipos(id_equipoLocal);
        const nombreVisita = nombresEquipos(id_equipoVisita);
        return <p>{nombreLocal} / {nombreVisita}</p>;
    };
    
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
                        <UserCategoriasMenuNav id_categoria={id_categoria} />
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
                                                Por jornada 
                                            </NavLink>
                                        </ContentMenuLink>
                                    </ContentUserSubMenuTitulo>
                                    {
                                        loading 
                                        ? 
                                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0'}}>
                                            <LoaderIcon />
                                        </div>
                                        : 
                                        <>
                                        <ContentJornadasFixture>
                                        <JornadasFixtureWrapper>
                                            <ArrowJornadasFixture
                                                onClick={handlePreviousJornada}
                                                style={{ cursor: jornadasDisponibles.indexOf(jornadaActual) > 0 ? 'pointer' : 'not-allowed', opacity: jornadasDisponibles.indexOf(jornadaActual) > 0 ? 1 : 0.5 }}
                                            >
                                                <AiOutlineLeft />
                                            </ArrowJornadasFixture>

                                            {
                                                partido && zonaPartido ? (
                                                    zonaPartido.tipo_zona === "eliminacion-directa" ? (
                                                        <div>
                                                            <p>{zonaPartido.nombre_etapa} - {zonaPartido.nombre_zona}</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p>Fecha {jornadaActual}</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div>
                                                        <p>Fecha {jornadaActual}</p>
                                                    </div>
                                                )
                                            }

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
                                                                {
                                                                    zona.tipo_zona === "eliminacion-directa" 
                                                                    ? <p>{zona.nombre_etapa} - {zona.nombre_zona}</p>
                                                                    : <p>{zona.nombre_etapa}</p>
                                                                }
                                                                
                                                            </JornadasFixtureZona>
                                                            {partidosDeZona.map((partido) => (
                                                                <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)}>
                                                                    <JornadasFixturePartidoEquipo>
                                                                        {
                                                                            partido.id_equipoLocal ? 
                                                                                <>
                                                                                    <p className={partido.id_equipoLocal === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoLocal)}</p>                                                                                    
                                                                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />

                                                                                </>
                                                                            : 
                                                                                traerEquiposPartidoPrevio(partido.id_partido_previo_local)
                                                                        }
                                                                    </JornadasFixturePartidoEquipo>
                                                                    <JornadasFixtureResultado className={partido.estado === 'F' || partido.estado === 'S' ? '' : 'hora'}>
                                                                        {partido.estado === 'F' || partido.estado === 'S'
                                                                            ? `${partido.goles_local} - ${partido.goles_visita}`
                                                                            : partido.estado === 'A'
                                                                                ? <span style={{ fontSize: '10px', color: '#a8a8a8' }}>POSTERGADO</span>
                                                                                : formatHour(partido.hora)}
                                                                    </JornadasFixtureResultado>
                                                                    <JornadasFixturePartidoEquipo className='visita'>
                                                                        {
                                                                            partido.id_equipoVisita ? 
                                                                                <>
                                                                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                                                                                    <p className={partido.id_equipoVisita === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoVisita)}</p>
                                                                                </>
                                                                            : 
                                                                                traerEquiposPartidoPrevio(partido.id_partido_previo_visita)
                                                                        }
                                                                    </JornadasFixturePartidoEquipo>
                                                                </JornadasFixturePartido>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })
                                        ) : (
                                            partidosPorFecha[fecha].map((partido) => (
                                                <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)} className={partido.estado === 'A' ? 'suspendido' : ''}>
                                                    {
                                                        partido.estado === 'C' && (
                                                            <WatchFixtureContainer>
                                                                <WatchContainer>
                                                                    <MdOutlineWatchLater />
                                                                </WatchContainer>
                                                            </WatchFixtureContainer>
                                                        )
                                                    }

                                                    <JornadasFixturePartidoEquipo>
                                                        <p className={partido.id_equipoLocal === idMyTeam ? 'miEquipo' : ''}>{nombresEquipos(partido.id_equipoLocal)}</p>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                                                    </JornadasFixturePartidoEquipo>
                                                    <JornadasFixtureResultado className={partido.estado !== 'P' ? '' : 'hora'}>
                                                        {partido.estado !== 'P' && partido.estado !== 'A'
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
                                    }
                                    
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
