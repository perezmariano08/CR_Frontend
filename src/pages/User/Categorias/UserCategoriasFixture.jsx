import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import {
    ArrowJornadasFixture,
    ContentJornadasFixture, ContentMenuLink, ContentPageWrapper,
    ContentUserContainer, ContentUserMenuTitulo, ContentUserSubMenuTitulo,
    ContentUserTituloContainer, ContentUserTituloContainerStyled,
    ContentUserWrapper, GanadorPerdedorContainer, JornadasEmpty, JornadasFixtureDia, JornadasFixturePartido,
    JornadasFixturePartidoEquipo, JornadasFixtureResultado, JornadasFixtureWrapper,
    JornadasFixtureZona, ReferenciasContainer, ReferenciasItem, ReferenciasItemContainer, TituloContainer, TituloText
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
import { nombreMes } from './utils';

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
        // Obtener todas las jornadas disponibles para la categoría
        const jornadas = Array.from(new Set(partidos
            .filter(p => p.id_categoria === id_categoria) // Solo filtra por categoría
            .map(p => p.jornada)));
    
        // Si no hay jornadas, salir del efecto
        if (jornadas.length === 0) {
            setJornadasDisponibles([]);
            setJornadaActual(null);
            return;
        }
    
        // Ordena las jornadas en orden ascendente
        jornadas.sort((a, b) => a - b);
    
        // Filtrar la última jornada con ambos equipos presentes, pero no descartar jornadas sin equipos completos
        let jornadaSeleccionada = jornadas[jornadas.length - 1];
    
        // Asegurarse de que la jornada seleccionada tenga al menos un partido con ambos equipos definidos
        while (jornadaSeleccionada > 1) {
            const partidosJornada = partidos.filter(p => p.jornada === jornadaSeleccionada && p.id_categoria === id_categoria);
            
            // Si al menos un partido de esta jornada tiene ambos equipos definidos, seleccionamos esta jornada
            const jornadaCompleta = partidosJornada.some(p => p.id_equipoLocal && p.id_equipoVisita);
    
            if (jornadaCompleta) break; // Si encontramos al menos un partido completo, tomamos esta jornada
            jornadaSeleccionada -= 1; // Sino, intentar la jornada anterior
        }
    
        // Mostrar las jornadas disponibles
        setJornadasDisponibles(jornadas);
    
        // Establecer la jornada seleccionada
        setJornadaActual(jornadaSeleccionada);
    }, [partidos, id_categoria]);    
    
    const partidosCategoria = partidos
    .filter((p) => p.id_categoria == categoriaFiltrada.id_categoria && p.jornada == jornadaActual)
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

    const traerEquiposPartidoPrevio = (id_partido_previo, resultado) => {
        const partido_previo = partidos.find((p) => p.id_partido === id_partido_previo);
    
        if (!partido_previo) {
            console.error('Partido previo no encontrado');
            return <p>Equipo a confirmar</p>; 
        }
    
        const { id_equipoLocal, id_equipoVisita, vacante_local, vacante_visita, id_zona } = partido_previo;
        
        // Determina si el equipo está definido
        const equipoDefinido = id_equipoLocal && id_equipoVisita;
        
        // Determina si debe mostrar "Ganador" o "Perdedor"
        const equipoPlaceholder = resultado === 'G' ? 'Ganador' : 'Perdedor';
        const color = resultado === 'G' ? 'var(--green)' : 'var(--red)';
        
        if (!equipoDefinido) {
            // Calcular el número de partido de la fase previa basándose en las vacantes
            // Ajustamos el número del partido para comenzar desde 1
            const vacantes = [vacante_local, vacante_visita];
            const numeroPartido = Math.max(...vacantes) % 2 === 0 ? Math.max(...vacantes) / 2 : Math.floor(Math.max(...vacantes) / 2) + 1;
    
            const zona = zonas.find((z) => z.id_zona === id_zona);
            const zonaNombre = zona ? `${zona.nombre_etapa} - ${zona.nombre_zona}` : 'Zona desconocida';
    
            return (
                <GanadorPerdedorContainer color={color}>
                    <p>
                        {equipoPlaceholder} de {zonaNombre}, Partido {numeroPartido}
                    </p>
                </GanadorPerdedorContainer>
            );
        }
        
        // Si el equipo está definido, muestra los nombres de los equipos
        const nombreLocal = nombresEquipos(id_equipoLocal);
        const nombreVisita = nombresEquipos(id_equipoVisita);
    
        return (
            <GanadorPerdedorContainer color={color}>
                <p>{equipoPlaceholder}</p>
                <span>{nombreLocal} / {nombreVisita}</span>
            </GanadorPerdedorContainer>
        );
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
                                                    (zonaPartido.tipo_zona === "eliminacion-directa" || zonaPartido.tipo_zona === "eliminacion-directa-ida-vuelta") ? (
                                                        <div>
                                                            <p>PlayOff - Fase {zonaPartido.fase}</p>
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
                                            <JornadasFixtureDia>
                                                <p>{fecha === 'null, 0 de undefined de 0' ? 'Fecha a confirmar' : fecha}</p>
                                            </JornadasFixtureDia>
                                            {zonasFiltradas.length > 1 ? (
                                            zonasFiltradas.map((zona) => {
                                                const partidosDeZona = partidosPorFecha[fecha].filter(p => p.id_zona === zona.id_zona);
                                                
                                                // Solo renderizamos si la zona tiene partidos
                                                if (partidosDeZona.length > 0) {
                                                    return (
                                                        <React.Fragment key={zona.id_zona}>
                                                            <JornadasFixtureZona>
                                                            {
                                                                (zona.tipo_zona === "eliminacion-directa" || zona.tipo_zona === "eliminacion-directa-ida-vuelta")
                                                                ? (
                                                                    <p>
                                                                        {zona.nombre_etapa} - {zona.nombre_zona} 
                                                                        {zona.tipo_zona === "eliminacion-directa-ida-vuelta" && <span> - Ida y Vuelta</span>}
                                                                    </p>
                                                                )
                                                                : <p>{zona.nombre_etapa}</p>
                                                            }
                                                            </JornadasFixtureZona>
                                                            {partidosDeZona.map((partido) => (
                                                                <JornadasFixturePartido key={partido.id_partido} onClick={() => handleStatsOfTheMatch(partido.id_partido)}>
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
                                                                        {
                                                                            partido.id_equipoLocal ? 
                                                                                <>
                                                                                    <p className={partido.id_equipoLocal === partido.ventaja_deportiva ? 'ventaja' : ''}>{nombresEquipos(partido.id_equipoLocal)}</p>                                                                                    
                                                                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                                                                                </>
                                                                            : 
                                                                                traerEquiposPartidoPrevio(partido.id_partido_previo_local, partido.res_partido_previo_local)

                                                                        }
                                                                    </JornadasFixturePartidoEquipo>
                                                                    <JornadasFixtureResultado className={partido.estado !== 'P' ? '' : 'hora'}>
                                                                        {partido.estado !== 'P' && partido.estado !== 'A'
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
                                                                                    <p className={partido.id_equipoVisita === partido.ventaja_deportiva ? 'ventaja' : ''}>{nombresEquipos(partido.id_equipoVisita)}</p>
                                                                                </>
                                                                            : 
                                                                                traerEquiposPartidoPrevio(partido.id_partido_previo_visita, partido.res_partido_previo_visita)
                                                                        }
                                                                        {
                                                                            partido.interzonal === 'S' && (
                                                                                <p className='interzonal'>*</p>
                                                                            )
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
                                                        <p className={partido.id_equipoVisita === partido.ventaja_deportiva ? 'ventaja' : ''}>{nombresEquipos(partido.id_equipoLocal)}</p>
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
                                                        <p className={partido.id_equipoVisita === partido.ventaja_deportiva ? 'ventaja' : ''}>{nombresEquipos(partido.id_equipoVisita)}</p>
                                                        {
                                                            partido.interzonal === 'S' && (
                                                                <p className='interzonal'>*</p>
                                                            )
                                                        }
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
                    <ReferenciasContainer>
                        <h4>Referencias</h4>
                        <ReferenciasItemContainer>
                            <ReferenciasItem>
                                <span></span>
                                <p>Ventaja deportiva</p>
                            </ReferenciasItem>
                            <ReferenciasItem>
                                <span className='interzonal'></span>
                                <p>Partido interzonal (*)</p>
                            </ReferenciasItem>
                        </ReferenciasItemContainer>
                    </ReferenciasContainer>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
    
};

export default UserCategoriasFixture;
