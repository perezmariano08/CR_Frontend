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
    const porcentajeVictoriasLocal = (victoriasLocal / totalPartidos) * 100;
    const porcentajeVictoriasVisita = (victoriasVisita / totalPartidos) * 100;
    const porcentajeEmpates = (empates / totalPartidos) * 100;

    return {
        victoriasLocal,
        victoriasVisita,
        empates,
        porcentajeVictoriasLocal,
        porcentajeVictoriasVisita,
        porcentajeEmpates
    };
}