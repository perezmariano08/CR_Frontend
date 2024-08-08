import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { toast } from 'react-hot-toast';

const useDatabaseOperations = () => {
    const updateMatch = async (bd_partido) => {
        try {
            await Axios.put(`${URL}/user/update-partido`, {
                id_partido: bd_partido.id_partido,
                goles_local: bd_partido.goles_local,
                goles_visita: bd_partido.goles_visita,
                descripcion: bd_partido.descripcion,
                id_jugador_destacado: bd_partido.id_jugador_destacado,
                estado: 'F'
            });
        } catch (error) {
            toast.error('Error al actualizar el partido.');
            console.error('Error al actualizar el partido:', error);
        }
    };

    const insertData = async (endpoint, data, successMessage, errorMessage) => {
        if (data.length > 0) {
            try {
                await Axios.post(`${URL}/user/${endpoint}`, data);
                toast.success(successMessage);
            } catch (error) {
                toast.error(errorMessage);
                console.error(errorMessage, error);
            }
        }
    };

    const updateSancionados = async () => {
        try {
            await Axios.post(`${URL}/user/calcular-expulsiones`);
        } catch (error) {
            toast.error('Error al actualizar las sanciones.');
            console.error('Error al actualizar las sanciones:', error);
        }
    };

    return { updateMatch, insertData, updateSancionados };
};

export default useDatabaseOperations;
