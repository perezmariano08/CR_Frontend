import { useSelector } from "react-redux";

const useGenerarBdFormaciones = (idPartido) => {
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);

    const generarBdFormaciones = (team, idPartido) => {
        const jugadoresMap = new Map();
    
        // Initialize players with default stats
        team.Player?.forEach(jugador => {
            if (jugador.Dorsal) {
                jugadoresMap.set(jugador.ID, {
                    id_partido: idPartido,
                    id_jugador: jugador.ID,
                    dorsal: parseInt(jugador.Dorsal),
                    goles: 0,
                    asistencias: 0,
                    amarillas: 0,
                    rojas: 0
                });
            }
        });
    
        // Process actions and update player stats
        team.Player?.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(action => {
                    const jugadorData = jugadoresMap.get(jugador.ID);
                    if (jugadorData) {
                        switch (action.Type) {
                            case 'Gol':
                                jugadorData.goles += 1;
                                break;
                            case 'Amarilla':
                                jugadorData.amarillas += 1;
                                break;
                            case 'Roja':
                                jugadorData.rojas += 1;
                                break;
                            default:
                                break;
                        }
    
                        if (action.Detail.withAssist && action.Detail.idAssist) {
                            const asistenteID = parseInt(action.Detail.idAssist);
                            let asistente = jugadoresMap.get(asistenteID);
                            
                            if (asistente) {
                                asistente.asistencias += 1;
                            } else {
                                jugadoresMap.set(asistenteID, {
                                    id_partido: idPartido,
                                    id_jugador: asistenteID,
                                    dorsal: null,
                                    goles: 0,
                                    asistencias: 1,
                                    amarillas: 0,
                                    rojas: 0
                                });
                            }
                        }
                    }
                });
            }
        });
    
        return Array.from(jugadoresMap.values());
    };
    
    const bd_formacionesLocal = generarBdFormaciones(match.Local, idPartido);
    const bd_formacionesVisitante = generarBdFormaciones(match.Visitante, idPartido);
    const bd_formaciones = [...bd_formacionesLocal, ...bd_formacionesVisitante];

    return {bd_formaciones};
}  

export default useGenerarBdFormaciones;