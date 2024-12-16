import { useEffect, useState } from "react";
import { insertarMvp, traerJugadoresDestacados } from "../../utils/dataFetchers";
import { useWebSocket } from "../../Auth/WebSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { handleMvpSelected } from "../../redux/Planillero/planilleroSlice";

const useJugadoresDestacados = (id_partido, estadoPartido, toast) => { 
    const dispatch = useDispatch();

    const [mvpSelected, setMvpSelected] = useState(0);
    const [jugadoresDestacados, setJugadoresDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useWebSocket();

    const mvpSelectedRedux = useSelector((state) => state.planillero.mvpSelected);

    useEffect(() => {
        const fetchJugadoresDestacados = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await traerJugadoresDestacados(id_partido);
                if (data) {
                    setJugadoresDestacados(data);
                } else {
                    setJugadoresDestacados([]);
                }
            } catch (err) {
                console.error("Error en la petición:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (id_partido) {
            fetchJugadoresDestacados();
        }

        const handleJugadorDestacadoAgregado = (data) => {
            setJugadoresDestacados((prev) => [...prev, data]);
        };

        const handleJugadorDestacadoEliminado = (data) => {
            setJugadoresDestacados((prev) =>
                prev.filter((jugador) => +jugador.id_jugador !== +data.id_jugador)
            );
        };

        if (socket) {
            socket.on("insertar-jugador-destacado", handleJugadorDestacadoAgregado);
            socket.on("eliminar-jugador-destacado", handleJugadorDestacadoEliminado);
        }

        return () => {
            if (socket) {
                socket.off("insertar-jugador-destacado", handleJugadorDestacadoAgregado);
                socket.off("eliminar-jugador-destacado", handleJugadorDestacadoEliminado);
            }
        };
    }, [id_partido, socket]);


    const handleMvp = async (e) => {
        if (estadoPartido !== 'T') {
            return toast.error('Finaliza el partido para seleccionar un MVP');
        }
    
        const selectedValue = e.target.value;
        const toastId = toast.loading('Cargando...');
        const delay = 300;
    
        try {
            const response = await insertarMvp(id_partido, selectedValue);
            if (response.status === 200) {
                setTimeout(() => {
                    toast.success('MVP agregado correctamente', { id: toastId });
                    setMvpSelected(selectedValue);
                    dispatch(handleMvpSelected(selectedValue));
                }, delay);
            } else {
                setTimeout(() => {
                    toast.error('Error al agregar el MVP', { id: toastId });
                }, delay);
            }
        } catch (error) {
            console.error(error);
            setTimeout(() => {
                toast.error('Error en la solicitud', { id: toastId });
            }, 2000);
        } finally {
            setTimeout(() => {
                toast.dismiss(toastId);
            }, delay);
        }
    };

    return { jugadoresDestacados, loading, error, handleMvp, mvpSelectedRedux };
};

export default useJugadoresDestacados;
