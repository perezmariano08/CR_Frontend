import { useSelector } from 'react-redux';

// Custom hook to fetch names and shields for multiple teams
const useNameAndShieldTeams = (ids) => {
    const equipos = useSelector((state) => state.equipos.data);

    const getEquiposData = (ids) => {
        return ids.reduce((acc, id) => {
        const equipo = equipos.find(equipo => equipo.id_equipo === id);
        if (equipo) {
            acc[id] = {
            nombre: equipo.nombre,
            escudo: equipo.img
            };
        }
        return acc;
        }, {});
    };

    const equiposData = getEquiposData(ids);

    const getNombreEquipo = (id) => equiposData[id]?.nombre || '';
    const getEscudoEquipo = (id) => equiposData[id]?.escudo || '';

    return { getNombreEquipo, getEscudoEquipo };
};

export default useNameAndShieldTeams;
