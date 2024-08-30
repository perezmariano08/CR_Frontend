import { useSelector } from "react-redux";

// Custom hook para obtener los equipos
export const useEquipos = () => {
    const equipos = useSelector((state) => state.equipos.data);
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo && equipo.img ? equipo.img : '/uploads/Equipos/team-default.png';
    };

    const nombresEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : '';
    };

    return { escudosEquipos, nombresEquipos };
};
