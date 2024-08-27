import { useSelector } from "react-redux";

const useGenerarBdStats = (idPartido) => {
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);

    const generarBdGoles = (team, idPartido) => {
        const goles = [];
        team.Player?.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(action => {
                    if (action.Type === 'Gol') {
                        goles.push({
                            id_partido: idPartido,
                            id_jugador: jugador.ID,
                            minuto: parseInt(action.Time),
                            penal: action.Detail.penal ? 'S' : 'N',
                            en_contra: action.Detail.enContra ? 'S' : 'N'
                        });
                    }
                })
            }
        });
        return goles;
    };

    const bd_golesLocal = generarBdGoles(match.Local, idPartido);
    const bd_golesVisita = generarBdGoles(match.Visitante, idPartido);
    const bd_goles = [...bd_golesLocal, ...bd_golesVisita];

    const generarBdRojas = (team, idPartido) => {
        const rojas = [];
        
        // Crear un mapa para llevar el conteo de las amarillas por jugador
        const amarillasPorJugador = new Map();
    
        team.Player?.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(accion => {
                    if (accion.Type === 'Roja') {
                        rojas.push({
                            id_partido: idPartido,
                            id_jugador: jugador.ID,
                            minuto: parseInt(accion.Time),
                            descripcion: '',
                            motivo: accion.Sancion
                        });
                    }
    
                    if (accion.Type === 'Amarilla') {
                        // Inicializar el contador de amarillas para el jugador si no existe
                        if (!amarillasPorJugador.has(jugador.ID)) {
                            amarillasPorJugador.set(jugador.ID, 0);
                        }
    
                        // Incrementar el contador de amarillas del jugador
                        const nuevaCantidadAmarillas = amarillasPorJugador.get(jugador.ID) + 1;
                        amarillasPorJugador.set(jugador.ID, nuevaCantidadAmarillas);
    
                        // Si el jugador ha recibido dos amarillas, añadir una roja por doble amarilla
                        if (nuevaCantidadAmarillas === 2) {
                            rojas.push({
                                id_partido: idPartido,
                                id_jugador: jugador.ID,
                                minuto: parseInt(accion.Time),
                                descripcion: '',
                                motivo: 'Doble amarilla'
                            });
                        }
                    }
                });
            }
        });
    
        return rojas;
    };
    
    const bd_rojasLocal = generarBdRojas(match.Local, idPartido);
    const bd_rojasVisita = generarBdRojas(match.Visitante, idPartido);
    const bd_rojas = [...bd_rojasLocal, ...bd_rojasVisita];

    const generarBdAmarillas = (team, idPartido) => {
        const amarillas = [];
        team.Player?.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(accion => {
                    if (accion.Type === 'Amarilla') {
                        amarillas.push({
                            id_partido: idPartido,
                            id_jugador: jugador.ID,
                            minuto: parseInt(accion.Time)
                        });
                    }
                })
            }
        })
        return amarillas;
    }
    
    const bd_amarillasLocal = generarBdAmarillas(match.Local, idPartido);
    const bd_amarillasVisita = generarBdAmarillas(match.Visitante, idPartido);
    const bd_amarillas = [...bd_amarillasLocal, ...bd_amarillasVisita];
    
    const generarBdAsistencias = (team, idPartido) => {
        const asistencias = [];
        team.Player?.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(accion => {
                    if (accion.Type === 'Gol' && accion.Detail.withAssist) {
                        asistencias.push({
                            id_partido: idPartido,
                            id_jugador: parseInt(accion.Detail.idAssist),
                            minuto: parseInt(accion.Time)
                        });
                    }
                })
            }
        })
        return asistencias
    }

    const bd_asistenciasLocal = generarBdAsistencias(match.Local, idPartido);
    const bd_asistenciasVisita = generarBdAsistencias(match.Visitante, idPartido);
    const bd_asistencias = [...bd_asistenciasLocal, ...bd_asistenciasVisita];

    return {bd_goles, bd_rojas, bd_amarillas, bd_asistencias}

}

export default useGenerarBdStats;