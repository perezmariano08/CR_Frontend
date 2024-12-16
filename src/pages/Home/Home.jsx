import React, { useEffect, useMemo, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper, HomeMediumWrapper, HomeLeftWrapper, HomeRightWrapper, CircleLive, CategoriasListaWrapper, CategoriasListaTitulo, CategoriasItem, CategoriasItemsWrapper, SectionHome, SectionHomeTitle, CardPartidosDia, CardPartidosDiaTitle, PartidosDiaFiltrosWrapper, PartidosDiaFiltro, DreamTeamTitulo, DreamTeamTorneo } from './HomeStyles';
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
import SelectNuevo from '../../components/Select/SelectNuevo.jsx';
import { setNuevoEquipoSeleccionado } from '../../redux/user/userSlice.js';
import DreamTeamCard from '../../components/DreamTeamCard/DreamTeamCard.jsx';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { fetchJugadoresDestacados } from '../../redux/ServicesApi/jugadoresDestacadosSlice.js';
import { fetchJugadores } from '../../redux/ServicesApi/jugadoresSlice.js';

const Home = () => {
    // Fecha actual
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato "YYYY-MM-DD"

    // Estado Filtro
    const [filtroActivo, setFiltroActivo] = useState("default"); // "default", "por_horario", "en_juego"
    const [filtroActivoSemana, setFiltroActivoSemana] = useState("default"); // "default", "por_horario", "en_juego"

    const [loading, setLoading] = useState(true);
    const { escudosEquipos, nombresEquipos } = useEquipos();

    const dispatch = useDispatch();
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const userRole = 3
    

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const temporadas = useSelector((state) => state.temporadas.data);
    const jugadoresDestacados = useSelector((state) => state.jugadoresDestacados.data);
    // Función para agrupar los datos por categoría y jornada
    const agruparPorCategoriaYJornada = (datos) => {
        return datos.reduce((resultado, item) => {
            // Verificar si ya existe la categoría en el resultado
            if (!resultado[item.id_categoria]) {
                resultado[item.id_categoria] = {};
            }

            // Verificar si ya existe la jornada dentro de esa categoría
            if (!resultado[item.id_categoria][item.jornada]) {
                resultado[item.id_categoria][item.jornada] = [];
            }

            // Agregar el jugador a la jornada correspondiente
            resultado[item.id_categoria][item.jornada].push(item);

            return resultado;
        }, {});
    };

    // Llamar a la función con los datos actuales
    const datosAgrupados = agruparPorCategoriaYJornada(jugadoresDestacados);

    
    const equipoSeleccionado = useSelector((state) => state.newUser.equipoSeleccionado)
    const equipos = useSelector((state) => state.equipos.data);
    // Filtrar equipos vigentes usando useMemo para mejorar rendimiento
    const equiposFiltrados = useMemo(() => {
        const equiposVigentesIds = new Set(temporadas.map((temporada) => temporada.id_equipo));
        return equipos.filter((equipo) => equiposVigentesIds.has(equipo.id_equipo));
    }, [equipos, temporadas]);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idMyTeam);
    const id_zona = miEquipo
    ? temporadas
        .filter((temp) => 
            temp.id_equipo === miEquipo.id_equipo && // Filtra por el equipo actual
            temp.tipo_zona === "todos-contra-todos" // Filtra por tipo de zona
        )
        .at(-1)?.id_zona // Toma el primer registro y accede a `id_zona`
    : 74;
    
    
    
    // Detectar cambios en miEquipo y reiniciar la carga
    useEffect(() => {
        setLoading(true); // Reiniciar el estado de carga al cambiar de equipo
        const timer = setTimeout(() => setLoading(false), 1000); // Simular el tiempo de carga
        return () => clearTimeout(timer);
    }, []); // Dependemos de 'miEquipo' para resetear el estado de carga

    const partidos = useSelector((state) => state.partidos.data)
    const partidosMiEquipo = partidos.filter((p) => p.id_equipoLocal == miEquipo?.id_equipo || p.id_equipoVisita == miEquipo?.id_equipo)
    const partidosMiEquipoHoy = partidosMiEquipo.find((p) => {
        const fechaPartido = new Date(p.dia);

        // Validar si la fecha es válida
        if (isNaN(fechaPartido)) {
            return false; // Excluir este partido si la fecha es inválida
        }

        // Comparar solo la parte de la fecha (sin la hora)
        const fechaISO = fechaPartido.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        return fechaISO === hoy; // Comparar con la fecha actual
    })
    
    
    
    const partidosUltimaSemana = partidos
    .filter((p) => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const partidoFecha = new Date(p.dia);

        // Filtrar partidos dentro de los últimos 7 días y con ambos equipos (local y visita)
        return partidoFecha >= sevenDaysAgo &&
            partidoFecha <= today &&
            p.id_equipoLocal && p.id_equipoVisita; // Comprobar que ambos equipos estén presentes
    })
    .sort((a, b) => {
        // Ordenar por hora (asumiendo formato 'HH:mm:ss')
        const timeA = new Date(`1970-01-01T${a.hora}`).getTime();
        const timeB = new Date(`1970-01-01T${b.hora}`).getTime();
        return timeA - timeB; // Ordenar de más temprano a más tarde
    });

    // Encuentra el partido más reciente con estado distinto a "P"
    const ultimoPartidoMiEquipo = partidosMiEquipo.reduce((masReciente, partido) => {
        // Solo considerar partidos cuyo estado no sea "P" ni "C"
        if (partido.estado !== "P" && partido.estado !== "C") {
            // Si masReciente es null (primer partido válido encontrado), asignamos el primer partido válido
            if (!masReciente) {
                return partido;
            }
            // Comparar fechas y seleccionar el más reciente
            return new Date(partido.dia) > new Date(masReciente.dia) ? partido : masReciente;
        }
        return masReciente; // Si el estado es "P" o "C", no cambiar el valor acumulado
    }, null); // Iniciar con `null` para manejar casos sin partidos válidos
    
    


    const partidosDia = partidos
        .filter((p) => {
            const fechaPartido = new Date(p.dia);

            // Validar si la fecha es válida
            if (isNaN(fechaPartido)) {
                return false; // Excluir este partido si la fecha es inválida
            }

            // Comparar solo la parte de la fecha (sin la hora)
            const fechaISO = fechaPartido.toISOString().split('T')[0]; // 'YYYY-MM-DD'
            return fechaISO === hoy; // Comparar con la fecha actual
        })
        .sort((a, b) => {
            // Ordenar por hora (asumiendo formato 'HH:mm:ss')
            const timeA = new Date(`1970-01-01T${a.hora}`).getTime();
            const timeB = new Date(`1970-01-01T${b.hora}`).getTime();
            return timeA - timeB; // Ordenar de más temprano a más tarde
        })
        
    // Filtrar partidos que no estén en partidosDia de los partidosUltimaSemana
    const partidosSemanaSinDia = partidosUltimaSemana.filter((partidoSemana) => {
        return !partidosDia.some((partidoDia) => partidoDia.id_partido === partidoSemana.id_partido);
    });

    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual, partidoEnDirecto, ultimoPartido, zonaActual } = useMatchesUser(idMyTeam);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);

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
    
    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchCategorias());
        dispatch(fetchEdiciones());
        dispatch(fetchPartidos());
        dispatch(fetchTemporadas());
        dispatch(fetchJugadoresDestacados());
        dispatch(fetchJugadores());
    }, [dispatch]);


    const handleSelectChange = (value) => {
        dispatch(setNuevoEquipoSeleccionado(parseInt(value)))
    };

    // Estado para la jornada seleccionada en cada categoría
    const [jornadaSeleccionada, setJornadaSeleccionada] = useState({});

    const handleJornadaChange = (categoria, nuevaJornada) => {
        setJornadaSeleccionada((prev) => ({
            ...prev,
            [categoria]: nuevaJornada,
        }));
    };
    
    return (
        <>
            <HomeContainerStyled>
                <HomeWrapper>
                    <HomeLeftWrapper>
                        <SelectNuevo options={equiposFiltrados} onChange={handleSelectChange} valueKey={'id_equipo'}/>
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
                    ediciones.map((edicion) => {
                        // Filtra las categorías para asegurarte de que solo aquellas publicadas sean consideradas
                        const categoriasPublicadas = categorias.filter(
                            (categoria) =>
                                categoria.id_edicion === edicion.id_edicion &&
                                categoria.publicada === "S"
                        );
                    
                        // Si no hay categorías publicadas, no mostramos esta edición
                        if (categoriasPublicadas.length === 0) return null;
                    
                        return (
                            <CategoriasListaWrapper key={edicion.id_edicion}>
                                <CategoriasListaTitulo>
                                    <p>{edicion.nombre} {edicion.temporada}</p>
                                </CategoriasListaTitulo>
                                <CategoriasItemsWrapper>
                                    {categoriasPublicadas.map((categoria) => (
                                        <CategoriasItem 
                                            key={categoria.id_categoria} 
                                            to={`/categoria/posiciones/${categoria.id_categoria}`}
                                        >
                                            {categoria.nombre}
                                        </CategoriasItem>
                                    ))}
                                </CategoriasItemsWrapper>
                            </CategoriasListaWrapper>
                        );
                    })                    
                )}
                    </HomeLeftWrapper>
                    <HomeMediumWrapper>
                        {/* Partido del dia de MI EQUIPO */}
                        {partidosMiEquipoHoy ? <>
                                {
                                    <SectionHome>
                                        <SectionHomeTitle>
                                            {
                                                partidosMiEquipoHoy.estado === "P" ? (
                                                    <>
                                                        <span>Hoy juega tu equipo |</span> {nombresEquipos(miEquipo?.id_equipo)}
                                                    </>
                                                ) : <>
                                                    <span>Partido del día |</span>
                                                        {nombresEquipos(miEquipo?.id_equipo)}
                                                    </>
                                            }
                                        </SectionHomeTitle>
                                        {
                                            partidosMiEquipoHoy.estado === "P" ? (
                                                <CardProximoPartido {...partidosMiEquipoHoy} miEquipo={miEquipo?.id_equipo} />
                                            ) : (
                                                <CardUltimoPartido {...partidosMiEquipoHoy} miEquipo={miEquipo?.id_equipo} />
                                            )
                                        }
                                    </SectionHome>
                                }
                            </> : <> {/* Sino muestra proximo y ultimos partidos de MI EQUIPO */} 
                                {
                                    miEquipo && <>
                                        {partidosMiEquipo.find((p) => {
                                                // Validar si el partido tiene estado "P" y no es del día de hoy
                                                const fechaPartido = new Date(p.dia);
                                                // Comprobamos si la fecha es válida
                                                if (isNaN(fechaPartido)) {
                                                    return false;  // Puedes decidir si quieres ignorar ese partido o manejarlo de otra manera
                                                }
                                                const esHoy = fechaPartido.toISOString().split('T')[0] === hoy;
                                                return p.estado === "P" && !esHoy;
                                            }) && (
                                                <SectionHome>
                                                    <SectionHomeTitle>
                                                        Próximo partido de {nombresEquipos(miEquipo?.id_equipo)}
                                                    </SectionHomeTitle>
                                                    <CardProximoPartido 
                                                        {...partidosMiEquipo.find((p) => {
                                                            const fechaPartido = new Date(p.dia);
                                                            // Comprobamos si la fecha es válida
                                                            if (isNaN(fechaPartido)) {
                                                                return false;  // Puedes decidir si quieres ignorar ese partido o manejarlo de otra manera
                                                            }
                                                            const esHoy = fechaPartido.toISOString().split('T')[0] === hoy;
                                                            return p.estado === "P" && !esHoy;
                                                        })} 
                                                        miEquipo={miEquipo?.id_equipo} 
                                                    />
                                                </SectionHome>
                                            )
                                        }
                                        {
                                            ultimoPartidoMiEquipo && (
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
                                            )
                                        }
                                    </>
                                }
                            </>
                        }

                        {/* Partidos del dia */} 
                        {partidosDia.length > 0 ? (
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
                        ) : <> {/* Sino muestra partidos de la semana */} 
                                <CardPartidosDia>
                                    <CardPartidosDiaTitle>Partidos de la semana en CR</CardPartidosDiaTitle>
                                    <PartidosDiaFiltrosWrapper>
                                        <PartidosDiaFiltro
                                            onClick={() => setFiltroActivo("default")}
                                            className={filtroActivo === "default" ? "active" : ""}
                                        >
                                            Por categoría
                                        </PartidosDiaFiltro>
                                    </PartidosDiaFiltrosWrapper>
                                </CardPartidosDia>
                                {/* Renderizar según el filtro activo */}
                                {filtroActivo === "default" && (
                                    categorias
                                        .filter((categoria) => categoria.publicada === "S")
                                        .map((categoria) => {
                                            const partidosCategoria = partidosUltimaSemana.filter(
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
                        }

                        {/* En caso de haber partido del dia de MI EQUIPO mostrar
                        proximo y ultimos partidos de MI EQUIPO debajo de los partidos del día*/}
                        {partidosMiEquipoHoy && <> 
                            {
                                partidosMiEquipo.find((p) => {
                                    // Validar si el partido tiene estado "P" y no es del día de hoy
                                    const fechaPartido = new Date(p.dia);
                                    const esHoy = fechaPartido.toISOString().split('T')[0] === hoy;
                                    return p.estado === "P" && !esHoy;
                                }) && (
                                    <SectionHome>
                                        <SectionHomeTitle>
                                            Próximo partido de {nombresEquipos(miEquipo?.id_equipo)}
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
                            {
                                ultimoPartidoMiEquipo && (
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
                                )
                            }
                            </>
                        }

                        {/* Mostrar partidos de la ultima semana, excepto los partidos del dia */} 
                        {partidosSemanaSinDia.length > 0 && partidosDia.length > 0 && <> 
                                <CardPartidosDia>
                                    <CardPartidosDiaTitle>Partidos de la semana en CR</CardPartidosDiaTitle>
                                    <PartidosDiaFiltrosWrapper>
                                        <PartidosDiaFiltro
                                            onClick={() => setFiltroActivoSemana("default")}
                                            className={filtroActivoSemana === "default" ? "active" : ""}
                                        >
                                            Por categoría
                                        </PartidosDiaFiltro>
                                    </PartidosDiaFiltrosWrapper>
                                </CardPartidosDia>
                                {/* Renderizar según el filtro activo */}
                                {filtroActivoSemana === "default" && (
                                    categorias
                                        .filter((categoria) => categoria.publicada === "S")
                                        .map((categoria) => {
                                            const partidosCategoria = partidosSemanaSinDia.filter(
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
                                {/* {filtroActivo === "por_horario" && (
                                    <SectionHome>
                                        <PartidosGenericosContainer>
                                            {partidosSemanaSinDia
                                                .map((p) => (
                                                    <CardPartidoGenerico key={p.id_partido} {...p} />
                                                ))}
                                        </PartidosGenericosContainer>
                                    </SectionHome>
                                )}
                                {filtroActivo === "en_juego" && (
                                    <SectionHome>
                                        <PartidosGenericosContainer>
                                            {partidosSemanaSinDia
                                                .filter((p) => p.estado === "C") // Filtrar solo partidos "C"
                                                .map((p) => (
                                                    <CardPartidoGenerico key={p.id_partido} {...p} />
                                                ))}
                                        </PartidosGenericosContainer>
                                    </SectionHome>
                                )} */}
                            </>
                        }
                        

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
                        {/* <CategoriasListaWrapper>
                            <CategoriasListaTitulo>
                                <p>Dream Team</p>
                            </CategoriasListaTitulo>
                            {Object.entries(datosAgrupados).map(([categoria, jornadas]) => {
                                // Obtén todas las jornadas disponibles y la jornada seleccionada
                                const jornadasDisponibles = Object.keys(jornadas);
                                const jornadaActual = jornadaSeleccionada[categoria] || jornadasDisponibles[0];

                                return (
                                    <div key={categoria}>
                                        <h2>Categoría: {categoria}</h2>
                                        <DreamTeamTitulo>
                                            <FaAngleLeft
                                                onClick={() => {
                                                    const currentIndex = jornadasDisponibles.indexOf(jornadaActual);
                                                    if (currentIndex > 0) {
                                                        handleJornadaChange(categoria, jornadasDisponibles[currentIndex - 1]);
                                                    }
                                                }}
                                            />
                                            <DreamTeamTorneo>
                                                <p>Fecha {jornadaActual}</p>
                                                <span>Categoría {categoria}</span>
                                            </DreamTeamTorneo>
                                            <FaAngleRight
                                                onClick={() => {
                                                    const currentIndex = jornadasDisponibles.indexOf(jornadaActual);
                                                    if (currentIndex < jornadasDisponibles.length - 1) {
                                                        handleJornadaChange(categoria, jornadasDisponibles[currentIndex + 1]);
                                                    }
                                                }}
                                            />
                                        </DreamTeamTitulo>
                                        <DreamTeamCard jugadores={jornadas[jornadaActual]} />
                                    </div>
                                );
                            })}
                        </CategoriasListaWrapper> */}
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
                    </HomeRightWrapper>
                </HomeWrapper>
            </HomeContainerStyled>
        </>
    );
};

export default Home;
