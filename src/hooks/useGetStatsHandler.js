import { useState, useCallback } from 'react';
import { getEstadisticasTemporada } from '../utils/dataFetchers';

const useGetStatsHandler = (zonaSeleccionada, filtroActivo) => {
    const [estadisticaZona, setEstadisticaZona] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEstadisticasZonaHandler = useCallback(async () => {
        if (!zonaSeleccionada || !filtroActivo) return;

        setLoading(true);
        setError(null);

        let estadistica;
        switch (filtroActivo) {
            case 'Goleadores':
                estadistica = 'goles';
                break;
            case 'Asistencias':
                estadistica = 'asistencias';
                break;
            case 'Expulsados':
                estadistica = 'rojas';
                break;
            case 'Amarillas':
                estadistica = 'amarillas';
                break;
            default:
                setLoading(false);
                return;
        }

        try {
            const data = await getEstadisticasTemporada(estadistica, zonaSeleccionada);
            setEstadisticaZona(data);
        } catch (error) {
            setError('Error al cargar las estadísticas');
            console.error('Error fetching estadisticas:', error);
        } finally {
            setLoading(false);
        }
    }, [zonaSeleccionada, filtroActivo]);

    return { estadisticaZona, loading, error, getEstadisticasZonaHandler };
};

export default useGetStatsHandler;
