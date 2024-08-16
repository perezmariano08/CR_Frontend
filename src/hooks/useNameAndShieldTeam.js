import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEquipos } from '../redux/ServicesApi/equiposSlice'

const useNameAndShieldTeams = (ids) => {
    const dispatch = useDispatch();
    const equipos = useSelector((state) => state.equipos.data);

    useEffect(() => {
        dispatch(fetchEquipos());
    }, [])
    
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
