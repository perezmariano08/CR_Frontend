import React from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoStats, CardPartidoDivider } from './CardPartidoStyles';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const CardPartido = ({ finished, observer, partido }) => {
    const equipos = useSelector((state) => state.equipos.data)

    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : null;
    };

    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : null;
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
                            <h4>{partido.goles_local}-{partido.goles_visita}</h4>
                            <span>Final</span>
                        </>
                    ) : (
                        <>
                            <h5>{partido.hora}</h5>
                            <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`}</p>
                        </>
                    )}
                </CardPartidoInfo>

                <CardPartidoTeam>
                    <img src={`/Escudos/${escudosEquipos(partido.id_equipoVisita)}`} alt={`${nombreEquipos(partido.id_equipoVisita)}`} />
                    <h4>{`${nombreEquipos(partido.id_equipoVisita)}`}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            {finished ? (
                <>
                    <CardPartidoDivider/>
                    <CardPartidoStats>
                        <NavLink to="/stats-match">Ver estadísticas completas</NavLink>
                    </CardPartidoStats>
                </>
            ) : (
                observer && (
                    <>
                        <CardPartidoDivider/>
                        <CardPartidoStats>
                        <NavLink 
                            to={`/planillero/planilla?id=${partido.id_partido}`}
                        >
                            Ir a planillar partido
                        </NavLink>
                        </CardPartidoStats>
                    </>
                )
            )}
        </CardPartidoWrapper>
    );
}

export default CardPartido;
