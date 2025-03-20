import React, { useState, useEffect } from 'react';
import {
    CardPartidoGenericoWrapper,
    CardPartidoGenericoDivisor,
    CardPartidoGenericoEquipo,
    CardPartidoGenericoEquipoDetalle,
    CardPartidoGenericoEquipos,
    CardPartidoGenericoEstadisticas,
    CardPartidoGenericoGoles,
    CardPartidoGenericoPenales,
    CardPartidoGenericoResultado,
    CardPartidoGenericoRojas,
    CardPartidoGenericoEquipoLink,
} from './CardPartidosGenericoStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { useSelector } from 'react-redux';
import { formatearDiaSinAño, formatHour } from '../../../utils/formatDateTime';
import CardPartidoGenericoLoader from './CardPartidoGenericoLoader';
import { useAuth } from '../../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const CardPartidoGenerico = ({
    id_partido,
    id_equipoLocal,
    id_equipoVisita,
    goles_local,
    goles_visita,
    estado,
    pen_local,
    pen_visita,
    dia,
    miEquipo,
    hora,
}) => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { userRole } = useAuth();


    const [loading, setLoading] = useState(true);
    const { escudosEquipos, nombresEquipos } = useEquipos();

    // Expulsados
    const expulsados = useSelector((state) => state.expulsados.data);
    const expulsadosPartido = expulsados.filter((e) => e.id_partido == id_partido)

    // Fecha actual
    const hoy = new Date().toISOString().split('T')[0];
    const partidoDia = new Date(dia).toISOString().split('T')[0];

    const esHoy = partidoDia == hoy;

    // Simula la carga de datos
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <CardPartidoGenericoLoader />
        );
    }
    
    const rutaPartido = token ? `/planillero/planilla?id=${id_partido}` : `/stats-match?id=${id_partido}`;

    return (
        <CardPartidoGenericoWrapper to={rutaPartido}>
            {(estado === "F" || estado === "T") && (
                <CardPartidoGenericoResultado className="finalizado">
                    final
                    {!esHoy && <span>{formatearDiaSinAño(dia)}</span>}
                </CardPartidoGenericoResultado>
            )}

            {estado === "C" && (
                <CardPartidoGenericoResultado className="en-juego">
                    en juego
                    <span className="vivo"></span>
                </CardPartidoGenericoResultado>
            )}

            {estado === "P" && (
                <CardPartidoGenericoResultado className="programado">
                    {!esHoy && <span>{formatearDiaSinAño(dia)}</span>}
                    {hora === "00:00:00" ? <span>a conf.</span> : formatHour(hora)}
                </CardPartidoGenericoResultado>
            )}

            {estado === "A" && (
                <CardPartidoGenericoResultado className="postergado">
                    post.
                </CardPartidoGenericoResultado>
            )}

            {estado === "S" && (
                <CardPartidoGenericoResultado className="suspendido">
                    susp.
                </CardPartidoGenericoResultado>
            )}

            <CardPartidoGenericoDivisor />
            <CardPartidoGenericoEquipos>
                <CardPartidoGenericoEquipo>
                    <CardPartidoGenericoEquipoDetalle>
                        <img
                            src={`https://coparelampago.com${escudosEquipos(
                                id_equipoLocal
                            )}`}
                            alt={nombresEquipos(id_equipoLocal)}
                        />
                        <CardPartidoGenericoEquipoLink
                            to={!userRole ? `/equipos/${id_equipoLocal}` : '#'}
                            onClick={(e) => {
                                if (userRole) {
                                    e.preventDefault();
                                } else {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            <p className={+miEquipo === +id_equipoLocal ? "my-team" : undefined}>
                                {nombresEquipos(id_equipoLocal)}
                            </p>
                        </CardPartidoGenericoEquipoLink>
                    </CardPartidoGenericoEquipoDetalle>
                    <CardPartidoGenericoEstadisticas>
                        <CardPartidoGenericoRojas>
                            {expulsadosPartido
                                .filter((e) => e.id_equipo == id_equipoLocal)
                                .map((e) => (
                                    <div title="Roja" />
                                ))}
                        </CardPartidoGenericoRojas>
                        <CardPartidoGenericoGoles>
                            {estado === "P" ? "-" : goles_local}
                            {pen_local && (
                                <CardPartidoGenericoPenales>
                                    ({pen_local})
                                </CardPartidoGenericoPenales>
                            )}
                        </CardPartidoGenericoGoles>
                    </CardPartidoGenericoEstadisticas>
                </CardPartidoGenericoEquipo>
                <CardPartidoGenericoEquipo>
                    <CardPartidoGenericoEquipoDetalle>
                        <img
                            src={`https://coparelampago.com${escudosEquipos(
                                id_equipoVisita
                            )}`}
                            alt={nombresEquipos(id_equipoVisita)}
                        />
                        <CardPartidoGenericoEquipoLink
                            to={!userRole ? `/equipos/${id_equipoVisita}` : '#'}
                            onClick={(e) => {
                                if (userRole) {
                                    e.preventDefault();
                                } else {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            <p className={+miEquipo === +id_equipoVisita ? "my-team" : undefined}>
                                {nombresEquipos(id_equipoVisita)}
                            </p>
                        </CardPartidoGenericoEquipoLink>
                    </CardPartidoGenericoEquipoDetalle>
                    <CardPartidoGenericoEstadisticas>
                        <CardPartidoGenericoRojas>
                            {expulsadosPartido
                                .filter((e) => e.id_equipo == id_equipoVisita)
                                .map((e) => (
                                    <div title="Roja" />
                                ))}
                        </CardPartidoGenericoRojas>
                        <CardPartidoGenericoGoles>
                            {estado === "P" ? "-" : goles_visita}
                            {pen_visita && (
                                <CardPartidoGenericoPenales>
                                    ({pen_visita})
                                </CardPartidoGenericoPenales>
                            )}
                        </CardPartidoGenericoGoles>
                    </CardPartidoGenericoEstadisticas>
                </CardPartidoGenericoEquipo>
            </CardPartidoGenericoEquipos>
        </CardPartidoGenericoWrapper>
    );
};

export default CardPartidoGenerico;
