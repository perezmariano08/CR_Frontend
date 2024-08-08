import { useEffect, useState } from 'react';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { toast } from 'react-hot-toast';

const useEventualPlayers = (match) => {
    const [bdEventual, setBdEventual] = useState([]);

    const traerPartidosEventuales = async () => {
        try {
            const response = await Axios.get(`${URL}/user/get-partidos-eventuales`);
            const data = response.data;
            setBdEventual(data);
        } catch (error) {
            console.error('Error en la petición', error);
        }
    };

    useEffect(() => {
        traerPartidosEventuales();
    }, []);

    const generarBdJugadorEventual = (match, jugadoresExistentes) => {
        const jugadoresEventuales = [];
        const dniExistentes = new Set(jugadoresExistentes.map(jugador => jugador.dni));

        match.Local.Player.forEach((player) => {
            if (player.eventual === 'S' && !dniExistentes.has(player.DNI)) {
                const [nombre, apellido] = player.Nombre.split(' ');
                const jugador = {
                    id_jugador: player.ID,
                    dni: player.DNI,
                    nombre: nombre,
                    apellido: apellido,
                    id_equipo: match.Local.id_equipo,
                    eventual: player.eventual,
                    sancionado: player.sancionado === 'S' ? 'S' : 'N'
                };

                jugadoresEventuales.push(jugador);
            }
        });

        match.Visitante.Player.forEach((player) => {
            if (player.eventual === 'S' && !dniExistentes.has(player.DNI)) {
                const [nombre, apellido] = player.Nombre.split(' ');
                const jugador = {
                    id_jugador: player.ID,
                    dni: player.DNI,
                    nombre: nombre,
                    apellido: apellido,
                    id_equipo: match.Visitante.id_equipo,
                    eventual: player.eventual,
                    sancionado: player.sancionado === 'S' ? 'S' : 'N'
                };

                jugadoresEventuales.push(jugador);
            }
        });

        return jugadoresEventuales;
    };

    const bd_jugadores_eventuales = generarBdJugadorEventual(match, bdEventual);

    const updateJugadores = async () => {
        if (bd_jugadores_eventuales.length > 0) {
            try {
                await Axios.put(`${URL}/user/update-jugadores`, bd_jugadores_eventuales);
            } catch (error) {
                toast.error('Error al registrar los jugadores.');
                console.error('Error al registrar los jugadores:', error);
            }
        }
    };

    return { updateJugadores, bdEventual };
};

export default useEventualPlayers;
