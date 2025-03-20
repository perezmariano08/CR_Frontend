import { useEffect, useState } from "react";
import { getFormaciones } from "../../utils/dataFetchers";
import { useWebSocket } from "../../Auth/WebSocketContext";
import { orderData } from "../../utils/utils";

export const useFormaciones = (id_partido, token) => {
    const [formaciones, setFormaciones] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socketLoading, setSocketLoading] = useState({});
    const socket = useWebSocket();

    const fetchFormaciones = async () => {
        setLoading(true);
        try {
            const data = await getFormaciones(id_partido, token);

            const orderedData = orderData(data);

            setFormaciones(orderedData);
        } catch (error) {
            console.error("Error fetching formaciones:", error);
            setFormaciones([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id_partido) return;

        fetchFormaciones();

        // Manejar el evento de dorsal asignado
        const handleDorsalAsignado = (data) => {
            if (data.id_partido === id_partido) {
                setSocketLoading((prevState) => ({
                    ...prevState,
                    [data.id_jugador]: true,
                }));

                setFormaciones((prevFormaciones) => {
                    const updatedFormaciones = prevFormaciones.map((formacion) => {
                        if (formacion.id_jugador === data.id_jugador) {
                            return { ...formacion, dorsal: data.dorsal };
                        }
                        return formacion;
                    });

                    return updatedFormaciones;
                });

                setTimeout(() => {
                    setSocketLoading((prevState) => ({
                        ...prevState,
                        [data.id_jugador]: false,
                    }));
                }, 500);
            }
        };

        const handleInsertarJugadorDestacado = (data) => {
            if (data.id_partido === id_partido) {
                setFormaciones((prevFormaciones) => {
                    return prevFormaciones.map((formacion) => {
                        if (+formacion.id_jugador === +data.id_jugador) {
                            return { ...formacion, destacado: "S" };
                        }
                        return formacion;
                    });
                });
            }
        };
        
        const handleEliminarJugadorDestacado = (data) => {
            if (+data.id_partido === +id_partido) {
                setFormaciones((prevFormaciones) => {
                    return prevFormaciones.map((formacion) => {
                        if (+formacion.id_jugador === +data.id_jugador) {
                            return { ...formacion, destacado: "N" };
                        }
                        return formacion;
                    });
                });
            }
        };

        const handleJugadorEventualCreado = (data) => { 
            fetchFormaciones();
        }

        const handleInsertarRoja = (data) => {
            if (data.id_partido === id_partido) {
                fetchFormaciones();
            }
        };
        
        const handleEliminarExpulsion = (data) => {
            if (+data.id_partido === +id_partido) {
                // Vuelve a cargar las formaciones para asegurarte de que se refleje correctamente la eliminación.
                fetchFormaciones();
            }
        };
        

        // Suscribirse a los eventos de WebSocket
        if (socket) {
            socket.on("dorsalAsignado", handleDorsalAsignado);
            socket.on("insertar-jugador-destacado", handleInsertarJugadorDestacado);
            socket.on("eliminar-jugador-destacado", handleEliminarJugadorDestacado);
            socket.on("jugadorEventualCreado", handleJugadorEventualCreado);
            socket.on("insertar-roja", handleInsertarRoja)
            socket.on("eliminar-expulsion", handleEliminarExpulsion);
        }

        // Limpiar los eventos cuando el componente se desmonte
        return () => {
            if (socket) {
                socket.off("dorsalAsignado", handleDorsalAsignado);
                socket.off("insertar-jugador-destacado", handleInsertarJugadorDestacado);
                socket.off("eliminar-jugador-destacado", handleEliminarJugadorDestacado);
                socket.off("jugadorEventualCreado", handleJugadorEventualCreado);
                socket.off("insertar-roja", handleInsertarRoja)
                socket.off("eliminar-expulsion", handleEliminarExpulsion);
            }
        };

    }, [id_partido, socket]);

    return { formaciones, loading, socketLoading, fetchFormaciones, formaciones, setFormaciones, orderData };
};
