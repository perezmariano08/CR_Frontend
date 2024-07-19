import React, { useEffect, useState } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoStats, CardPartidoDivider } from './CardPartidoStyles';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIdMatch } from '../../../redux/Planillero/planilleroSlice.js';

const CardPartido = ({ finished, observer, partido }) => {
    const equipos = useSelector((state) => state.equipos.data);
    const matches = useSelector((state) => state.match);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const match = matches.find(p => p.ID === partido.id_partido);

    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : null;
    };

    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : null;
    };

    const handlePlanillarClick = (e) => {
        e.preventDefault();
        dispatch(toggleIdMatch(partido.id_partido));
        navigate(`/planillero/planilla?id=${partido.id_partido}`);
    };

    const [goalLocal, setGoalLocal] = useState(0);
    const [goalVisit, setGoalVisit] = useState(0);

    useEffect(() => {
        if (match) {
            const golesLocal = match.Local.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));
            const golesVisita = match.Visitante.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));

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
        }
    }, [match]);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <CardPartidoWrapper> 
            <CardPartidoTitles>
                <h3>{`${partido.division} - ${partido.torneo} ${partido.año}`}</h3>
                {finished ? (
                    <p>{partido.dia} | Fecha {partido.jornada} - Cancha {partido.cancha}</p>
                ) : (
                    <p>Fecha {partido.jornada} - {partido.cancha}</p>
                )}
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img src={`/Escudos/${escudosEquipos(partido.id_equipoLocal)}`} alt={`${nombreEquipos(partido.id_equipoLocal)}`} />
                    <h4>{`${nombreEquipos(partido.id_equipoLocal)}`}</h4>
                </CardPartidoTeam>

                <CardPartidoInfo>
                    {finished ? (
                        <>
                            <h4>{goalLocal}-{goalVisit}</h4>
                            <span>Final</span>
                        </>
                    ) : match ? (
                        match.matchState === 'isStarted' ? (
                            <>
                                <h4>{goalLocal}-{goalVisit}</h4>
                                <span>En curso</span>
                            </>
                        ) : partido.estado === 'F' ? (
                            <>
                                <h4>{partido.goles_local}-{partido.goles_visita}</h4>
                                <span>Final</span>
                            </>
                        
                        ) : match.matchState === 'isFinish' || match.matchState === 'matchPush' ? (
                            <>
                                <h4>{goalLocal}-{goalVisit}</h4>
                                <span>Final</span>
                            </>
                        ) : (
                            <>
                                <h5>{formatTime(partido.hora)}</h5>
                                <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`}</p>
                            </>
                        )
                    ) : (
                        <>
                            <h5>{formatTime(partido.hora)}</h5>
                            <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`}</p>
                        </>
                    )}
                </CardPartidoInfo>

                <CardPartidoTeam>
                    <img src={`/Escudos/${escudosEquipos(partido.id_equipoVisita)}`} alt={`${nombreEquipos(partido.id_equipoVisita)}`} />
                    <h4>{`${nombreEquipos(partido.id_equipoVisita)}`}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            {finished || (match && match.matchState === 'matchPush') ? (
                <>
                    <CardPartidoDivider/>
                    <CardPartidoStats>
                        <NavLink 
                            to={`/planillero/planilla?id=${partido.id_partido}`}
                            onClick={handlePlanillarClick}
                        >
                            Ver planilla del partido
                        </NavLink>
                    </CardPartidoStats>
                </>
            ) : observer && (
                <>
                    <CardPartidoDivider/>
                    <CardPartidoStats>
                        <NavLink 
                            to={`/planillero/planilla?id=${partido.id_partido}`}
                            onClick={handlePlanillarClick}
                        >
                            Ir a planillar partido
                        </NavLink>
                    </CardPartidoStats>
                </>
            )}
        </CardPartidoWrapper>
    );
}

export default CardPartido;
