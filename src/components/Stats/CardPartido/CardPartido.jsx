import React, { useEffect, useState } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoStats, CardPartidoDivider } from './CardPartidoStyles';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIdMatch } from '../../../redux/Planillero/planilleroSlice.js';
import { URLImages } from '../../../utils/utils.js';
import { getZonas } from '../../../utils/dataFetchers.js';
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam.js';
import { useAuth } from '../../../Auth/AuthContext.jsx';

const CardPartido = ({ partido, rol }) => {
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const matches = useSelector((state) => state.match);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const match = matches.find(p => p.ID === partido.id_partido);

    const [zona, setZona] = useState([]);

    const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams([partido.id_equipoLocal, partido.id_equipoVisita]);

    useEffect(() => {
        getZonas()
            .then((data) => {
                const zonaCorrecta = data.filter(z => z.id_zona === partido.id_zona);
                setZona(zonaCorrecta);
            })
            .catch((error) => console.error('Error fetching zonas:', error));
    }, [partido.id_zona]);

    const handlePlanillarClick = (e) => {
        e.preventDefault();
        dispatch(toggleIdMatch(partido.id_partido));
        navigate(`/planillero/planilla?id=${partido.id_partido}`);
    };

    const viewStatsOfTheMatch = (e) => {
        e.preventDefault();
        navigate(`/stats-match?id=${partido.id_partido}`);
    };

    const [goalLocal, setGoalLocal] = useState(0);
    const [goalVisit, setGoalVisit] = useState(0);

    useEffect(() => {
        if (match && match.Local && match.Local.Player && match.Visitante && match.Visitante.Player) {
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
        if (!time) return '00:00';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formattedDate = formatDate(partido.dia);
    const formattedTime = formatTime(partido.hora);

    const verPaginaEquipo = (idEquipo) => {
        navigate(`/my-team?idEquipo=${idEquipo}`);
    }
    
    return (
        <CardPartidoWrapper> 
            <CardPartidoTitles>                
                <h3>{`${partido.nombre_categoria} - ${partido.nombre_edicion}`}</h3>
                {partido.estado === 'F' ? (
                    <p>{formattedDate} {formattedTime} | Fecha {partido.jornada} - {partido.cancha}</p>
                ) : partido.estado === 'S' ? (
                    <p>{formattedDate} {formattedTime} | Partido suspendido</p>
                ) : partido.estado === 'P' ? (
                    <p>Fecha {partido.jornada} - {partido.cancha}</p>
                ) : (
                    <>
                        <p>{formattedDate}</p>
                    </>
                )}
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img 
                        src={`${URLImages}${getEscudoEquipo(partido.id_equipoLocal)}`} 
                        alt={`${getNombreEquipo(partido.id_equipoLocal)}`}
                        onClick={() => {verPaginaEquipo(partido.id_equipoLocal)}}
                    />
                    <h4 className={partido.id_equipoLocal === idMyTeam ? 'miEquipo' : ''}>{getNombreEquipo(partido.id_equipoLocal)}</h4>
                </CardPartidoTeam>

                <CardPartidoInfo>
                    {partido.estado === 'F' || partido.estado === 'S' || (match && (match.matchState === 'isStarted' || match.matchState === 'isFinish' || match.matchState === 'matchPush')) ? (
                        <>
                            <h4>{partido.estado === 'F' || partido.estado === 'S' ? `${partido.goles_local}-${partido.goles_visita}` : `${goalLocal}-${goalVisit}`}</h4>
                            <span>{partido.estado === 'F' ? 'Final' : partido.estado === 'S' ? 'Partido suspendido' : 'En curso'}</span>
                        </>
                    ) : partido.estado === 'A' ? (
                        <>
                            <h5>{formattedTime}</h5>
                            <p>Partido postergado</p>
                        </>
                    ) : (
                        <>
                            <h5>{formattedTime}</h5>
                            <p>{formattedDate}</p>
                        </>
                    )}
                </CardPartidoInfo>


                <CardPartidoTeam>
                    <img 
                        src={`${URLImages}${getEscudoEquipo(partido.id_equipoVisita)}`} 
                        alt={`${getNombreEquipo(partido.id_equipoVisita)}`}
                        onClick={() => {verPaginaEquipo(partido.id_equipoVisita)}}
                    />
                    <h4 className={partido.id_equipoVisita === idMyTeam ? 'miEquipo' : ''}>{getNombreEquipo(partido.id_equipoVisita)}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            {rol === 2 ? (
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
            ) : rol === 3 ? (
                <>
                    <CardPartidoDivider/>
                    <CardPartidoStats>
                        <NavLink 
                            to={`/planillero/planilla?id=${partido.id_partido}`}
                            onClick={viewStatsOfTheMatch}
                        >
                            Ver planilla del partido
                        </NavLink>
                    </CardPartidoStats>
                </>
            ) : null}
        </CardPartidoWrapper>
    );
}

export default CardPartido;
