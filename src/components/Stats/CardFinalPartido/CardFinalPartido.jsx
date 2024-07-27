import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { URL } from '../../../utils/utils';

const CardFinalPartido = ({ idPartido, incidencias }) => {
    const matches = useSelector((state) => state.match);
    const match = matches.find(p => p.ID === idPartido);
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === idPartido);

    const equipos = useSelector((state) => state.equipos.data);

    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : '/default-image.png';
    };

    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : 'Unknown Team';
    };

    // Manejo local de goles
    const [goalLocal, setGoalLocal] = useState(0);
    const [goalVisit, setGoalVisit] = useState(0);

    const golesLocal = match.Local.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));
    const golesVisita = match.Visitante.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));

    useEffect(() => {
        let localGoals = 0;
        let visitGoals = 0;

        if (partido.estado === 'F') {
            setGoalLocal(partido.goles_local);
            setGoalVisit(partido.goles_visita);
        } else {
            golesLocal.forEach(player => {
                player.Actions.forEach(action => {
                    if (action.Type === 'Gol') {
                        if (action.Detail.enContra === 'si') {
                            visitGoals += 1;
                        } else {
                            localGoals += 1;
                        }
                    }
                });
            });

            golesVisita.forEach(player => {
                player.Actions.forEach(action => {
                    if (action.Type === 'Gol') {
                        if (action.Detail.enContra === 'si') {
                            localGoals += 1;
                        } else {
                            visitGoals += 1;
                        }
                    }
                });
            });

            setGoalLocal(localGoals);
            setGoalVisit(visitGoals);
        }
    }, [golesLocal, golesVisita]);

    // Manejo en la nube de goles
    const procesarGoles = (incidencias) => {
        if (!incidencias) return { local: [], visita: [] };
    
        const goles = {
            local: [],
            visita: []
        };
    
        incidencias.forEach((incidencia) => {
            if (incidencia.tipo === 'Gol') {
                const gol = {
                    id_jugador: incidencia.id_jugador,
                    nombre: incidencia.nombre,
                    apellido: incidencia.apellido,
                    penal: incidencia.penal // Asegúrate de que este campo esté incluido si es relevante
                };
    
                if (incidencia.id_equipo === partido.id_equipoLocal) {
                    goles.local.push(gol);
                } else if (incidencia.id_equipo === partido.id_equipoVisita) {
                    goles.visita.push(gol);
                }
            }
        });
    
        return goles;
    };

    const goles = procesarGoles(incidencias); 
    
    return (
        <CardPartidoWrapper>
            <CardPartidoTitles>
                <h3>{`${partido.division} - ${partido.torneo} ${partido.año}`}</h3>
                <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`} | {`Fecha ${partido.jornada} - ${partido.cancha}`}</p>
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img src={`${URL}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombreEquipos(partido.id_equipoLocal)} />
                    <h4>{nombreEquipos(partido.id_equipoLocal)}</h4>
                </CardPartidoTeam>
                <CardPartidoInfo>
                    {
                        partido.estado === 'F' ? (
                            <h4>{partido.goles_local}-{partido.goles_visita}</h4>
                        ) : (   
                            <h4>{goalLocal}-{goalVisit}</h4>
                        )
                    }
                    {match.matchState === null && partido.estado === 'P' ? (
                        <span>Por comenzar</span>
                    ) : match.matchState === 'isStarted' ? (
                        <span>En curso</span>
                    ) : partido.estado === 'F' &&(
                        <span>Final</span>
                    )}
                </CardPartidoInfo>
                <CardPartidoTeam>
                    <img src={`${URL}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombreEquipos(partido.id_equipoVisita)} />
                    <h4>{nombreEquipos(partido.id_equipoVisita)}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
                <CardPartidoGoalsColumn>
                    {partido.estado === 'F' && goles.local.length > 0 ? (
                        goles.local.map((gol, index) => (
                            <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal === 'si' ? '(p)' : null}</h5>
                        ))
                    ) : (
                        <h5></h5>
                    )}
                </CardPartidoGoalsColumn>
                <CardPartidoGoalsColumn>
                    <HiLifebuoy />
                </CardPartidoGoalsColumn>
                <CardPartidoGoalsColumn>
                    {partido.estado === 'F' && goles.visita.length > 0 ? (
                        goles.visita.map((gol, index) => (
                            <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal === 'si' ? '(p)' : null}</h5>
                        ))
                    ) : (
                        <h5></h5>
                    )}
                </CardPartidoGoalsColumn>
            </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
