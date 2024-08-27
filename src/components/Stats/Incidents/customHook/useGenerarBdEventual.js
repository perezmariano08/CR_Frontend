import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { traerPartidosEventuales } from '../../../../utils/dataFetchers';

const useGenerarBdEventual = (idPartido) => {
    const [bdEventual, setBdEventual] = useState([]);
    
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);

    useEffect(() => {
        const fetchPartidosEventuales = async () => {
            const eventuales = await traerPartidosEventuales();
            setBdEventual(eventuales);
        };

        fetchPartidosEventuales();
    }, []);

    const generarBdJugadorEventual = (match, jugadoresExistentes) => {
        const jugadoresEventuales = [];
    
        const dniExistentes = new Set(jugadoresExistentes.map(jugador => jugador.dni));
    
        match.Local.Player?.forEach((player) => {
            if (player.eventual === 'S' && !dniExistentes.has(player.DNI)) {
                const [nombre, apellido] = player.Nombre.split(' ');
                const jugador = {
                    id_jugador: player.ID,
                    dni: player.DNI,
                    nombre: nombre,
                    apellido: apellido,
                    id_equipo: match.Local.id_equipo,
                    eventual: player.eventual,
                    id_edicion: match.id_edicion,
                    id_categoria: match.id_categoria
                };
    
                jugador.sancionado = player.sancionado === 'S' ? 'S' : 'N';
                jugadoresEventuales.push(jugador);
            }
        });
    
        match.Visitante.Player?.forEach((player) => {
            if (player.eventual === 'S' && !dniExistentes.has(player.DNI)) {
                const [nombre, apellido] = player.Nombre.split(' ');
                const jugador = {
                    id_jugador: player.ID,
                    dni: player.DNI,
                    nombre: nombre,
                    apellido: apellido,
                    id_equipo: match.Visitante.id_equipo,
                    eventual: player.eventual,
                    id_edicion: match.id_edicion,
                    id_categoria: match.id_categoria
                };
    
                jugador.sancionado = player.sancionado === 'S' ? 'S' : 'N';
                jugadoresEventuales.push(jugador);
            }
        });
    
        return jugadoresEventuales;
    };

    const bd_jugadores_eventuales = generarBdJugadorEventual(match, bdEventual);

    return { bd_jugadores_eventuales };
}

export default useGenerarBdEventual;
