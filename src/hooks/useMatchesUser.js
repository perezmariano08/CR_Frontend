import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartidos } from "../redux/ServicesApi/partidosSlice";


const useMatchesUser = (idEquipo) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idEquipo);

    const [fechaActual, setFechaActual] = useState(null);

    useEffect(() => {
        dispatch(fetchPartidos())
    }, [])

    useEffect(() => {
        if (partidos.length > 0 && miEquipo) {
            const sortedPartidos = partidos
                .filter((partido) => partido.division === miEquipo.division)
                .sort((a, b) => new Date(b.dia) - new Date(a.dia));

            const latestFecha = sortedPartidos.reduce((max, partido) => (partido.jornada > max ? partido.jornada : max), 0);

            setFechaActual(latestFecha);
        }
    }, [partidos, miEquipo]);

    const proximoPartido = partidos
        .filter(
            (partido) =>
                partido.estado === 'P' &&
                (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
        )
        .sort((a, b) => new Date(a.dia) - new Date(b.dia))[0];

    const ultimoPartido = !proximoPartido
        ? partidos
                .filter(
                    (partido) =>
                        partido.estado === 'F' &&
                        (partido.id_equipoLocal === miEquipo?.id_equipo || partido.id_equipoVisita === miEquipo?.id_equipo)
                )
                .sort((a, b) => new Date(b.dia) - new Date(a.dia))[0]
        : null;

    const partidoAMostrar = proximoPartido || ultimoPartido;

    const partidosFecha = partidos.filter(partido => partido.id_temporada === miEquipo.id_temporada)

    return { partidoAMostrar, partidosFecha, proximoPartido, fechaActual };
}

export default useMatchesUser;