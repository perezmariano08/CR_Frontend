import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const matchesSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        manageDorsal: (state, action) => {
            const { idPartido, playerId, dorsal, assign } = action.payload;

            // Find the specific match by idPartido
            const match = state.find(match => match.ID === idPartido);
            if (!match) {
                console.error('Partido no encontrado');
                return;
            }

            let playerFound = false;

            // Search in the Local team
            let player = match.Local.Player.find(p => p.ID === playerId);
            if (player) {
                playerFound = true;
                if (assign) {
                    // Ensure no other player has the same dorsal
                    if (!match.Local.Player.some(p => p.Dorsal === dorsal && p.ID !== playerId)) {
                        player.Dorsal = dorsal;
                        player.status = true;
                    }
                } else {
                    if (player.Dorsal === dorsal) {
                        player.Dorsal = '';
                        player.status = false;
                    }
                }
            }

            // Search in the Visitante team if not found in the Local team
            if (!playerFound) {
                player = match.Visitante.Player.find(p => p.ID === playerId);
                if (player) {
                    if (assign) {
                        // Ensure no other player has the same dorsal
                        if (!match.Visitante.Player.some(p => p.Dorsal === dorsal && p.ID !== playerId)) {
                            player.Dorsal = dorsal;
                            player.status = true;
                        }
                    } else {
                        if (player.Dorsal === dorsal) {
                            player.Dorsal = '';
                            player.status = false;
                        }
                    }
                }
            }
        },
        addEventualPlayer: (state, action) => {
            const { idPartido, teamId, player } = action.payload;
        
            // Find the match with the given idPartido
            const match = state.find((match) => match.ID === idPartido);
        
            if (match) {
                // Determine if the team is local or visitante
                const isLocal = match.Local.id_equipo === teamId;
                const team = isLocal ? match.Local : match.Visitante;
        
                // Count eventual players in the team
                const eventualPlayersCounts = team.Player.filter((p) => p.eventual === 'S').length;
        
                if (eventualPlayersCounts < 3) {
                    // Check if the player already exists by DNI or Dorsal
                    const existingPlayerIndex = team.Player.findIndex((p) => p.DNI === player.DNI || p.Dorsal === player.Dorsal);
        
                    if (existingPlayerIndex !== -1) {
                        // Update existing player information
                        team.Player[existingPlayerIndex] = { ...team.Player[existingPlayerIndex], ...player };
                    } else {
                        // Add new player
                        team.Player.push(player);
                    }
        
                    // Update the team in the match
                    if (isLocal) {
                        match.Local = { ...match.Local, Player: [...team.Player] };
                    } else {
                        match.Visitante = { ...match.Visitante, Player: [...team.Player] };
                    }
                } else {
                    console.log('Limite de 3 jugadores eventuales alcanzado');
                }
            } else {
                console.log('Partido no encontrado');
            }
        },
        setMatches: (state, action) => {
            const existingMatches = state.map(match => ({
                ...match,
                Local: {
                    ...match.Local,
                    Player: match.Local.Player.map(player => ({
                        ...player,
                        Dorsal: player.Dorsal || '',
                        status: player.status || false,
                    }))
                },
                Visitante: {
                    ...match.Visitante,
                    Player: match.Visitante.Player.map(player => ({
                        ...player,
                        Dorsal: player.Dorsal || '',
                        status: player.status || false,
                    }))
                }
            }));

            const newMatches = action.payload.map(newMatch => {
                const existingMatch = existingMatches.find(match => match.ID === newMatch.ID);

                if (existingMatch) {
                    return {
                        ...newMatch,
                        Local: {
                            ...newMatch.Local,
                            Player: newMatch.Local.Player.map(player => {
                                const existingPlayer = existingMatch.Local.Player.find(p => p.ID === player.ID);
                                return existingPlayer ? { ...player, Dorsal: existingPlayer.Dorsal, status: existingPlayer.status } : player;
                            })
                        },
                        Visitante: {
                            ...newMatch.Visitante,
                            Player: newMatch.Visitante.Player.map(player => {
                                const existingPlayer = existingMatch.Visitante.Player.find(p => p.ID === player.ID);
                                return existingPlayer ? { ...player, Dorsal: existingPlayer.Dorsal, status: existingPlayer.status } : player;
                            })
                        }
                    };
                }

                return newMatch;
            });

            return newMatches;
        },
        addActionToPlayer: (state, action) => {
            const { partidoId, actionData } = action.payload;
            const match = state.find(match => match.ID === partidoId);
        
            if (match) {
                const team = match.Local.id_equipo === actionData.isLocalTeam ? match.Local : match.Visitante;
                const player = team.Player.find(p => p.ID === actionData.idJugador);
        
                if (player) {
                    if (!player.Actions) {
                        player.Actions = [];
                    }
        
                    player.Actions.push({
                        ID: actionData.id,
                        Type: actionData.accion,
                        Time: actionData.minuto,
                        Detail: actionData.detail || null,
                        Sancion: actionData.tipoExpulsion
                    });
        
                    // Lógica para sanciones
                    const yellowCards = player.Actions.filter(action => action.Type === 'Amarilla').length;
                    const redCards = player.Actions.filter(action => action.Type === 'Roja').length;
                    if (yellowCards >= 2 || redCards >= 1) {
                        player.sancionado = 'S';
                    }
                } else {
                    console.warn('Jugador no encontrado en el equipo');
                }
            } else {
                console.warn('Partido no encontrado');
            }
        },
        deleteTotalActionsToPlayer: (state, action) => {
            const { idPartido, idEquipo, idJugador } = action.payload;
            const match = state.find(match => match.ID === idPartido);
        
            if (match) {
                const team = match.Local.id_equipo === idEquipo ? match.Local : match.Visitante;
                const playerIndex = team.Player.findIndex(p => p.ID === idJugador);
                const player = team.Player.find(p => p.ID === idJugador);
        
                if (player) {
                    if (player.eventual === 'S') {
                        team.Player = team.Player.filter(p => p.ID !== idJugador);
                        return;
                    }
        
                    if (playerIndex !== -1) {
                        team.Player[playerIndex].Actions = [];
                        team.Player[playerIndex].Dorsal = '';
                        team.Player[playerIndex].status = false;
                        team.Player[playerIndex].sancionado = 'N';
                    } else {
                        console.error('Jugador no encontrado');
                    }
                } else {
                    console.error('Jugador no encontrado');
                }
            } else {
                console.error('Partido no encontrado', idPartido);
            }
        },
        deleteActionToPlayer: (state, action) => {
            const { actionToDelete } = action.payload;
            const match = state.find(match => match.ID === actionToDelete.idPartido);
        
            if (match) {
                const team = match.Local.id_equipo === actionToDelete.idEquipo ? match.Local : match.Visitante;
                const player = team.Player.find(p => p.ID === actionToDelete.idJugador);
        
                if (player) {
                    const sancionesActuales = player.Actions ? player.Actions.filter(accion => accion.ID !== actionToDelete.ID) : [];
                    player.Actions = sancionesActuales.length > 0 ? sancionesActuales : [];
        
                    const yellowCards = player.Actions.filter(action => action.Type === 'Amarilla').length;
                    const redCards = player.Actions.filter(action => action.Type === 'Roja').length;
                    player.sancionado = (yellowCards >= 2 || redCards >= 1) ? 'S' : 'N';
                }
            }
        },
        editActionToPlayer: (state, action) => {
            const { partidoId, actionData } = action.payload;
            const match = state.find(match => match.ID === partidoId);
        
            if (match) {
                const team = match.Local.id_equipo === actionData.isLocalTeam ? match.Local : match.Visitante;
                const player = team.Player.find(p => p.ID === actionData.idJugador);
        
                if (player) {
                    if (!player.Actions) {
                        player.Actions = [];
                    }
        
                    const actionIndex = player.Actions.findIndex(act => act.ID === actionData.id);
                    if (actionIndex !== -1) {
                        const updatedAction = {
                            ...player.Actions[actionIndex],
                            Type: actionData.accion,
                            Time: actionData.minuto,
                            Detail: {
                                ...player.Actions[actionIndex].Detail,
                                ...actionData.detail
                            },
                            Sancion: actionData.tipoExpulsion
                        };
                        player.Actions[actionIndex] = updatedAction;
                    } else {
                        console.warn('Acción no encontrada en las acciones del jugador');
                    }
        
                    const yellowCards = player.Actions.filter(action => action.Type === 'Amarilla').length;
                    const redCards = player.Actions.filter(action => action.Type === 'Roja').length;
                    player.sancionado = (yellowCards >= 2 || redCards >= 1) ? 'S' : 'N';
                } else {
                    console.warn('Jugador no encontrado en el equipo');
                }
            } else {
                console.warn('Partido no encontrado');
            }
        },
        toggleStateMatch: (state, action) => {
            const match = state.find(match => match.ID === action.payload);

            if (match) {
                if (match.matchState === null) {
                    match.matchState = 'isStarted';
                } else if (match.matchState === 'isStarted') {
                    match.matchState = 'isFinish';
                } else if (match.matchState === 'isFinish'){
                    match.matchState = 'matchPush';
                }
            }
        },
        addDescToMatch: (state, action) => {
            const { descToMatch, idPartido } = action.payload;
            const match = state.find(match => match.ID === idPartido)
            if (match) {
                match.descripcion = descToMatch;
            } else {
                console.error('Partido inexistente');
            }
        },
        addBestPlayerOfTheMatch: (state, action) => {
            const {idPartido, player} = action.payload;
            const match = state.find(match => match.ID === idPartido)
            if (match) {
                if (player) {
                    match.jugador_destacado = player.ID
                } else {
                    console.error('Jugador inexistente');
                }
            } else {
                console.error('Partido inexistente');
            }
        }
    }
});

export const {
    manageDorsal,
    addEventualPlayer,
    setMatches,
    addActionToPlayer,
    toggleStateMatch,
    deleteActionToPlayer,
    editActionToPlayer,
    deleteTotalActionsToPlayer,
    addDescToMatch,
    addBestPlayerOfTheMatch
} = matchesSlice.actions;

export default matchesSlice.reducer;
