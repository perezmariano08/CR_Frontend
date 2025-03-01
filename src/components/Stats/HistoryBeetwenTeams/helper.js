export const calcularEstadisticas = (partidos, idEquipoA, idEquipoB) => {
    let victoriasEquipoA = 0;
    let victoriasEquipoB = 0;
    let empates = 0;

    partidos.forEach(partido => {
        const { id_equipoLocal, id_equipoVisita, goles_local, goles_visita } = partido;

        if ((id_equipoLocal === idEquipoA && id_equipoVisita === idEquipoB) ||
            (id_equipoLocal === idEquipoB && id_equipoVisita === idEquipoA)) {

            let golesEquipoA, golesEquipoB;

            if (id_equipoLocal === idEquipoA) {
                golesEquipoA = goles_local;
                golesEquipoB = goles_visita;
            } else {
                golesEquipoA = goles_visita;
                golesEquipoB = goles_local;
            }

            if (golesEquipoA > golesEquipoB) {
                victoriasEquipoA++;
            } else if (golesEquipoB > golesEquipoA) {
                victoriasEquipoB++;
            } else {
                empates++;
            }
        }
    });

    const totalPartidos = victoriasEquipoA + victoriasEquipoB + empates;
    const porcentajeVictoriasEquipoA = totalPartidos ? Math.round((victoriasEquipoA / totalPartidos) * 100) : 0;
    const porcentajeVictoriasEquipoB = totalPartidos ? Math.round((victoriasEquipoB / totalPartidos) * 100) : 0;
    const porcentajeEmpates = totalPartidos ? Math.round((empates / totalPartidos) * 100) : 0;

    return {
        victoriasEquipoA,
        victoriasEquipoB,
        empates,
        porcentajeVictoriasEquipoA,
        porcentajeVictoriasEquipoB,
        porcentajeEmpates
    };
};
