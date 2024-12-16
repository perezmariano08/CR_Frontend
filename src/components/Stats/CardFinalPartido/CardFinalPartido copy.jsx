import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn, WatchContainer } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { formatTime, URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';
import { MdOutlineWatchLater } from "react-icons/md";
import { usePlanilla } from '../../../hooks/usePlanilla';
import { getZonas } from '../../../utils/dataFetchers';
import { renderizarTituloPartido } from '../statsHelpers';

const CardFinalPartido = ({ idPartido }) => {

    const [zona, setZona] = useState([]);

    const { matchCorrecto: partido, bdIncidencias, estadoPartido } = usePlanilla(idPartido);

    const { nombresEquipos, escudosEquipos } = useEquipos();
    const procesarGoles = (incidencias) => {
        if (!partido) return { local: [], visita: [] };
    
        const goles = {
            local: [],
            visita: []
        };
    
        // Si el estado del partido es 'S', usar directamente los goles del partido
        if (partido.estado === 'S') {
            return {
                local: Array(partido.goles_local).fill({ nombre: 'Gol' }),
                visita: Array(partido.goles_visita).fill({ nombre: 'Gol' })
            };
        }
    
        // Si el estado del partido es 'F', incluir los datos de las incidencias con goles
        if (partido.estado === 'F') {
            incidencias?.forEach((incidencia) => {
                if (incidencia.tipo === 'Gol') {
                    const gol = {
                        minuto: incidencia.minuto,
                        id_jugador: incidencia.id_jugador,
                        nombre: incidencia.nombre,
                        apellido: incidencia.apellido,
                        penal: incidencia.penal === 'S' || incidencia.penal === 'si',
                        enContra: incidencia.en_contra === 'S' || incidencia.en_contra === 'si'
                    };
    
                    if (incidencia.id_equipo === partido.id_equipoLocal) {
                        if (gol.enContra) {
                            goles.visita.push(gol);
                        } else {
                            goles.local.push(gol);
                        }
                    } else if (incidencia.id_equipo === partido.id_equipoVisita) {
                        if (gol.enContra) {
                            goles.local.push(gol);
                        } else {
                            goles.visita.push(gol);
                        }
                    }
                }
            });
    
            // Si no hay incidencias que coincidan, usar los valores genéricos
            while (goles.local.length < partido.goles_local) {
                goles.local.push({ nombre: '', minuto: null });
            }
            while (goles.visita.length < partido.goles_visita) {
                goles.visita.push({ nombre: '', minuto: null });
            }
    
            goles.local.sort((a, b) => a.minuto - b.minuto || 0);
            goles.visita.sort((a, b) => a.minuto - b.minuto || 0);
    
            return goles;
        }
    
        // Procesar incidencias para los estados que no sean 'S' o 'F'
        incidencias?.forEach((incidencia) => {
            if (incidencia.tipo === 'Gol') {
                const gol = {
                    minuto: incidencia.minuto,
                    id_jugador: incidencia.id_jugador,
                    nombre: incidencia.nombre,
                    apellido: incidencia.apellido,
                    penal: incidencia.penal === 'S' || incidencia.penal === 'si',
                    enContra: incidencia.en_contra === 'S' || incidencia.en_contra === 'si'
                };
    
                if (incidencia.id_equipo === partido.id_equipoLocal) {
                    if (gol.enContra) {
                        goles.visita.push(gol);
                    } else {
                        goles.local.push(gol);
                    }
                } else if (incidencia.id_equipo === partido.id_equipoVisita) {
                    if (gol.enContra) {
                        goles.local.push(gol);
                    } else {
                        goles.visita.push(gol);
                    }
                }
            }
        });
    
        goles.local.sort((a, b) => a.minuto - b.minuto);
        goles.visita.sort((a, b) => a.minuto - b.minuto);
    
        return goles;
    };
    
    const golesNube = procesarGoles(bdIncidencias);
    
    useEffect(() => {
        getZonas()
            .then((data) => {
                const zonaCorrecta = data.find(z => z.id_zona === partido?.id_zona); // Usamos find en vez de filter para obtener un objeto
                setZona(zonaCorrecta || null); // Si no hay coincidencia, seteamos null
            })
            .catch((error) => console.error('Error fetching zonas:', error));
    }, [partido?.id_zona]);
    

    if (!partido) {
        return <div>Loading...</div>;
    }

    const hourFormated = formatTime(partido.hora);

    return (
        <CardPartidoWrapper>
            <CardPartidoTitles>
                {zona?.tipo_zona === 'eliminacion-directa-ida-vuelta' && (
                    <h3 className="ida-vuelta">{renderizarTituloPartido(partido, zona) || "Sin título disponible"}</h3>
                )}
                <h3>{`${partido.nombre_categoria} - ${partido.nombre_edicion}`}</h3>
                <p>
                    {`${partido.dia_nombre || "Día desconocido"} ${partido.dia_numero}/${partido.mes}`} - {zona?.nombre_zona || `Fecha ${partido.jornada}`} - {partido.cancha || "Cancha desconocida"}
                </p>
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                    <h4>{nombresEquipos(partido.id_equipoLocal)}</h4>
                </CardPartidoTeam>
                <CardPartidoInfo>
                    {
                        estadoPartido === 'C' && (
                            <WatchContainer>
                                <MdOutlineWatchLater />
                            </WatchContainer>
                        )
                    }
                    <h4>
                        {
                            partido.estado === 'P' 
                            ? <h4>{hourFormated}</h4>
                            : (
                                <>
                                    {partido.pen_local && <span className='penales'>({partido.pen_local})</span>}
                                    {golesNube.local.length}-{golesNube.visita.length}
                                    {partido.pen_visita && <span className='penales'>({partido.pen_visita})</span>}
                                </>
                            )
                        }
                    </h4>
                    {estadoPartido === 'P' ? (
                        <span>Programado</span>
                    ) : estadoPartido === 'T' || estadoPartido === 'F' ? (
                        <span>Final</span>
                    ) : partido.estado === 'S' || estadoPartido === 'A'? (
                        <span>Suspendido</span>
                    ) : (
                        <span>En curso</span>
                    )}
                </CardPartidoInfo>
                <CardPartidoTeam>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                    <h4>{nombresEquipos(partido.id_equipoVisita)}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
                {partido.estado === 'S' ? (
                    <h5>{partido.descripcion && <p>{partido.descripcion}</p>}</h5>
                ) : partido.estado === 'A' ? (
                    <h5>Partido postergado</h5>
                ) : (
                    <>
                        <CardPartidoGoalsColumn>
                            {golesNube.local.length > 0 ? (
                                golesNube.local.map((gol, index) => (
                                    <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                                ))
                            ) : (
                                <h5></h5>
                            )}
                        </CardPartidoGoalsColumn>
                        <HiLifebuoy />
                        <CardPartidoGoalsColumn className='visita'>
                            {golesNube.visita.length > 0 ? (
                                golesNube.visita.map((gol, index) => (
                                    <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                                ))
                            ) : (
                                <h5></h5>
                            )}
                        </CardPartidoGoalsColumn>
                    </>
                )}
            </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
