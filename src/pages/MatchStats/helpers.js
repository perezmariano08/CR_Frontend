export const formacionesHelper = (formaciones, localTeamId, visitingTeamId) => {
    return (formaciones || []).reduce((acc, formacion) => {
        const { id_jugador, id_equipo, dorsal, nombre, apellido } = formacion;

        const playerData = {
            id_equipo,
            id_jugador,
            dorsal,
            nombre,
            apellido,
        };

        if (id_equipo === localTeamId) {
            acc.local.push(playerData);
        } else if (id_equipo === visitingTeamId) {
            acc.visitante.push(playerData);
        }

        return acc;
    }, { local: [], visitante: [] });
};
