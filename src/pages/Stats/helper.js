import { dataAmarillasTemporadaColumns, dataAsistenciasTemporadaColumns, dataGoleadoresTemporadaColumns, dataPosicionesTemporadaColumns, dataRojasTemporadaColumns } from "../../components/Stats/Data/Data";

export const getColumns = (filtroActivo) => {
    switch (filtroActivo) {
        case 'Posiciones':
            return dataPosicionesTemporadaColumns;
        case 'Goleadores':
            return dataGoleadoresTemporadaColumns;
        case 'Asistencias':
            return dataAsistenciasTemporadaColumns;
        case 'Expulsados':
            return dataRojasTemporadaColumns;
        case 'Amarillas':
            return dataAmarillasTemporadaColumns;
        default:
            return [];
    }
};