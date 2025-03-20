import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos } from "../redux/ServicesApi/equiposSlice";
import { fetchPartidos } from "../redux/ServicesApi/partidosSlice";
import { fetchJugadores } from "../redux/ServicesApi/jugadoresSlice";

const useStatsTeam = (equipoId) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);

    const partidosMiEquipo = partidos.filter((p) => {
        const esMiEquipo = p.id_equipoLocal === equipoId || p.id_equipoVisita === equipoId;
        const estadoValido = p.estado.trim() === 'F' || p.estado.trim() === 'S';
        return esMiEquipo && estadoValido;
    });

    const [cantVictorias, setCantVictorias] = useState(0);
    const [cantEmpates, setCantEmpates] = useState(0);
    const [cantDerrotas, setCantDerrotas] = useState(0);

    useEffect(() => {
        let victorias = 0;
        let empates = 0;
        let derrotas = 0;

        partidosMiEquipo.forEach(partido => {
            const esLocal = partido.id_equipoLocal === equipoId;
            const golesLocal = esLocal ? partido.goles_local : partido.goles_visita;
            const golesVisitante = esLocal ? partido.goles_visita : partido.goles_local;

            if (golesLocal > golesVisitante) {
                victorias++;
            } else if (golesLocal < golesVisitante) {
                derrotas++;
            } else {
                empates++;
            }
        });

        setCantVictorias(victorias);
        setCantEmpates(empates);
        setCantDerrotas(derrotas);

    }, [partidosMiEquipo, equipoId]);

    useEffect(() => {
        if (partidos.length === 0) {
            dispatch(fetchPartidos());
        }
    }, [dispatch, partidos.length]);

    return { cantVictorias, cantEmpates, cantDerrotas, partidosMiEquipo };
}

export default useStatsTeam;
