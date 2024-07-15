import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';

const CardFinalPartido = ({ idPartido }) => {
    // Lógica manejo estado partido
    const matches = useSelector((state) => state.match);
    const match = matches.find(p => p.ID === idPartido);

    // Traer partidos
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === idPartido);
    
    // Traer equipos
    const equipos = useSelector((state) => state.equipos.data);
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : null;
    };

    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : null;
    };

    // Lógica conteo goles
    const [goalLocal, setGoalLocal] = useState(0);
    const [goalVisit, setGoalVisit] = useState(0);

    const golesLocal = match.Local.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));
    const golesVisita = match.Visitante.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));

    useEffect(() => {
        let localGoals = 0;
        let visitGoals = 0;

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
    }, [golesLocal, golesVisita]);

    return (
        <CardPartidoWrapper>
            <CardPartidoTitles>
                <h3>{`${partido.division} - ${partido.torneo} ${partido.año}`}</h3>
                <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`} | {`Fecha ${partido.jornada} - ${partido.cancha}`}</p>
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img src={`/Escudos/${escudosEquipos(partido.id_equipoLocal)}`} alt={`${nombreEquipos(partido.id_equipoLocal)}`} />
                    <h4>{`${nombreEquipos(partido.id_equipoLocal)}`}</h4>
                </CardPartidoTeam>
                <CardPartidoInfo>
                    <h4>{goalLocal}-{goalVisit}</h4>
                    {match.matchState === null ? (
                        <span>Por comenzar</span>
                    ) : match.matchState === 'isStarted' ? (
                        <span>En curso</span>
                    ) : (
                        <span>Final</span>
                    )}
                </CardPartidoInfo>
                <CardPartidoTeam>
                    <img src={`/Escudos/${escudosEquipos(partido.id_equipoVisita)}`} alt={`${nombreEquipos(partido.id_equipoVisita)}`} />
                    <h4>{`${nombreEquipos(partido.id_equipoVisita)}`}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
                <CardPartidoGoalsColumn>
                    {golesLocal.map((player, index) => (
                        player.Actions.map((action, idx) => (
                            action.Type === 'Gol' && (
                                <h5 key={idx}>{player.Nombre} {action.Detail.penal === 'si' ? '(p)' : null} {action.Detail.enContra === 'si' ? '(ec)' : null}</h5>
                            )
                        ))
                    ))}
                </CardPartidoGoalsColumn>
                <CardPartidoGoalsColumn>
                    <HiLifebuoy />
                </CardPartidoGoalsColumn>
                <CardPartidoGoalsColumn>
                    {golesVisita.map((player, index) => (
                        player.Actions.map((action, idx) => (
                            action.Type === 'Gol' && (
                                <h5 key={idx}>{player.Nombre} {action.Detail.penal === 'si' ? '(p)' : null} {action.Detail.enContra === 'si' ? '(ec)' : null}</h5>
                            )
                        ))
                    ))}
                </CardPartidoGoalsColumn>
            </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
