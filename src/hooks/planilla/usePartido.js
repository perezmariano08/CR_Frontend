import { useDispatch, useSelector } from "react-redux";
import { actualizarEstadoPartido, verificarJugadores } from "../../utils/dataFetchers";
import { setModalType, toggleModal } from "../../redux/Planillero/planilleroSlice";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../Auth/WebSocketContext";
import { obtenerTipoPartido } from "../../components/Stats/statsHelpers";
import { fetchPartidos, fetchPartidosPlanillero } from "../../redux/ServicesApi/partidosSlice";
import { useAuth } from "../../Auth/AuthContext";

const usePartido = (id_partido, toast, token) => {
    const dispatch = useDispatch();
    const { userId } = useAuth();
    const partidosPlanillero = useSelector((state) => state.partidos.data_planillero)
    const partido = partidosPlanillero.find((p) => p.id_partido === id_partido);
    
    const partidos = useSelector((state) => state.partidos.data);

    const [partidoFiltrado, setPartidoFiltrado] = useState(partido || null);
    const [partidoIda, setPartidoIda] = useState(null);

    const handleStartMatch = async () => {
        const loadingToast = toast.loading('Actualizando el estado del partido...');
    
        const resultadoVerificacion = await verificarJugadores(id_partido, token);
    
        if (resultadoVerificacion.sePuedeComenzar) {

                const response = await actualizarEstadoPartido(id_partido, token);
                
                if (response && response.mensaje) {

                    const tipoToast = response.mensaje.includes('Error') ? toast.error : toast.success;
                    if (response.data.id_partido === id_partido) {
                        // Actualizar ambas fuentes de entrada
                        dispatch(fetchPartidosPlanillero({ id_planillero: userId, token }));
                        setPartidoFiltrado((prevState) => ({
                            ...prevState,
                            estado: response.data.nuevoEstado,
                        }));
                    }
                    tipoToast(response.mensaje, {
                        id: loadingToast
                    });
                } else {
                    toast.error('Error desconocido', {
                        id: loadingToast
                    });
                }
        } else {
            toast.error('Debe haber un mínimo de 5 jugadores por equipo registrados para comenzar', {
                id: loadingToast
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