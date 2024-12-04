import React, { useEffect, useState } from 'react';
import { CardProximoPartidoWrapper, ProximoPartidoCancha, ProximoPartidoCuentaRegresivaDivisor, ProximoPartidoCuentaRegresivaItem, ProximoPartidoCuentaRegresivaWrapper, ProximoPartidoDescripcion, ProximoPartidoDetalle, ProximoPartidoDiaJornada, ProximoPartidoDivisor, ProximoPartidoEquipos, ProximoPartidoInfo } from './CardProximoPartidoStyles';
import { GiSoccerField } from "react-icons/gi";
import { useEquipos } from '../../../hooks/useEquipos';
import { formatearFecha, formatHour } from '../../../utils/formatDateTime';
import { Skeleton } from 'primereact/skeleton';

const CardProximoPartido = ({ miEquipo, id_partido, nombre_edicion, dia, hora, cancha, id_equipoLocal, id_equipoVisita, jornada, goles_local, goles_visita, pen_local, pen_visita }) => {
    const { escudosEquipos, nombresEquipos } = useEquipos();

    const [timeLeft, setTimeLeft] = useState({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
    });

    useEffect(() => {
        // Función para calcular el tiempo restante
        const calcularTiempoRestante = () => {
    
            // Validar que 'dia' y 'hora' estén definidos
            if (!dia || !hora) {
                return;
            }
    
            try {
                // Formatear la hora si no tiene el formato hh:mm:ss
                const horaFormateada = hora.includes(':') ? hora : `00:${hora}:00`;
    
                // Extraer solo la fecha en formato YYYY-MM-DD
                const soloFecha = dia.split("T")[0];
    
                // Combinar fecha y hora para formar un nuevo objeto Date
                const fechaHoraPartido = new Date(`${soloFecha}T${horaFormateada}Z`); // Hora en formato UTC
                const ahora = new Date(); // Fecha y hora actual
    
                // Convertir la hora UTC a hora local (sumando el desplazamiento de la zona horaria)
                const horaLocal = new Date(fechaHoraPartido.getTime() + fechaHoraPartido.getTimezoneOffset() * 60000);
    
                const diferencia = horaLocal - ahora;
    
                if (diferencia > 0) {
                    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
                    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
                    const segundos = Math.floor((diferencia / 1000) % 60);
    
                    setTimeLeft({
                        dias,
                        horas,
                        minutos,
                        segundos,
                    });
                } else {
                    setTimeLeft({
                        dias: 0,
                        horas: 0,
                        minutos: 0,
                        segundos: 0,
                    });
                }
            } catch (error) {
                console.error("Ocurrió un error al calcular el tiempo restante:", error);
            }
        };
    
        // Configurar el intervalo para que actualice cada segundo
        const timer = setInterval(calcularTiempoRestante, 1000);
    
        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(timer);
    }, [dia, hora]);

    // Simula la carga de datos
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Cambia según sea necesario
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <CardProximoPartidoWrapper>
                <ProximoPartidoInfo>
                    <Skeleton shape="circle" height='58px' width='58px'/>
                    <ProximoPartidoDetalle>
                        <ProximoPartidoDescripcion>
                            <ProximoPartidoEquipos style={{gap: '5px'}}>
                                <Skeleton width="150px" height="24px" />
                                <Skeleton width="150px" height="24px" />
                            </ProximoPartidoEquipos>
                            <ProximoPartidoDiaJornada style={{gap: '5px'}}>
                                <Skeleton width="120px" height="14px" />
                                <Skeleton width="120px" height="14px" />
                            </ProximoPartidoDiaJornada>
                        </ProximoPartidoDescripcion>
                        <ProximoPartidoCancha>
                            <GiSoccerField />
                            <Skeleton width="80px" height="14px" />
                        </ProximoPartidoCancha>
                    </ProximoPartidoDetalle>
                </ProximoPartidoInfo>
                <ProximoPartidoDivisor />
                <ProximoPartidoCuentaRegresivaWrapper>
                    <ProximoPartidoCuentaRegresivaItem>
                        <Skeleton width="50px" height="50px" />
                    </ProximoPartidoCuentaRegresivaItem>
                    <ProximoPartidoCuentaRegresivaDivisor>:</ProximoPartidoCuentaRegresivaDivisor>
                    <ProximoPartidoCuentaRegresivaItem >
                        <Skeleton width="50px" height="50px" />

                    </ProximoPartidoCuentaRegresivaItem>
                    <ProximoPartidoCuentaRegresivaDivisor>:</ProximoPartidoCuentaRegresivaDivisor>
                    <ProximoPartidoCuentaRegresivaItem >
                        <Skeleton width="50px" height="50px" />

                    </ProximoPartidoCuentaRegresivaItem>
                    <ProximoPartidoCuentaRegresivaDivisor>:</ProximoPartidoCuentaRegresivaDivisor>
                    <ProximoPartidoCuentaRegresivaItem>
                        <Skeleton width="50px" height="50px" />

                    </ProximoPartidoCuentaRegresivaItem>
                </ProximoPartidoCuentaRegresivaWrapper>
            </CardProximoPartidoWrapper>
        );
    }
    
    return (
        <CardProximoPartidoWrapper>
            <ProximoPartidoInfo>
                {
                    miEquipo === id_equipoLocal
                        ?
                        <img src={`https://coparelampago.com/${escudosEquipos(id_equipoVisita)}`} />
                        :
                        <img src={`https://coparelampago.com/${escudosEquipos(id_equipoLocal)}`} />
                }
                <ProximoPartidoDetalle>
                    <ProximoPartidoDescripcion>
                        <ProximoPartidoEquipos>
                            <p className={miEquipo === id_equipoLocal && 'my-team'}>{nombresEquipos(id_equipoLocal)}</p>
                            <p className={miEquipo === id_equipoVisita && 'my-team'}>{nombresEquipos(id_equipoVisita)}</p>
                        </ProximoPartidoEquipos>
                        <ProximoPartidoDiaJornada>
                            <p>{formatearFecha(dia)} - {hora === "00:00:00" || !hora ? 'a conf.'  : formatHour(hora)}</p>
                            <p className='jornada'>fecha {jornada} - {nombre_edicion}</p>
                        </ProximoPartidoDiaJornada>
                    </ProximoPartidoDescripcion>
                    <ProximoPartidoCancha>
                        <GiSoccerField />
                        {cancha ? cancha : 'a conf.'}
                    </ProximoPartidoCancha>
                </ProximoPartidoDetalle>
            </ProximoPartidoInfo>
            <ProximoPartidoDivisor />
            <ProximoPartidoCuentaRegresivaWrapper>
                <ProximoPartidoCuentaRegresivaItem className={timeLeft.dias === 0 && 'disabled'}>
                    <p>{timeLeft.dias}</p>
                    <span>días</span>
                </ProximoPartidoCuentaRegresivaItem>
                <ProximoPartidoCuentaRegresivaDivisor>:</ProximoPartidoCuentaRegresivaDivisor>
                <ProximoPartidoCuentaRegresivaItem className={timeLeft.horas === 0 && timeLeft.dias === 0 && 'disabled'}>
                    <p>{timeLeft.horas}</p>
                    <span>hrs</span>
                </ProximoPartidoCuentaRegresivaItem>
                <ProximoPartidoCuentaRegresivaDivisor>:</ProximoPartidoCuentaRegresivaDivisor>
                <ProximoPartidoCuentaRegresivaItem className={timeLeft.horas === 0 && timeLeft.dias === 0 && timeLeft.minutos === 0 && 'disabled'}>
                    <p>{timeLeft.minutos}</p>
                    <span>mins</span>
                </ProximoPartidoCuentaRegresivaItem>
                <ProximoPartidoCuentaRegresivaDivisor>:</ProximoPartidoCuentaRegresivaDivisor>
                <ProximoPartidoCuentaRegresivaItem className={timeLeft.horas === 0 && timeLeft.dias === 0 && timeLeft.minutos === 0 && timeLeft.segundos === 0 && 'disabled'}>
                    <p>{timeLeft.segundos}</p>
                    <span>segs</span>
                </ProximoPartidoCuentaRegresivaItem>
            </ProximoPartidoCuentaRegresivaWrapper>
        </CardProximoPartidoWrapper>
    );
};

export default CardProximoPartido;
