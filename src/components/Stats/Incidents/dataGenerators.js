export const generarBdFormaciones = (team, idPartido) => {
    const jugadoresMap = new Map();

    team.Player.forEach(jugador => {
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

    team.Player.forEach(jugador => {
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

export const generarBdGoles = (team, idPartido) => {
    const goles = [];
    team.Player.forEach(jugador => {
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
            });
        }
    });
    return goles;
};

export const generarBdRojas = (team, idPartido) => {
    const rojas = [];
    team.Player.forEach(jugador => {
        if (jugador.Actions) {
            jugador.Actions.forEach(action => {
                if (action.Type === 'Roja') {
                    rojas.push({
                        id_partido: idPartido,
                        id_jugador: jugador.ID,
                        minuto: parseInt(action.Time),
                        descripcion: '',
                        cantidad: 1
                    });
                }
            });
        }
    });
    return rojas;
};

export const generarBdAmarillas = (team, idPartido) => {
    const amarillas = [];
    team.Player.forEach(jugador => {
        if (jugador.Actions) {
            jugador.Actions.forEach(action => {
                if (action.Type === 'Amarilla') {
                    amarillas.push({
                        id_partido: idPartido,
                        id_jugador: jugador.ID,
                        minuto: parseInt(action.Time),
                        descripcion: '',
                        cantidad: 1
                    });
                }
            });
        }
    });
    return amarillas;
};
