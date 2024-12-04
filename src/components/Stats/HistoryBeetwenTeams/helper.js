export const calcularEstadisticas = (partidos, idEquipoA, idEquipoB) => {
    let victoriasEquipoA = 0;
    let victoriasEquipoB = 0;
    let empates = 0;

    partidos.forEach(partido => {
        const { id_equipoLocal, id_equipoVisita, goles_local, goles_visita } = partido;

        // Determinar si Equipo A es local o visitante
        const esEquipoALocal = id_equipoLocal === idEquipoA;
        const esEquipoBLocal = id_equipoLocal === idEquipoB;

        const golesEquipoA = esEquipoALocal ? goles_local : goles_visita;
        const golesEquipoB = esEquipoBLocal ? goles_local : goles_visita;

        if (golesEquipoA > golesEquipoB) {
            victoriasEquipoA++;
        } else if (golesEquipoB > golesEquipoA) {
            victoriasEquipoB++;
        } else {
            empates++;
        }
    });

    const totalPartidos = partidos.length;
    const porcentajeVictoriasEquipoA = Math.round((victoriasEquipoA / totalPartidos) * 100) || 0;
    const porcentajeVictoriasEquipoB = Math.round((victoriasEquipoB / totalPartidos) * 100) || 0;
    const porcentajeEmpates = Math.round((empates / totalPartidos) * 100) || 0;

    return {
        victoriasEquipoA,
        victoriasEquipoB,
        empates,
        porcentajeVictoriasEquipoA,
        porcentajeVictoriasEquipoB,
        porcentajeEmpates
    };
};
