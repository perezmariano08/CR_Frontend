import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { URLImages } from '../../../utils/utils';

const CardFinalPartido = ({ idPartido, incidencias }) => {
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === idPartido);
    const match = useSelector((state) => state.match);
    const matchCorrecto = match.find(p => p.ID === idPartido);
    const equipos = useSelector((state) => state.equipos.data);

    //SACAR
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo.img !== null ? equipo.img : '/uploads/Equipos/team-default.png';
    };

    //SACAR
    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : 'Unknown Team';
    };

    // Manejo local de goles
    const [localGoals, setLocalGoals] = useState([]);
    const [visitGoals, setVisitGoals] = useState([]);

    //SACAR
    useEffect(() => {
        if (partido?.estado !== 'F' && matchCorrecto) {
            const local = [];
            const visitante = [];

            // Procesamos goles para el equipo local
            matchCorrecto?.Local.Player.forEach(player => {
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
            matchCorrecto?.Visitante.Player.forEach(player => {
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
    // !SACAR
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
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombreEquipos(partido.id_equipoLocal)} />
                    <h4>{nombreEquipos(partido.id_equipoLocal)}</h4>
                </CardPartidoTeam>
                <CardPartidoInfo>
                    {
                        partido.estado === 'F' ? (
                            <h4>{partido.goles_local}-{partido.goles_visita}</h4>
                        ) : (   
                            <h4>{localGoals.length}-{visitGoals.length}</h4>
                        )
                    }
                    {matchCorrecto?.matchState === null && partido.estado === 'P' ? (
                        <span>Por comenzar</span>
                    ) : matchCorrecto?.matchState === 'isStarted' ? (
                        <span>En curso</span>
                    ) : partido.estado === 'F' &&(
                        <span>Final</span>
                    )}
                </CardPartidoInfo>
                <CardPartidoTeam>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombreEquipos(partido.id_equipoVisita)} />
                    <h4>{nombreEquipos(partido.id_equipoVisita)}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
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
            </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
