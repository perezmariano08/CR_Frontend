import React, { useEffect, useState } from 'react';
import { CardUltimoPartidoDescripcion, CardUltimoPartidoDetalle, CardUltimoPartidoDiaJornada, CardUltimoPartidoEquipoLink, CardUltimoPartidoEquipos, CardUltimoPartidoInfo, CardUltimoPartidoLink, CardUltimoPartidoPenales, CardUltimoPartidoResultado, CardUltimoPartidoResultadoVivo, CardUltimoPartidoWrapper } from './CardUltimoPartidoStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { formatearFecha, formatHour } from '../../../utils/formatDateTime';
import { NavLink } from 'react-router-dom';
import CardUltimoPartidoLoader from './CardUltimoPartidoLoader';

const CardUltimoPartido = ({ miEquipo, estado, id_partido, nombre_edicion, dia, id_equipoLocal, id_equipoVisita, jornada, goles_local, goles_visita, pen_local, pen_visita, hora}) => {

    const rutaPartido = `/stats-match?id=${id_partido}`;
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <CardUltimoPartidoLoader/>
        );
    }

    return (
        <CardUltimoPartidoWrapper>
            <CardUltimoPartidoInfo>
                {/* Mostrar el escudo del equipo contrario dependiendo de si soy el local o visitante */}
                {
                    miEquipo === id_equipoLocal
                        ? <img src={`https://coparelampago.com/${escudosEquipos(id_equipoVisita)}`} alt="Escudo equipo visitante" />
                        : <img src={`https://coparelampago.com/${escudosEquipos(id_equipoLocal)}`} alt="Escudo equipo local" />
                }

                {/* Solo mostrar el detalle del partido si ya está cargado */}
                <CardUltimoPartidoDetalle>
                    <CardUltimoPartidoDescripcion>
                        <CardUltimoPartidoDiaJornada>
                            <p>{formatearFecha(dia)} - {hora === "00:00:00" || !hora ? 'a conf.'  : formatHour(hora)}</p>
                            <p className='jornada'>fecha {jornada} - {nombre_edicion}</p>
                        </CardUltimoPartidoDiaJornada>
                        <CardUltimoPartidoEquipos>
                            <CardUltimoPartidoEquipoLink to={`/equipos/${id_equipoLocal}`}>
                                <p className={miEquipo === id_equipoLocal ? 'my-team' : ''}>{nombresEquipos(id_equipoLocal)}</p>
                            </CardUltimoPartidoEquipoLink>
                            <CardUltimoPartidoEquipoLink to={`/equipos/${id_equipoVisita}`}>
                                <p className={miEquipo === id_equipoVisita ? 'my-team' : ''}>{nombresEquipos(id_equipoVisita)}</p>
                            </CardUltimoPartidoEquipoLink>
                        </CardUltimoPartidoEquipos>
                    </CardUltimoPartidoDescripcion>
                    {/* {
                        estado === "C" && (
                            <div>
                                
                            </div>
                        )
                    } */}
                    {/* Mostrar el resultado del partido si ya está cargado */}
                    <CardUltimoPartidoResultado>
                        {
                            estado === "C" && (
                            <CardUltimoPartidoResultadoVivo>
                                en juego
                                <span className='vivo'></span>
                            </CardUltimoPartidoResultadoVivo>
                            )
                        }
                        {goles_local} - {goles_visita}
                        {pen_local && <CardUltimoPartidoPenales>
                            ({pen_local} - {pen_visita})
                        </CardUltimoPartidoPenales>}
                    </CardUltimoPartidoResultado>
                </CardUltimoPartidoDetalle>
            </CardUltimoPartidoInfo>
            <CardUltimoPartidoLink>
                <NavLink
                    to={rutaPartido}
                >
                    Ver planilla del partido
                </NavLink>
            </CardUltimoPartidoLink>
        </CardUltimoPartidoWrapper>
    );
};

export default CardUltimoPartido;
