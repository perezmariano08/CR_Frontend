import { useDispatch, useSelector } from "react-redux";
import { fetchJugadores } from "../redux/ServicesApi/jugadoresSlice";

// Custom hook para obtener los equipos
export const useJugadores = () => {
    const dispatch = useDispatch()
    dispatch(fetchJugadores())

    const jugadores = useSelector((state) => state.jugadores.data);
    
    const fotosJugadores = (idJugador) => {
        const jugador = jugadores.find((j) => j.id_jugador == idJugador);        
        return jugador && jugador.img ? `uploads/Jugadores/${jugador.img}` : '/uploads/Jugadores/player-default.png';
    };

    const nombresJugadores = (idJugador) => {
        const jugador = jugadores.find((j) => j.id_jugador == idJugador);
        return jugador ? `${jugador.apellido}, ${jugador.nombre}` : '';
    };

    return { fotosJugadores, nombresJugadores };
};