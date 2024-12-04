import React, { useEffect, useMemo, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper, HomeMediumWrapper, HomeLeftWrapper, HomeRightWrapper, CircleLive, CategoriasListaWrapper, CategoriasListaTitulo, CategoriasItem, CategoriasItemsWrapper, SectionHome, SectionHomeTitle, CardPartidosDia, CardPartidosDiaTitle, PartidosDiaFiltrosWrapper, PartidosDiaFiltro } from './HomeStyles';
import Section from '../../components/Section/Section';
import { useDispatch, useSelector } from 'react-redux';
import { getPosicionesTemporada, getSanciones, getZonas, traerNovedades } from '../../utils/dataFetchers';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { dataPosicionesTemporadaColumns, dataPosicionesTemporadaColumnsMinus, dataSancionesColumns } from '../../components/Stats/Data/Data';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import { StatsNull } from '../Stats/StatsStyles.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import { fetchCategorias } from '../../redux/ServicesApi/categoriasSlice.js';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice.js';
import { fetchEdiciones } from '../../redux/ServicesApi/edicionesSlice.js';
import TableSanciones from '../../components/Stats/TableSanciones/TableSanciones.jsx';
import { MenuCategoriasContainer, MenuCategoriasDivider, MenuCategoriasItem, MenuCategoriasTitulo } from '../../components/Content/ContentStyles.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { URLImages } from '../../utils/utils.js';
import DreamteamUser from '../User/Dreamteam/DreamteamUser.jsx';
import { Carousel } from 'primereact/carousel';
import TablaPosicionesRoutes from '../../components/Stats/TablePosiciones/TablaPosicionesRoutes';
import CardPartidoGenerico from '../../components/CardsPartidos/CardPartidoGenerico/CardPartidoGenerico.jsx';
import { fetchPartidos } from '../../redux/ServicesApi/partidosSlice.js';
import { PartidosGenericosContainer } from '../../components/CardsPartidos/CardPartidoGenerico/CardPartidosGenericoStyles.js';
import CardProximoPartido from '../../components/CardsPartidos/CardProximoPartido/CardProximoPartido.jsx';
import CardUltimoPartido from '../../components/CardsPartidos/CardUltimoPartido/CardUltimoPartido.jsx';
import { Skeleton } from 'primereact/skeleton';
import { TablePosicionesSkeletonWrapper } from '../../components/Stats/TablePosiciones/TablePosicionesStyles.js';
import { JugadorSancionadoBodyTemplate, JugadorSancionadoNumeroFechas } from '../../components/Stats/Table/TableStyles.js';
import { useEquipos } from '../../hooks/useEquipos.js';
import { GiDivert } from 'react-icons/gi';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice.js';

const Home = () => {
    // Fecha actual
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato "YYYY-MM-DD"

    // Estado Filtro
    const [filtroActivo, setFiltroActivo] = useState("default"); // "default", "por_horario", "en_juego"

    const [loading, setLoading] = useState(true);
    const { escudosEquipos, nombresEquipos } = useEquipos();

    const dispatch = useDispatch();
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const userRole = 3
    
    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchCategorias());
        dispatch(fetchEdiciones());
        dispatch(fetchTemporadas());
    }, [dispatch]);

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const temporadas = useSelector((state) => state.temporadas.data);
    
    
    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idMyTeam);
    const id_zona = miEquipo
    ? temporadas
        .filter((temp) => 
            temp.id_equipo === miEquipo.id_equipo && // Filtra por el equipo actual
            temp.tipo_zona === "todos-contra-todos" // Filtra por tipo de zona
        )
        .at(-1)?.id_zona // Toma el primer registro y accede a `id_zona`
    : null;
    
    
    
    // Detectar cambios en miEquipo y reiniciar la carga
    useEffect(() => {
        setLoading(true); // Reiniciar el estado de carga al cambiar de equipo
        const timer = setTimeout(() => setLoading(false), 1000); // Simular el tiempo de carga
        return () => clearTimeout(timer);
    }, []); // Dependemos de 'miEquipo' para resetear el estado de carga

    const partidos = useSelector((state) => state.partidos.data)
    const partidosMiEquipo = partidos.filter((p) => p.id_equipoLocal == miEquipo?.id_equipo || p.id_equipoVisita == miEquipo?.id_equipo)
    const partidosUltimaSemana = partidos
    .filter((p) => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const partidoFecha = new Date(p.dia);

        // Filtrar partidos dentro de los últimos 7 días
        return partidoFecha >= sevenDaysAgo && partidoFecha <= today;
    })
    .sort((a, b) => {
        // Ordenar por hora (asumiendo formato 'HH:mm:ss')
        const timeA = new Date(`1970-01-01T${a.hora}`).getTime();
        const timeB = new Date(`1970-01-01T${b.hora}`).getTime();
        return timeA - timeB; // Ordenar de más temprano a más tarde
    })
    
    // Encuentra el partido más reciente con estado distinto a "P"
    const ultimoPartidoMiEquipo = partidosMiEquipo.reduce((masReciente, partido) => {
        // Verificar que el estado del partido no sea "P"
        if (partido.estado !== "P") {
            // Comparar fechas solo si el estado no es "P"
            return new Date(partido.dia) > new Date(masReciente.dia) ? partido : masReciente;
        }
        return masReciente;
    }, partidosMiEquipo[0]);

    const partidosDia = partidos
        .filter((p) => {
            const fechaPartido = new Date(p.dia);

            // Validar si la fecha es válida
            if (isNaN(fechaPartido)) {
                console.error(`Fecha inválida para el partido: ${p.dia}`);
                return false; // Excluir este partido si la fecha es inválida
            }

            // Comparar solo la parte de la fecha (sin la hora)
            const fechaISO = fechaPartido.toISOString().split('T')[0]; // 'YYYY-MM-DD'
            return fechaISO === hoy; // Comparar con la fecha actual
        })
        .filter((p) => !partidosMiEquipo.some((miPartido) => miPartido.id_partido === p.id_partido)) // Excluir partidos de partidosMiEquipo
        .sort((a, b) => {
            // Ordenar por hora (asumiendo formato 'HH:mm:ss')
            const timeA = new Date(`1970-01-01T${a.hora}`).getTime();
            const timeB = new Date(`1970-01-01T${b.hora}`).getTime();
            return timeA - timeB; // Ordenar de más temprano a más tarde
        })    

    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual, partidoEnDirecto, ultimoPartido, zonaActual } = useMatchesUser(idMyTeam);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);

    const categoriaMiEquipo = temporadas
    .filter((t) => t.id_equipo === idMyTeam)
    .reduce((max, current) => 
        current.id_categoria > max ? current.id_categoria : max, 
        0
    );
    const zonaFiltrada = zonas.find((z) => {
        return z.id_categoria === categoriaMiEquipo && z.fase === 1;
    });

    
    const tablaMemoizada = useMemo(() => {
        if (!posiciones) return null;
        return (
            <TablaPosicionesRoutes
                data={posiciones}
                id_categoria={categoriaMiEquipo}
                dataColumns={dataPosicionesTemporadaColumnsMinus}
            />
        );
    }, [posiciones]);

    useEffect(() => {
        if (id_zona) {
            getPosicionesTemporada(id_zona)
                .then((data) => {
                    setPosiciones(data);
                })
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [id_zona]);

    useEffect(() => {
        dispatch(fetchPartidos())
        getZonas()
            .then((data) => setZonas(data))
            .catch((error) => console.error('Error fetching zonas:', error));

        getSanciones()
            .then((data) => sancionesActivas(data))
            .catch((error) => console.error('Error fetching sanciones:', error));
    }, [dispatch]);

    const zonasFiltradas = zonas.find((z) => z.id_zona === id_zona);

    const sancionesActivas = (sanciones) => {
        const sancionesFiltradas = sanciones.filter(s => s.fechas_restantes > 0)
        setSanciones(sancionesFiltradas);
    }

    const tituloCategoria = (id_zona) => {        
        const categoria = zonas.find((zona) => zona.id_zona === id_zona);
        
        // Verifica que se encontró la categoría y concatena los nombres
        return categoria ? `${categoria.nombre_edicion} - ${categoria.nombre_categoria}` : '';
    }

    const nombreZona = (id_zona) => {
        const zona = zonas.find((zona) => zona.id_zona === id_zona);
        return zona ? zona.nombre_zona : '';
    }

    let tituloPartido = '';
    if (partidoEnDirecto) {
        tituloPartido = 'En directo';
    } else if (proximoPartido) {
        tituloPartido = 'Próximo Partido';
    } else if (ultimoPartido) {
        tituloPartido = 'Último Partido';
    } else {
        tituloPartido = 'No hay partidos programados';
    }

    
    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchCategorias());
        dispatch(fetchEdiciones());
        dispatch(fetchPartidos());
        dispatch(fetchTemporadas());
    }, [dispatch]);

    
    
    const sancionadosColumns = [
        {
            field: "jugador",
            header: "Jugador",
            body: (rowData) => (
                <JugadorSancionadoBodyTemplate>
                    <img src={`${URLImages}${escudosEquipos(rowData.id_equipo)}`} alt={nombresEquipos(rowData.id_equipo)} />
                    <div className='detalle'>
                        {rowData.jugador}
                        <span>{nombresEquipos(rowData.id_equipo)}</span>
                    </div>
                </JugadorSancionadoBodyTemplate>
            )
        },
        {
            field: "fechas",
            header: "fechas / restantes",
            body: (rowData) => (
                <JugadorSancionadoNumeroFechas>
                    <span>{rowData.fechas}</span>
                    <p>/</p>
                    <p>{rowData.fechas_restantes}</p>
                </JugadorSancionadoNumeroFechas>
            )
        },
    ]

    

    return (
        <>
            <HomeContainerStyled>
                <HomeWrapper>
                    <HomeLeftWrapper>
                    {loading ? (
                        <>  
                            <CategoriasListaWrapper>
                            <CategoriasListaTitulo>
                                <Skeleton height="18px" width="40%" />
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                <CategoriasItem>
                                    <Skeleton height="18px" width="50%"  />
                                </CategoriasItem>
                                <CategoriasItem>
                                    <Skeleton height="18px" width="50%"  />
                                </CategoriasItem>
                            </CategoriasItemsWrapper>
                        </CategoriasListaWrapper>
                        <CategoriasListaWrapper>
                            <CategoriasListaTitulo>
                                <Skeleton height="18px" width="40%" />
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                <CategoriasItem>
                                    <Skeleton height="18px" width="50%"  />
                                </CategoriasItem>
                                <CategoriasItem>
                                    <Skeleton height="18px" width="50%"  />
                                </CategoriasItem>
                            </CategoriasItemsWrapper>
                        </CategoriasListaWrapper>
                        <CategoriasListaWrapper>
                            <CategoriasListaTitulo>
                                <Skeleton height="18px" width="40%" />
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                <CategoriasItem>
                                    <Skeleton height="18px" width="50%"  />
                                </CategoriasItem>
                                <CategoriasItem>
                                    <Skeleton height="18px" width="50%"  />
                                </CategoriasItem>
                            </CategoriasItemsWrapper>
                        </CategoriasListaWrapper>
                        </>                        
                    ) : (
                    // Si los datos están disponibles, mostrar la lista de categorías y ediciones
                    ediciones.map((edicion) => (
                        <CategoriasListaWrapper key={edicion.id_edicion}>
                            <CategoriasListaTitulo>
                                <p>{edicion.nombre} {edicion.temporada}</p>
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                {categorias
                                    .filter(
                                        (categoria) =>
                                            categoria.id_edicion === edicion.id_edicion &&
                                            categoria.publicada === "S"
                                    )
                                    .map((categoria) => (
                                        <CategoriasItem 
                                            key={categoria.id_categoria} 
                                            to={`/categoria/posiciones/${categoria.id_categoria}`}
                                        >
                                            {categoria.nombre}
                                        </CategoriasItem>
                                    ))}
                            </CategoriasItemsWrapper>
                        </CategoriasListaWrapper>
                    ))
                )}
                </HomeLeftWrapper>
                <HomeMediumWrapper>
                    {/* Partidos del dia */}
                    {partidosDia.length > 0 && (
                        <>
                            
                            <CardPartidosDia>
                                <CardPartidosDiaTitle>Partidos de hoy</CardPartidosDiaTitle>
                                <PartidosDiaFiltrosWrapper>
                                    <PartidosDiaFiltro
                                        onClick={() => setFiltroActivo("default")}
                                        className={filtroActivo === "default" ? "active" : ""}
                                    >
                                        Por categoría
                                    </PartidosDiaFiltro>
                                    <PartidosDiaFiltro
                                        onClick={() => setFiltroActivo("en_juego")}
                                        className={filtroActivo === "en_juego" ? "active" : ""}
                                    >
                                        En juego
                                    </PartidosDiaFiltro>
                                    <PartidosDiaFiltro
                                        onClick={() => setFiltroActivo("por_horario")}
                                        className={filtroActivo === "por_horario" ? "active" : ""}
                                    >
                                        Por horario
                                    </PartidosDiaFiltro>
                                    
                                </PartidosDiaFiltrosWrapper>
                            </CardPartidosDia>
                            {
                                miEquipo && <>
                                    {
                                        partidosMiEquipo.find((p) => p.estado === "P") && 
                                        <SectionHome>
                                            <SectionHomeTitle>
                                                ¡Hoy juega {nombresEquipos(miEquipo?.id_equipo)}!
                                            </SectionHomeTitle>
                                            <CardProximoPartido {...partidosMiEquipo.find((p) => p.estado === "P")} miEquipo={miEquipo?.id_equipo} />
                                        </SectionHome>
                                    }
                                </>
                            }
                            {/* Renderizar según el filtro activo */}
                            {filtroActivo === "default" && (
                                categorias
                                    .filter((categoria) => categoria.publicada === "S")
                                    .map((categoria) => {
                                        const partidosCategoria = partidosDia.filter(
                                            (p) => p.id_categoria === categoria.id_categoria
                                        );

                                        if (partidosCategoria.length === 0) return null;

                                        return (
                                            <SectionHome key={categoria.id_categoria}>
                                                <SectionHomeTitle>
                                                    <span>
                                                        {(() => {
                                                            const edicion = ediciones.find(
                                                                (e) => e.id_edicion === categoria.id_edicion
                                                            );
                                                            return edicion
                                                                ? `${edicion.nombre} ${edicion.temporada} |`
                                                                : "";
                                                        })()}
                                                    </span>
                                                    {categoria.nombre}
                                                </SectionHomeTitle>
                                                <PartidosGenericosContainer>
                                                    {partidosCategoria
                                                        .map((p) => (
                                                            <CardPartidoGenerico
                                                                key={p.id_partido}
                                                                {...p}
                                                            />
                                                        ))}
                                                </PartidosGenericosContainer>
                                            </SectionHome>
                                        );
                                    })
                            )}

                            {filtroActivo === "por_horario" && (
                                <SectionHome>
                                    <PartidosGenericosContainer>
                                        {partidosDia
                                            .map((p) => (
                                                <CardPartidoGenerico key={p.id_partido} {...p} />
                                            ))}
                                    </PartidosGenericosContainer>
                                </SectionHome>
                            )}


                            {filtroActivo === "en_juego" && (
                                <SectionHome>
                                    <PartidosGenericosContainer>
                                        {partidosDia
                                            .filter((p) => p.estado === "C") // Filtrar solo partidos "C"
                                            .map((p) => (
                                                <CardPartidoGenerico key={p.id_partido} {...p} />
                                            ))}
                                    </PartidosGenericosContainer>
                                </SectionHome>
                            )}
                        </>
                    )}
                    {
                        miEquipo && (
                            <>
                                {
                                    partidosMiEquipo.find((p) => {
                                        // Validar si el partido tiene estado "P" y no es del día de hoy
                                        const fechaPartido = new Date(p.dia);
                                        const esHoy = fechaPartido.toISOString().split('T')[0] === hoy;
                                        return p.estado === "P" && !esHoy;
                                    }) && (
                                        <SectionHome>
                                            <SectionHomeTitle>
                                                Próximo partido
                                            </SectionHomeTitle>
                                            <CardProximoPartido 
                                                {...partidosMiEquipo.find((p) => {
                                                    const fechaPartido = new Date(p.dia);
                                                    const esHoy = fechaPartido.toISOString().split('T')[0] === hoy;
                                                    return p.estado === "P" && !esHoy;
                                                })} 
                                                miEquipo={miEquipo?.id_equipo} 
                                            />
                                        </SectionHome>
                                    )
                                }
                            </>
                        )
                    }

                    {
                        miEquipo ? 
                        <>
                            {/* {
                                partidosMiEquipo.find((p) => p.estado === "P") && 
                                <SectionHome>
                                    <SectionHomeTitle>
                                        Próximo partido
                                    </SectionHomeTitle>
                                    <CardProximoPartido {...partidosMiEquipo.find((p) => p.estado === "P")} miEquipo={miEquipo?.id_equipo} />
                                </SectionHome>
                            } */}
                            <SectionHome>
                                <SectionHomeTitle>
                                    Ultimos partidos de {nombresEquipos(miEquipo?.id_equipo)}
                                </SectionHomeTitle>
                                <CardUltimoPartido {...ultimoPartidoMiEquipo} miEquipo={miEquipo?.id_equipo} />
                                <PartidosGenericosContainer>
                                    {
                                        partidosMiEquipo
                                        .filter((p) => p.id_partido !== ultimoPartidoMiEquipo.id_partido && p.estado != "P")
                                        .sort((a, b) => new Date(b.dia) - new Date(a.dia))
                                        .map((p) => (
                                            <CardPartidoGenerico
                                                mostrarDia
                                                miEquipo={miEquipo.id_equipo} 
                                                key={p.id_partido}
                                                {...p}
                                            />
                                        ))                            
                                    }
                                </PartidosGenericosContainer>
                            </SectionHome>
                        </> :
                        <>
                            Partidos de la semana en CR!
                            {/* <CardPartidosDia>
                                <CardPartidosDiaTitle>
                                    Partidos de la última semana en CR
                                </CardPartidosDiaTitle>
                                <PartidosDiaFiltrosWrapper>
                                    <PartidosDiaFiltro>
                                        En juego
                                    </PartidosDiaFiltro>
                                    <PartidosDiaFiltro>
                                        Por horario
                                    </PartidosDiaFiltro>
                                </PartidosDiaFiltrosWrapper>
                            </CardPartidosDia> */}
                            {
                                categorias
                                .filter((categoria) => categoria.publicada === "S")
                                .map((categoria) => {
                                    // Filtrar los partidos de la última semana por la categoría actual
                                    const partidosCategoria = partidosUltimaSemana.filter(
                                        (p) => p.id_categoria === categoria.id_categoria
                                    );

                                    // No renderizar nada si no hay partidos para la categoría
                                    if (partidosCategoria.length === 0) {
                                        return null;
                                    }

                                    // Renderizar la categoría si tiene partidos
                                    return (
                                        <SectionHome key={categoria.id_categoria}>
                                            <SectionHomeTitle>
                                                <span>
                                                    {(() => {
                                                        const edicion = ediciones.find((e) => e.id_edicion === categoria.id_edicion);
                                                        return edicion ? `${edicion.nombre} ${edicion.temporada} |` : '';
                                                    })()}
                                                </span>
                                                {categoria.nombre}
                                            </SectionHomeTitle>
                                            <PartidosGenericosContainer>
                                                {partidosCategoria
                                                    .sort((a, b) => new Date(b.dia) - new Date(a.dia))
                                                    .map((p) => (
                                                        <CardPartidoGenerico
                                                            mostrarDia
                                                            key={p.id_partido}
                                                            {...p}
                                                        />
                                                    ))}
                                            </PartidosGenericosContainer>
                                        </SectionHome>
                                    );
                                })
                            }

                        </>
                    }

                    {/* <Section>
                        <h2>{tituloPartido} {tituloPartido === 'En directo' && (<CircleLive/>)}</h2>
                        {partidoAMostrar ? (
                            <CardPartido
                                rol={userRole}
                                partido={partidoAMostrar}
                            />
                        ) : (
                            <StatsNull>
                                <p>No hay partidos programados para tu equipo.</p>
                            </StatsNull>
                        )}
                    </Section> */}
                    {/* <Section>
                        {fechaActual && partidosFecha.length > 0 ? (
                            <>
                                <h2>{
                                    zonaActual.tipo_zona === 'todos-contra-todos'
                                        ? `Fecha ${fechaActual} - ${zonaActual.nombre_categoria} - ${zonaActual.nombre_edicion}`
                                        : `${zonaActual.nombre_zona} - ${partidosFecha[0]?.nombre_categoria}`
                                    }

                                </h2>
                                <CardsMatchesContainer>
                                    <CardsMatchesWrapper>
                                        {partidosFecha
                                            .map((p) => (
                                                <CardPartido
                                                    key={p.id_partido}
                                                    rol={userRole}
                                                    partido={p}
                                                />
                                            ))}
                                    </CardsMatchesWrapper>
                                </CardsMatchesContainer>
                            </>
                        ) : (
                            <StatsNull>
                                <p>No hay partidos disponibles para esta fecha.</p>
                            </StatsNull>
                        )}
                    </Section> */}
                    {sanciones && (
                        <SectionHome>
                            <SectionHomeTitle>
                                Sanciones
                            </SectionHomeTitle>
                            <TableSanciones
                                data={sanciones}
                                dataColumns={sancionadosColumns}
                            />
                        </SectionHome>
                    )}
                </HomeMediumWrapper>
                <HomeRightWrapper>
                    
                    {posiciones && zonasFiltradas ? (
                        <Section>
                            <CategoriasListaWrapper>
                                <CategoriasListaTitulo>
                                    <p>Tabla de Posiciones</p>
                                    <span>{tituloCategoria(id_zona)}</span>
                                    {/* <span>{nombreZona(id_zona)}</span> */}
                                </CategoriasListaTitulo>
                                <TablaPosicionesRoutes
                                    small
                                    data={posiciones}
                                    id_categoria={2}
                                    // zona={zonasFiltradas}
                                    dataColumns={dataPosicionesTemporadaColumnsMinus}
                                />
                                {tablaMemoizada}
                            </CategoriasListaWrapper>
                            
                        </Section>
                    ) : (
                        <Section>
                            <CategoriasListaWrapper>
                                <CategoriasListaTitulo>
                                    <p>Tabla de Posiciones</p>
                                    <Skeleton height='12px' width='80px'/>
                                </CategoriasListaTitulo>
                                <TablePosicionesSkeletonWrapper>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton size='16px' shape='circle' />
                                        <Skeleton height='16px' width='150px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton size='16px' shape='circle' />
                                        <Skeleton height='16px' width='150px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton size='16px' shape='circle' />
                                        <Skeleton height='16px' width='150px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton size='16px' shape='circle' />
                                        <Skeleton height='16px' width='150px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton size='16px' shape='circle' />
                                        <Skeleton height='16px' width='150px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton size='16px' shape='circle' />
                                        <Skeleton height='16px' width='150px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                        <Skeleton height='16px' width='16px'/>
                                    </div>
                                </TablePosicionesSkeletonWrapper>
                            </CategoriasListaWrapper>
                        </Section>
                    )} 
                    <DreamteamUser fecha={fechaActual} id_categoria={partidoAMostrar?.id_categoria} zona={zonasFiltradas}/>
                </HomeRightWrapper>
                </HomeWrapper>
            </HomeContainerStyled>
        </>
    );
};

export default Home;
