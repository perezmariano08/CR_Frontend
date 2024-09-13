import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';

const CardFinalPartido = ({ idPartido, incidencias }) => {
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === idPartido);
    const match = useSelector((state) => state.match);
    const matchCorrecto = match.find(p => p.ID === idPartido);
    const equipos = useSelector((state) => state.equipos.data);

    const { nombresEquipos, escudosEquipos } = useEquipos();

    // Manejo local de goles
    const [localGoals, setLocalGoals] = useState([]);
    const [visitGoals, setVisitGoals] = useState([]);

    useEffect(() => {
        if (partido?.estado !== 'F' && matchCorrecto) {
            const local = [];
            const visitante = [];

            // Procesamos goles para el equipo local
            matchCorrecto?.Local.Player?.forEach(player => {
                if (player.Actions) {
                    player.Actions.forEach(action => {
                        if (action.Type === 'Gol') {
                            const gol = {
                                minuto: parseInt(action.Time, 10), // Convertir Time a número
                                nombre: player.Nombre,
                                penal: action.Detail.penal === 'si',
                                enContra: action.Detail.enContra === 'si'
                            };
                            if (action.Detail.enContra === 'si') {
                                visitante.push(gol);
                            } else {
                                local.push(gol);
                            }
                        }
                    });
                }
            });

            // Procesamos goles para el equipo visitante
            matchCorrecto?.Visitante.Player?.forEach(player => {
                if (player.Actions) {
                    player.Actions.forEach(action => {
                        if (action.Type === 'Gol') {
                            const gol = {
                                minuto: parseInt(action.Time, 10), // Convertir Time a número
                                nombre: player.Nombre,
                                penal: action.Detail.penal === 'si',
                                enContra: action.Detail.enContra === 'si'
                            };
                            if (action.Detail.enContra === 'si') {
                                local.push(gol);
                            } else {
                                visitante.push(gol);
                            }
                        }
                    });
                }
            });

            // Ordenar goles por minuto
            setLocalGoals(local.sort((a, b) => a.minuto - b.minuto));
            setVisitGoals(visitante.sort((a, b) => a.minuto - b.minuto));
        }
    }, [matchCorrecto, partido]);

    // Manejo en la nube de goles
    const procesarGoles = (incidencias) => {
        if (!incidencias || !partido) return { local: [], visita: [] };

        const goles = {
            local: [],
            visita: []
        };

        incidencias.forEach((incidencia) => {
            if (incidencia.tipo === 'Gol') {
                const gol = {
                    minuto: parseInt(incidencia.minuto, 10),
                    id_jugador: incidencia.id_jugador,
                    nombre: incidencia.nombre,
                    apellido: incidencia.apellido,
                    penal: incidencia.penal === 'S',
                    enContra: incidencia.en_contra === 'S'
                };

                if (incidencia.id_equipo === partido.id_equipoLocal) {
                    if (gol.enContra) {
                        goles.visita.push(gol)
                    } else {
                        goles.local.push(gol);
                    }
                } else if (incidencia.id_equipo === partido.id_equipoVisita) {
                    if (gol.enContra) {
                        goles.local.push(gol)
                    } else {
                        goles.visita.push(gol);
                    }
                } 
            }
        });

        // Ordenar goles por minuto
        goles.local.sort((a, b) => a.minuto - b.minuto);
        goles.visita.sort((a, b) => a.minuto - b.minuto);

        return goles;
    };

    const golesNube = procesarGoles(incidencias);
    
    if (!partido) {
        return <div>Loading...</div>;
    }

    return (
        <CardPartidoWrapper>
            <CardPartidoTitles>
                <h3>{`${partido.nombre_categoria} - ${partido.nombre_edicion}`}</h3>
                <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`} | {`Fecha ${partido.jornada} - ${partido.cancha}`}</p>
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                    <h4>{nombresEquipos(partido.id_equipoLocal)}</h4>
                </CardPartidoTeam>
                <CardPartidoInfo>
                    {
                        partido.estado === 'F' || partido.estado === 'S' ? (
                            <h4>{partido.goles_local}-{partido.goles_visita}</h4>
                        ) : (   
                            <h4>{localGoals.length}-{visitGoals.length}</h4>
                        )
                    }
                    {matchCorrecto?.matchState === null && partido.estado === 'P' ? (
                        <span>Por comenzar</span>
                    ) : matchCorrecto?.matchState === 'isStarted' ? (
                        <span>En curso</span>
                    ) : partido.estado === 'F' ? (
                        <span>Final</span>
                    ) : partido.estado === 'S' && (
                        <span>Suspendido</span>
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
            ) : partido.estado === 'A' ? ( // Nueva condición para el estado 'A'
                <h5>Partido postergado</h5> // Mostrar mensaje de partido postergado
            ) : (
                <>
                    <CardPartidoGoalsColumn>
                        {partido.estado !== 'F' && localGoals.length > 0 ? (
                            localGoals.map((gol, index) => (
                                <h5 key={index}>{gol.nombre} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                            ))
                        ) : (
                            golesNube.local.length > 0 ? (
                                golesNube.local.map((gol, index) => (
                                    <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                                ))
                            ) : (
                                <h5></h5>
                            )
                        )}
                    </CardPartidoGoalsColumn>
                    <HiLifebuoy />
                    <CardPartidoGoalsColumn className='visita'>
                        {partido.estado !== 'F' && visitGoals.length > 0 ? (
                            visitGoals.map((gol, index) => (
                                <h5 key={index}>{gol.nombre} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                            ))
                        ) : (
                            golesNube.visita.length > 0 ? (
                                golesNube.visita.map((gol, index) => (
                                    <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                                ))
                            ) : (
                                <h5></h5>
                            )
                        )}
                    </CardPartidoGoalsColumn>
                </>
            )}
        </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
