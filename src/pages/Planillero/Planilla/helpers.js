export const alignmentTeamToFinish = (partido, formaciones) => {
    const { Local, Visitante } = partido;
    const localTeamId = Local.id_equipo;
    const visitingTeamId = Visitante.id_equipo;

    return formaciones.reduce((acc, formacion) => {
        const { id_jugador, id_equipo, dorsal, nombre, apellido } = formacion;
        
        const playerData = {
            id_equipo,
            id_jugador,
            dorsal,
            nombre,
            apellido
        };

        if (id_equipo === localTeamId) {
            acc.local.push(playerData);
        } else if (id_equipo === visitingTeamId) {
            acc.visitante.push(playerData);
        }

        return acc;
    }, { local: [], visitante: [] });
};
