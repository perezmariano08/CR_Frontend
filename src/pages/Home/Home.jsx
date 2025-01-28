import React, { useEffect, useMemo, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper, HomeMediumWrapper, HomeLeftWrapper, HomeRightWrapper, CircleLive, CategoriasListaWrapper, CategoriasListaTitulo, CategoriasItem, CategoriasItemsWrapper, SectionHome, SectionHomeTitle, CardPartidosDia, CardPartidosDiaTitle, PartidosDiaFiltrosWrapper, PartidosDiaFiltro, DreamTeamTitulo, DreamTeamTorneo, SelectEquipoCelular } from './HomeStyles';
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
import SelectVistaPartido from '../../components/Select/SelectVistaPartido.jsx';

const Home = () => {
    // Fecha actual
    const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato "YYYY-MM-DD"

    // Estado Filtro
    const [filtroActivo, setFiltroActivo] = useState("default"); // "default", "por_horario", "en_juego"
    const [filtroActivoSemana, setFiltroActivoSemana] = useState("default"); // "default", "por_horario", "en_juego"

    const [vistaPartido, setVistaPartido] = useState("semana");

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
    
    const [idZona, setIdZona] = useState(3)
    
    
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

        const [vistaSeleccionada, setVistaSeleccionada] = useState("dia");

        const handleVistaChange = (e) => {
            setVistaSeleccionada(e.target.value);
        };
        
    // Filtrar partidos que no estén en partidosDia de los partidosUltimaSemana
    const partidosSemanaSinDia = partidosUltimaSemana.filter((partidoSemana) => {
        return !partidosDia.some((partidoDia) => partidoDia.id_partido === partidoSemana.id_partido);
    });

    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual, partidoEnDirecto, ultimoPartido, zonaActual } = useMatchesUser(idMyTeam);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);

    useEffect(() => {        
        if (idZona) {
            getPosicionesTemporada(idZona)
                .then((data) => {
                    setPosiciones(data);
                    console.log(posiciones);
                    
                })
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [idZona]);

    

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

    const renderizarPartidos = (partidos) => {
        if (filtroActivo === "default") {
          return categorias
            .filter((categoria) => categoria.publicada === "S")
            .map((categoria) => {
              const partidosCategoria = partidos.filter(
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
                    {partidosCategoria.map((p) => (
                      <CardPartidoGenerico key={p.id_partido} {...p} />
                    ))}
                  </PartidosGenericosContainer>
                </SectionHome>
              );
            });
        }
    
        if (filtroActivo === "por_horario") {
          return (
            <SectionHome>
              <PartidosGenericosContainer>
                {partidos.map((p) => (
                  <CardPartidoGenerico key={p.id_partido} {...p} />
                ))}
              </PartidosGenericosContainer>
            </SectionHome>
          );
        }
    
        if (filtroActivo === "en_juego") {
          return (
            <SectionHome>
              <PartidosGenericosContainer>
                {partidos
                  .filter((p) => p.estado === "C") // Filtrar solo partidos "C"
                  .map((p) => (
                    <CardPartidoGenerico key={p.id_partido} {...p} />
                  ))}
              </PartidosGenericosContainer>
            </SectionHome>
          );
        }
      };

      

    
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

    useEffect(() => {
        // Si no hay partidos del día, cambiar automáticamente a "semana"
        if (vistaSeleccionada === "dia" && partidosDia.length === 0) {
            setVistaSeleccionada("semana");
            setFiltroActivo("default"); // Activar filtro "Por categoría"
        }
    },  [vistaSeleccionada, partidosDia]); // Re-ejecutar si cambia la vista o la lista de partidos
    
    console.log(zonas);    
    const zonasPublicadas = zonas.filter((z) => z.tipo_zona === "todos-contra-todos")

    console.log(zonasPublicadas);
    
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
                        <SelectEquipoCelular>
                            <SelectNuevo options={equiposFiltrados} onChange={handleSelectChange} valueKey={'id_equipo'}/>
                        </SelectEquipoCelular>
                        {/* Partido del dia de MI EQUIPO */}
                        {partidosMiEquipoHoy ? <>
                                {
                                    <SectionHome>
                                        <SectionHomeTitle>
                                            {
                                                partidosMiEquipoHoy.estado === "P" ? (
                                                    <>
                                                        <span>Hoy juega tu equipo |</span><img src={`https://coparelampago.com/${escudosEquipos(miEquipo?.id_equipo)}`} />{nombresEquipos(miEquipo?.id_equipo)}

                                                    </>
                                                ) : <>
                                                    <span>Partido del día |</span>
                                                    <img src={`https://coparelampago.com/${escudosEquipos(miEquipo?.id_equipo)}`} />{nombresEquipos(miEquipo?.id_equipo)}
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
                                                        <img src={`https://coparelampago.com/${escudosEquipos(miEquipo?.id_equipo)}`} />{nombresEquipos(miEquipo?.id_equipo)}<span>| Proximo partido</span>
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
                                                        <img src={`https://coparelampago.com/${escudosEquipos(miEquipo?.id_equipo)}`} />{nombresEquipos(miEquipo?.id_equipo)}<span>| Ultimos partidos</span>
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
                        {/* Mostrar partidos del dia y de la semana */}
                        {
                            partidosDia.length > 0 || partidosUltimaSemana > 0 ? (
                                <><CardPartidosDia>
                                <CardPartidosDiaTitle>
                                    <SelectVistaPartido
                                        vistaSeleccionada={vistaSeleccionada}
                                        setVistaSeleccionada={(vista) => {
                                            setVistaSeleccionada(vista);
                                            if (vista === "semana") {
                                                setFiltroActivo("default"); // Activar "Por categoría" automáticamente
                                            }
                                        }}
                                        partidosDia={partidosDia}
                                    />
                                </CardPartidosDiaTitle>
                                
                                <PartidosDiaFiltrosWrapper>
                                    {/* Mostrar siempre el filtro "Por categoría" */}
                                    <PartidosDiaFiltro
                                        onClick={() => setFiltroActivo("default")}
                                        className={filtroActivo === "default" ? "active" : ""}
                                    >
                                        Por categoría
                                    </PartidosDiaFiltro>

                                    {/* Mostrar los filtros adicionales solo si la vista seleccionada es "dia" */}
                                    {vistaSeleccionada === "dia" && (
                                        <>
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
                                        </>
                                    )}
                                </PartidosDiaFiltrosWrapper>
                            </CardPartidosDia>

                            {/* Renderizar partidos según la vista seleccionada */}
                            {vistaSeleccionada === "dia" && renderizarPartidos(partidosDia)}
                            {vistaSeleccionada === "semana" && renderizarPartidos(partidosUltimaSemana)}
                        </> 
                            ) : 'CR está en descanso! No hubo partidos en esta última semana'
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
                                            <span>Próximo partido |</span>{nombresEquipos(miEquipo?.id_equipo)}
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


                        {sanciones && sanciones.length > 0 && (
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
                                        {/* Select dinámico */}
                                        <select 
                                            value={idZona} // id_zona inicial
                                            onChange={(e) => setIdZona(e.target.value)} // Cambiar el id_zona
                                        >
                                            {zonasPublicadas.map((zona) => (
                                                <option key={zona.id_zona} value={zona.id_zona}>
                                                    {`${zona.nombre_edicion} - ${zona.nombre_categoria}`}
                                                </option>
                                            ))}
                                        </select>
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
