export const formacionesHelper = (formaciones, localTeamId, visitingTeamId) => {
    // Asegúrate de que formaciones sea un array
    const validFormaciones = Array.isArray(formaciones) ? formaciones : [];
    
    return validFormaciones.reduce((acc, formacion, index) => {
        // Determina el formato de los datos y estandariza
        const playerData = {
            id_equipo: formacion.id_equipo,
            id_jugador: formacion.id_jugador,
            dorsal: formacion.dorsal || index + 1,  // Usa dorsal si está presente, sino el índice + 1
            nombre: formacion.nombre || formacion.nombre_jugador.split(' ')[0],  // Separa el nombre
            apellido: formacion.apellido || formacion.nombre_jugador.split(' ').slice(1).join(' ')  // Separa el apellido
        };

        if (playerData.id_equipo === localTeamId) {
            acc.local.push(playerData);
        } else if (playerData.id_equipo === visitingTeamId) {
            acc.visitante.push(playerData);
        }

        return acc;
    }, { local: [], visitante: [] });
};
