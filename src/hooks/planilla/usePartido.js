import { useDispatch, useSelector } from "react-redux";
import { actualizarEstadoPartido, verificarJugadores } from "../../utils/dataFetchers";
import { setModalType, toggleModal } from "../../redux/Planillero/planilleroSlice";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../Auth/WebSocketContext";
import { obtenerTipoPartido } from "../../components/Stats/statsHelpers";

const usePartido = (id_partido, toast, token) => {
    const dispatch = useDispatch();
    const socket = useWebSocket();
    const partidosPlanillero = useSelector((state) => state.partidos.data_planillero)
    const partido = partidosPlanillero.find((p) => p.id_partido === id_partido);
    
    const partidos = useSelector((state) => state.partidos.data);

    const [partidoFiltrado, setPartidoFiltrado] = useState(partido || null);
    const [partidoIda, setPartidoIda] = useState(null);

    useEffect(() => {
        if (!socket) return;
    
        const handleNuevoEstadoPartido = ({ id_partido: socketIdPartido, nuevoEstado }) => {
            if (+socketIdPartido === +id_partido) {
                setPartidoFiltrado((prevState) => ({
                    ...prevState,
                    estado: nuevoEstado,
                }));
            }
        };
    
        const handleMvpPartido = (data) => {
            const socketIdPartido = data[0]
            const mvp = data[1]
            if (+socketIdPartido === +id_partido) {
                setPartidoFiltrado((prevState) => ({
                    ...prevState,
                    id_jugador_destacado: mvp,
                }));
            }
        };

        socket.on("nuevo-estado-partido", handleNuevoEstadoPartido);
        socket.on("mvpActualizado", handleMvpPartido);
    
        // Cleanup para evitar fugas de memoria
        return () => {
            socket.off("nuevo-estado-partido", handleNuevoEstadoPartido);
            socket.off("mvpActualizado", handleMvpPartido);
        };
    }, [socket, id_partido]);

    const handleStartMatch = async () => {
        const loadingToast = toast.loading('Actualizando el estado del partido...');
    
        const resultadoVerificacion = await verificarJugadores(id_partido, token);
    
        if (resultadoVerificacion.sePuedeComenzar) {
                // Usar la función actualizarEstadoPartido en lugar de axios.post
                const response = await actualizarEstadoPartido(id_partido, token);
                    
                if (response && response.mensaje) {
                    // Mostrar el mensaje de éxito o error según la respuesta
                    const tipoToast = response.mensaje.includes('Error') ? toast.error : toast.success;
    
                    tipoToast(response.mensaje, {
                        id: loadingToast // Cierra el loader y muestra el mensaje
                    });
                } else {
                    // En caso de que no haya respuesta o mensaje
                    toast.error('Error desconocido', {
                        id: loadingToast // Cierra el loader y muestra el error
                    });
                }
        } else {
            // Mostrar mensaje de error de verificación y cerrar loader
            toast.error('Debe haber un mínimo de 5 jugadores por equipo registrados para comenzar', {
                id: loadingToast // Cierra el loader
            });
        }
    };
    
    const pushInfoMatch = () => {
        dispatch(toggleModal('modalConfirmation'));
        dispatch(setModalType('matchPush'));
    };

    const suspenderPartido = () => {
        dispatch(toggleModal('modalSuspender'))
    }

    // !REVISAR
    useEffect(() => {
        if (partido && obtenerTipoPartido(partido) == 'vuelta') {
            const partidoIda = partidos.find((p) => p.id_partido == partido.ida);
            setPartidoIda(partidoIda);
        }
    }, [partido.id_partido, partido]);

    return { partidoFiltrado, handleStartMatch, pushInfoMatch, suspenderPartido, partidoIda };

}

export default usePartido;