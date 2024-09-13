import { useSelector } from "react-redux";

const useBdPartido = (idPartido) => {
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);
    const descToMatch = useSelector((state) => state.planillero.timeMatch.desc);
    const jugadorDestacado = useSelector((state) => state.planillero.timeMatch.mvp);
    const penales = useSelector((state) => state.planillero.penales);

    const contarGoles = (players) => {
        return players?.reduce((acc, player) => {
            if (player.Actions) {
                player.Actions.forEach(action => {
                    if (action.Type === 'Gol') {
                        if (action.Detail.enContra === 'si') {
                            // Si el gol es en contra, sumar al otro equipo
                            acc.golesEnContra++;
                        } else {
                            // Gol normal
                            acc.golesNormal++;
                        }
                    }
                });
            }
            return acc;
        }, { golesNormal: 0, golesEnContra: 0 });
    };
    
    // Contamos los goles para el equipo local
    const golesLocal = contarGoles(match.Local.Player);
    const golesVisita = contarGoles(match.Visitante.Player);
    
    const bd_partido = {
        id_partido: idPartido,
        goles_local: golesLocal?.golesNormal + golesVisita?.golesEnContra,
        goles_visita: golesVisita?.golesNormal + golesLocal?.golesEnContra,
        pen_local: penales?.penal_local,
        pen_visita: penales?.penal_visita,
        descripcion: descToMatch,
        id_jugador_destacado: parseFloat(jugadorDestacado)
    };

    return { bd_partido };
}

export default useBdPartido
