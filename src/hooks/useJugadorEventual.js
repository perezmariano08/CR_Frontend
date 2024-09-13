import Axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { URL } from "../utils/utils";
import { traerPartidosEventuales, verificarCategoriaJugadorEventual, verificarJugadorEventual } from "../utils/dataFetchers";
import { fetchJugadores } from "../redux/ServicesApi/jugadoresSlice";
import { toast, LoaderIcon } from 'react-hot-toast';
import { useEffect } from "react";
import userJugadorEventualStates from "./userJugadorEventualStates";

const useJugadorEventual = () => {
    const dispatch = useDispatch();
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const idCurrentTeam = useSelector((state) => state.planillero.playerEvent.idPlayerTeam);
    const matchState = useSelector((state) => state.match);
    const matchCorrecto = matchState.find((match) => match.ID === idPartido);
    const equipoCorrecto = matchCorrecto?.Local.id_equipo === idCurrentTeam ? matchCorrecto.Local : matchCorrecto.Visitante;
    const isEnabledEdit = useSelector((state) => state.planillero.playerEventData.state);
    const jugadores = useSelector((state) => state.jugadores.data);
    const id_categoria = parseInt(matchCorrecto.id_categoria);

    const [bdEventual, setBdEventual] = useState([]);
    const [maxQuantityPlayers, setMaxQuantityPlayers] = useState(true);

    useEffect(() => {
        dispatch(fetchJugadores());
    }, []);

    const checkPlayerExists = async (dni, id_equipo) => {
        try {
            const data = await verificarCategoriaJugadorEventual(dni, id_categoria, id_equipo);
            return data;
    
        } catch (error) {
            console.error('Error al verificar el jugador eventual:', error);
        }
    };
    
    const generateId = () => {
        // Genera un número aleatorio de hasta 4 dígitos (puedes ajustar el rango según sea necesario)
        const randomNumber = Math.floor(Math.random() * 10000);
        
        // Convierte el número en una cadena con ceros a la izquierda
        const formattedNumber = randomNumber.toString().padStart(4, '0');
        
        // Añade el prefijo '015' y convierte la cadena resultante a número
        return parseInt(`015${formattedNumber}`, 10);
    };

    const searchDorsal = async (dorsal, dni, eventual) => {    
        const id_equipo = matchCorrecto.id_equipo;
        
        if (!equipoCorrecto) return false;
    
        const players = isEnabledEdit
            ? equipoCorrecto.Player.filter(player => {
                return !eventual || player.Dorsal !== eventual.dorsal || player.DNI !== eventual.dni;
            })
            : equipoCorrecto.Player;
    
        const foundByDorsal = players.some(player => player.Dorsal === dorsal);
        const foundByDNI = players.some(player => player.DNI === dni);
        let foundByDNIForTeams = false;
    
        try {
            const data = await verificarJugadorEventual(dni, id_categoria, id_equipo);
            foundByDNIForTeams = data.found;
        } catch (error) {
            console.error('Error al verificar el jugador eventual:', error);
        }
        
        if (foundByDorsal && foundByDNI) {
            return '1';
        } else if (foundByDorsal) {
            return '2';
        } else if (foundByDNI || foundByDNIForTeams) {
            return '3';
        } else {
            return false;
        }
    };
    

    const checkMaxPlayersQuantity = () => {
        if (equipoCorrecto) {
            const eventualPlayersCounts = equipoCorrecto.Player?.filter(player => player.eventual === 'S').length;
            setMaxQuantityPlayers(eventualPlayersCounts < 5);
        }
    };

    const verificarJugador = (dni) => {

        
        // Verificar si el DNI ya existe en jugadores regulares (no eventuales) del equipo actual
        const jugadorExistenteRegular = jugadores.find(
            (jugador) => jugador.DNI === dni && jugador.eventual === 'N'
        );
    
        if (jugadorExistenteRegular) {
            toast.error('El jugador ya existe en jugadores regulares (no eventuales) del equipo actual');
            return false;
        }
    
        // Verificar si el DNI ya ha sido agregado como eventual en el equipo contrario en el mismo partido
        const equipoContrario = matchCorrecto.Local.id_equipo === idCurrentTeam
            ? matchCorrecto.Visitante
            : matchCorrecto.Local;
    
        // const jugadorExistenteEnOtroEquipo = equipoContrario.Player.find(
        //     (jugador) => jugador.DNI === dni && jugador.eventual === 'S'
        // );

        const jugadorExistenteEnOtroEquipo = equipoContrario.Player.find(
            (jugador) => jugador.DNI === dni
        );
    
        if (jugadorExistenteEnOtroEquipo) {
            toast.error('El jugador eventual ya está registrado en el equipo rival');
            return false;
        }
    
        // Verificar si el jugador tiene menos de 3 partidos eventuales jugados en la temporada actual
        const jugadorEventualEnTemporada = bdEventual.filter((j) => 
            j.dni === dni && j.id_equipo === idCurrentTeam
        );
        
        if (jugadorEventualEnTemporada.length >= 3) {
            toast.error('El jugador ya jugo sus 3 partidos correspondientes como eventual');
            return false;
        }

        if (jugadorEventualEnTemporada.length === 2) {
            toast('Ultimo partido como eventual para este jugador', {
                icon: `⚠️`,
                duration: 4000,
            });
        }
        return true;
    };

    const jugadoresEventualesEquipo = bdEventual.filter((e) => {
        return e.id_equipo === equipoCorrecto?.id_equipo;
    });

    useEffect(() => {
        const fetchPartidosEventuales = async () => {
            try {
                const eventuales = await traerPartidosEventuales(id_categoria);
                setBdEventual(eventuales);
            } catch (error) {
                console.error('Error fetching partidos eventuales:', error);
            }
        };
    
        fetchPartidosEventuales();
    }, [id_categoria]);

    return {
        generateId,
        searchDorsal,
        checkMaxPlayersQuantity,
        verificarJugador,
        traerPartidosEventuales,
        jugadoresEventualesEquipo,
        maxQuantityPlayers,
        bdEventual,
        checkPlayerExists,
    };
}

export default useJugadorEventual;