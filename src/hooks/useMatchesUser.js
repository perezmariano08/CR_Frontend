import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartidos } from "../redux/ServicesApi/partidosSlice";
import { fetchEquipos } from "../redux/ServicesApi/equiposSlice";
import { debounce } from 'lodash';
import { useWebSocket } from "../Auth/WebSocketContext";
import { fetchZonas } from "../redux/ServicesApi/zonasSlice";

const useMatchesUser = (idEquipo) => {
    const socket = useWebSocket();
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idEquipo);
    const zonas = useSelector((state) => state.zonas.data);

    const [fechaActual, setFechaActual] = useState(null);
    const [zonaActual, setZonaActual] = useState(null);

    // Evitar múltiples despachos seguidos
    const fetchPartidosEquipos = useCallback(debounce(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
    }, 500), [dispatch]);
    
    useEffect(() => {
        dispatch(fetchZonas());
    }, [idEquipo]);

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
            // Filtra los partidos del equipo en la misma zona
            const partidosZonaEquipo = partidos.filter(
                (partido) => partido.id_equipoLocal === miEquipo.id_equipo || partido.id_equipoVisita === miEquipo.id_equipo
            );
    
            if (partidosZonaEquipo.length > 0) {
                // Encuentra la jornada más alta en los partidos de este equipo
                const partidoJornadaAlta = partidosZonaEquipo.reduce((prev, current) => 
                    (current.jornada > prev.jornada ? current : prev), partidosZonaEquipo[0]);
    
                // Guarda la jornada y zona del partido con la jornada más alta
                setFechaActual(partidoJornadaAlta.jornada);
    
                // Si necesitas guardar la zona también
                const zonaPartidoAltaJornada = zonas.find(zona => zona.id_zona === partidoJornadaAlta.id_zona);
                setZonaActual(zonaPartidoAltaJornada);
            }
        }
    }, [partidos, miEquipo, zonas]);
    
    const proximoPartido = partidos
    .filter(
        (partido) =>
            partido.estado === 'P' && // Estado de "Pendiente"
            (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
    )
    .sort((a, b) => new Date(a.dia) - new Date(b.dia))[0]; // Ordenar por fecha más cercana

const ultimoPartido = partidos
    .filter(
        (partido) => 
            (partido.estado === 'F' || partido.estado === 'T') && // Estado de "Finalizado" o "Terminado"
            (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
    )
    .sort((a, b) => new Date(b.dia) - new Date(a.dia))[0]; // Ordenar por fecha más reciente

const partidoEnDirecto = partidos
    .filter(
        (partido) => 
            partido.estado === 'C' && // Estado de "En directo"
            (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
    )
    .sort((a, b) => new Date(b.dia) - new Date(a.dia))[0]; // Ordenar por fecha más reciente

const partidoAMostrar = partidoEnDirecto || proximoPartido || ultimoPartido || partidos[0] || null;

        
// Filtrar partidos por jornada y zona
const partidosFecha = partidos
    .filter(partido => partido.id_zona === zonaActual?.id_zona && partido.jornada === fechaActual)
    .sort((a, b) => {
        // Primero en vivo, luego pendientes, luego finalizados
        const statusOrder = { 'C': 1, 'P': 2, 'F': 3, 'T': 3 };
        return statusOrder[a.estado] - statusOrder[b.estado] || new Date(a.dia) - new Date(b.dia);
    });

    return { partidoAMostrar, partidosFecha, proximoPartido, fechaActual, partidoEnDirecto, ultimoPartido, partidos, zonaActual };
}

export default useMatchesUser;