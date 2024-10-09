import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartidos } from "../redux/ServicesApi/partidosSlice";
import { fetchEquipos } from "../redux/ServicesApi/equiposSlice";
import { debounce } from 'lodash';
import { useWebSocket } from "../Auth/WebSocketContext";

const useMatchesUser = (idEquipo) => {
    const socket = useWebSocket();
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idEquipo);

    const [fechaActual, setFechaActual] = useState(null);
    
    // Evitar múltiples despachos seguidos
    const fetchPartidosEquipos = useCallback(debounce(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
    }, 500), [dispatch]);

    useEffect(() => {
        fetchPartidosEquipos();
    }, [fetchPartidosEquipos]);

    // Actualizar partidos cuando se recibe un evento del socket relacionado con el estado o las acciones
    useEffect(() => {
        const handleEstadoPartidoActualizado = (data) => {
            if (data) {
                dispatch(fetchPartidos())
                    .then((partidos) => {
                    })
                    .catch(error => console.error('Error actualizando el partido:', error));
            }
        };
    
        const handleNewIncidence = () => {
            dispatch(fetchPartidos()); // Actualizar partidos cuando hay una nueva acción
        };
    
        const handleIncidenciaEliminada = () => {
            dispatch(fetchPartidos()); // Actualizar partidos cuando se elimina una acción
        };
    
        // Suscripción a los eventos de socket
        socket.on('estadoPartidoActualizado', handleEstadoPartidoActualizado);
        socket.on('nuevaAccion', handleNewIncidence);
        socket.on('eliminarAccion', handleIncidenciaEliminada);
    
        return () => {
            // Limpiar suscripciones
            socket.off('estadoPartidoActualizado', handleEstadoPartidoActualizado);
            socket.off('nuevaAccion', handleNewIncidence);
            socket.off('eliminarAccion', handleIncidenciaEliminada);
        };
    }, [socket, dispatch]);

    useEffect(() => {
        if (partidos.length > 0 && miEquipo) {
            const sortedPartidos = partidos
                .filter((partido) => partido.id_zona === miEquipo.id_zona)
                .sort((a, b) => new Date(b.dia) - new Date(a.dia));

            const latestFecha = sortedPartidos.reduce((max, partido) => (partido.jornada > max ? partido.jornada : max), 0);            
            setFechaActual(latestFecha);
        }
    }, [partidos, miEquipo]);

    const proximoPartido = partidos
    .filter(
        (partido) =>
            partido.estado === 'P' && // Estado de "Pendiente"
            (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
    )
    .sort((a, b) => new Date(a.dia) - new Date(b.dia))[0]; // Ordenar por fecha más cercana

const ultimoPartido = !proximoPartido
    ? partidos
        .filter(
            (partido) => 
                (partido.estado === 'F' || partido.estado === 'T') && // Estado de "Finalizado" o "Terminado"
                (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
        )
        .sort((a, b) => new Date(b.dia) - new Date(a.dia))[0] // Ordenar por fecha más reciente
    : null;

    const partidoAMostrar = proximoPartido || ultimoPartido;

    const partidosFecha = partidos.filter(partido => partido.id_zona == miEquipo?.id_zona && partido.jornada == fechaActual)

    return { partidoAMostrar, partidosFecha, proximoPartido, fechaActual };
}

export default useMatchesUser;