import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import EscudoCelta from '/Escudos/celta-de-vino.png';
import EscudoPuraQuimica from '/Escudos/pura-quimica.png';
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';

const CardFinalPartido = ({ idPartido }) => {
    //Traer partidos
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === parseInt(idPartido));
    console.log(partido);
    
    //Traer equipos
    const equipos = useSelector((state) => state.equipos.data)
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : null;
    };

    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : null;
    };

    // Lógica conteo goles
    const actions = useSelector((state) => state.planillero.planilla.actions);
    const [goalLocal, setGoalLocal] = useState(0);
    const [goalVisit, setGoalVisit] = useState(0);

    useEffect(() => {
        let localGoals = 0;
        let visitGoals = 0;

        actions.forEach((action) => {
            if (action.isLocalTeam && action.accion === 'Gol') {
                localGoals++;
            } else if (!action.isLocalTeam && action.accion === 'Gol') {
                visitGoals++;
            }
        });

        setGoalLocal(localGoals);
        setGoalVisit(visitGoals);
    }, [actions]);

    // Lógica manejo estado partido
    const matchState = useSelector((state) => state.planillero.timeMatch.matchState);

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

                    {matchState === null ? (
                        <span>Por comenzar</span>
                    ) : matchState === 'isStarted' ? (
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
                {actions.map((action, index) => {

                    if (action.isLocalTeam && action.accion === 'Gol' && action.golDetails.penal === 'si') {
                        return (
                            <h5 key={index}>{action.nombreJugador} (p)</h5>
                        );
                    } else if (action.isLocalTeam && action.accion === 'Gol' && action.golDetails.enContra === 'si') {
                        return (
                            <h5 key={index}>{action.nombreJugador} (e.c)</h5>
                        );
                    }
                    if (action.isLocalTeam && action.accion === 'Gol') {
                        return (
                            <h5 key={index}>{action.nombreJugador}</h5>
                        );
                    } else {
                        return null;
                    }
                    })}
                </CardPartidoGoalsColumn>
                <CardPartidoGoalsColumn>
                    <HiLifebuoy />
                </CardPartidoGoalsColumn>
                <CardPartidoGoalsColumn className='visit'>
                    {actions.map((action, index) => {

                        if (!action.isLocalTeam && action.accion === 'Gol' && action.golDetails.penal === 'si') {
                            return (
                                <h5 key={index}>{action.nombreJugador} (p)</h5>
                            );
                        } else if (!action.isLocalTeam && action.accion === 'Gol' && action.golDetails.enContra === 'si') {
                            return (
                                <h5 key={index}>{action.nombreJugador} (e.c)</h5>
                            );
                        }
                        if (!action.isLocalTeam && action.accion === 'Gol') {
                            return (
                                <h5 key={index}>{action.nombreJugador}</h5>
                            );
                        } else {
                            return null;
                        }
                    })}
                </CardPartidoGoalsColumn>
            </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
