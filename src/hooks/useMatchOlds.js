import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartidos } from '../redux/ServicesApi/partidosSlice';

const useMatchOlds = (id_equipoLocal, id_equipoVisita) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);

    useEffect(() => {
        if (partidos.length === 0) {
            dispatch(fetchPartidos());
        }
    }, [partidos.length, dispatch]);

    const partidosJugadosLocal = partidos.filter(
        (p) => p.estado === 'F' && +p.id_equipoLocal === +id_equipoLocal || +p.id_equipoVisita === +id_equipoLocal
    );
    const partidosJugadosVisita = partidos.filter(
        (p) => +p.id_equipoLocal === +id_equipoVisita || +p.id_equipoVisita === +id_equipoVisita
    );

    const partidosEntreEquipos = partidos.filter(
      (p) =>
        (p.estado === "F" || p.estado === "S") &&
        ((+p.id_equipoLocal === +id_equipoLocal &&
          +p.id_equipoVisita === +id_equipoVisita) ||
          (+p.id_equipoLocal === +id_equipoVisita &&
            +p.id_equipoVisita === +id_equipoLocal))
    );

    return {
        partidosJugados: {
            local: partidosJugadosLocal,
            visita: partidosJugadosVisita,
        },
        partidosEntreEquipos
    };
};

export default useMatchOlds;
