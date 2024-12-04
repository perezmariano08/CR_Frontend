import React, { useEffect, useState } from 'react';
import { CardUltimoPartidoDescripcion, CardUltimoPartidoDetalle, CardUltimoPartidoDiaJornada, CardUltimoPartidoEquipos, CardUltimoPartidoInfo, CardUltimoPartidoLink, CardUltimoPartidoPenales, CardUltimoPartidoResultado, CardUltimoPartidoWrapper } from './CardUltimoPartidoStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { formatearFecha, formatHour } from '../../../utils/formatDateTime';
import { Skeleton } from 'primereact/skeleton';
import { NavLink } from 'react-router-dom';

const CardUltimoPartido = ({ miEquipo, id_partido, nombre_edicion, dia, id_equipoLocal, id_equipoVisita, jornada, goles_local, goles_visita, pen_local, pen_visita, hora}) => {
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const [loading, setLoading] = useState(true);

    // Detectar cambios en miEquipo y reiniciar la carga
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simular el tiempo de carga
        return () => clearTimeout(timer);
    }, []); // Dependemos de 'miEquipo' para resetear el estado de carga

    // Si está cargando, mostramos el Skeleton
    if (loading) {
        return (
            <CardUltimoPartidoWrapper>
                <CardUltimoPartidoInfo>
                    <Skeleton shape="circle" size="58px" />
                    <CardUltimoPartidoDetalle>
                        <CardUltimoPartidoDescripcion>
                            <CardUltimoPartidoDiaJornada>
                                <Skeleton width="50px" height="12px" />
                                <Skeleton width="130px" height="12px" />
                            </CardUltimoPartidoDiaJornada>
                            <CardUltimoPartidoEquipos style={{ gap: '5px' }}>
                                <Skeleton width="150px" height="22px" />
                                <Skeleton width="150px" height="22px" />
                            </CardUltimoPartidoEquipos>
                        </CardUltimoPartidoDescripcion>
                        <Skeleton width="80px" height="40px" />
                    </CardUltimoPartidoDetalle>
                </CardUltimoPartidoInfo>
            </CardUltimoPartidoWrapper>
        );
    }

    // Si no está cargando, mostramos los datos reales
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
                            <p className={miEquipo === id_equipoLocal ? 'my-team' : ''}>{nombresEquipos(id_equipoLocal)}</p>
                            <p className={miEquipo === id_equipoVisita ? 'my-team' : ''}>{nombresEquipos(id_equipoVisita)}</p>
                        </CardUltimoPartidoEquipos>
                    </CardUltimoPartidoDescripcion>

                    {/* Mostrar el resultado del partido si ya está cargado */}
                    <CardUltimoPartidoResultado>
                        {goles_local} - {goles_visita}
                        {pen_local || pen_visita && <CardUltimoPartidoPenales>
                            ({pen_local} - {pen_visita})
                        </CardUltimoPartidoPenales>}
                    </CardUltimoPartidoResultado>
                </CardUltimoPartidoDetalle>
            </CardUltimoPartidoInfo>
            <CardUltimoPartidoLink>
                <NavLink
                    to={`/stats-match?id=${id_partido}`}
                >
                    Ver planilla del partido
                </NavLink>
            </CardUltimoPartidoLink>
        </CardUltimoPartidoWrapper>
    );
};

export default CardUltimoPartido;
