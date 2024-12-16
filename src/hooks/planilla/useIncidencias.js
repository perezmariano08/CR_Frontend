import { useEffect, useState } from "react";
import { getIncidenciasPlanilla } from "../../utils/dataFetchers";
import { useWebSocket } from "../../Auth/WebSocketContext";

export const useIncidencias = (id_partido, eventosSocket = []) => {
    const [incidencias, setIncidencias] = useState(null);
    const [loading, setLoading] = useState(true);
    const socket = useWebSocket();

    const fetchIncidencias = async () => {
        if (!id_partido) return;
        setLoading(true);
        try {
            const data = await getIncidenciasPlanilla(id_partido);
            setIncidencias([...data]);
        } catch (error) {
            console.error("Error fetching incidencias:", error);
            setIncidencias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidencias();
    }, [id_partido]);

    useEffect(() => {
        if (!socket || eventosSocket.length === 0) return;

        const handleSocketEvent = async (data) => {
            console.log('me ejecute', data);
            await fetchIncidencias();
        };

        eventosSocket.forEach((evento) => {
            socket.on(evento, handleSocketEvent);
        });

        return () => {
            eventosSocket.forEach((evento) => {
                socket.off(evento, handleSocketEvent);
            });
        };
    }, [socket, id_partido, eventosSocket]);

    return { incidencias, loading };
};
