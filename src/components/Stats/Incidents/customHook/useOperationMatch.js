import Axios from 'axios';
import { URL } from '../../../../utils/utils';
import { toast } from 'react-hot-toast';

const useOperationMatch = (bd_jugadores_eventuales, bd_partido, bd_formaciones, bd_goles, bd_rojas, bd_amarillas, bd_asistencias, bd_dreamTeam) => {
    
    const token = localStorage.getItem('token'); // Obtener el token

    const updateJugadores = async () => {
        if (bd_jugadores_eventuales.length > 0) {
            try {
                await Axios.put(`${URL}/user/update-jugadores`, bd_jugadores_eventuales, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al registrar los jugadores.');
                console.error('Error al registrar los jugadores:', error);
            }
        }
    };

    const updateMatch = async () => {
        try {
            await Axios.put(`${URL}/user/update-partido`, {
                id_partido: bd_partido.id_partido,
                descripcion: bd_partido.descripcion,
                pen_local: bd_partido.pen_local,
                pen_visita: bd_partido.pen_visita,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            toast.error('Error al actualizar el partido.');
            console.error('Error al actualizar el partido:', error);
        }
    };

    const insertFormaciones = async () => {
        if (bd_formaciones.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-formaciones`, bd_formaciones, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al registrar las formaciones.');
                console.error('Error al registrar las formaciones:', error);
            }
        }
    };

    const insertGoles = async () => {
        if (bd_goles.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-goles`, bd_goles, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al registrar los goles.');
                console.error('Error al registrar los goles:', error);
            }
        }
    };

    const insertRojas = async () => {
        if (bd_rojas.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-rojas`, bd_rojas, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al registrar las rojas.');
                console.error('Error al registrar las rojas:', error);
            }
        }
    };

    const insertAmarillas = async () => {
        if (bd_amarillas.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-amarillas`, bd_amarillas, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al registrar las Amarillas.');
                console.error('Error al registrar las Amarillas:', error);
            }
        }
    };

    const insertAsistencias = async () => {
        if (bd_asistencias.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-asistencias`, bd_asistencias, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al registrar las Asistencias.');
                console.error('Error al registrar las Asistencias:', error);
            }
        }
    };

    const updateSancionados = async () => {
        try {
            await Axios.post(`${URL}/user/calcular-expulsiones`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            toast.error('Error al actualizar las sanciones.');
            console.error('Error al actualizar las sanciones:', error);
        }
    };

    const insertDreamTeam = async () => {
        if (bd_dreamTeam.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-jugadores-destacados`, bd_dreamTeam, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                toast.error('Error al insertar jugadores destacados.');
                console.error('Error al insertar jugadores destacados:', error);
            }
        }
    };

    return {
        updateJugadores,
        updateMatch,
        insertFormaciones,
        insertGoles,
        insertRojas,
        insertAmarillas,
        insertAsistencias,
        updateSancionados,
        insertDreamTeam
    };

}

export default useOperationMatch;
