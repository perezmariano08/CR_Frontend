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

    useEffect(() => {
      if (zonas.length === 0) dispatch(fetchZonas());
      if (partidos.length === 0) dispatch(fetchPartidos());
      if (equipos.length === 0) dispatch(fetchEquipos());
    }, [dispatch, idEquipo, partidos, equipos, zonas]);

    // useEffect(() => {
    //     fetchPartidosEquipos();
    // }, [fetchPartidosEquipos]);

    useEffect(() => {
        if (partidos.length > 0 && miEquipo) {
            // Filtrar partidos del equipo
            const partidosZonaEquipo = partidos.filter(
                (partido) => partido.id_equipoLocal === miEquipo.id_equipo || partido.id_equipoVisita === miEquipo.id_equipo
            );
    
            if (partidosZonaEquipo.length > 0) {
                // Encuentra el partido con el id_zona más alto, y en caso de empate, el más reciente por fecha
                const partidoUltimaZona = partidosZonaEquipo.reduce((prev, current) => {
                    if (current.id_zona > prev.id_zona) {
                        return current;
                    } else if (current.id_zona === prev.id_zona) {
                        // Si tienen el mismo id_zona, desempatar por fecha (suponiendo formato ISO 8601)
                        return new Date(current.fecha) > new Date(prev.fecha) ? current : prev;
                    }
                    return prev;
                }, partidosZonaEquipo[0]);
    
                // Actualizar la fecha actual (jornada) y la zona actual
                setFechaActual(partidoUltimaZona.jornada);
    
                const zonaUltima = zonas.find(zona => zona.id_zona === partidoUltimaZona.id_zona);
                setZonaActual(zonaUltima);
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