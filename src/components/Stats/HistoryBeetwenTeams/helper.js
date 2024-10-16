export const calcularEstadisticas = (partidos) => {
    let victoriasLocal = 0;
    let victoriasVisita = 0;
    let empates = 0;

    partidos.forEach(partido => {
        const { goles_local, goles_visita } = partido;

        if (goles_local > goles_visita) {
            victoriasLocal++;
        } else if (goles_visita > goles_local) {
            victoriasVisita++;
        } else {
            empates++;
        }
    });

    const totalPartidos = partidos.length;
    const porcentajeVictoriasLocal = Math.round((victoriasLocal / totalPartidos) * 100) || 0;
    const porcentajeVictoriasVisita = Math.round((victoriasVisita / totalPartidos) * 100) || 0;
    const porcentajeEmpates = Math.round((empates / totalPartidos) * 100) || 0;

    return {
        victoriasLocal,
        victoriasVisita,
        empates,
        porcentajeVictoriasLocal,
        porcentajeVictoriasVisita,
        porcentajeEmpates
    };
}