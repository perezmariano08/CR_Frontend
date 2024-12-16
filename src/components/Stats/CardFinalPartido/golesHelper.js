export const calcularGolesConDetalle = (incidencias, partido) => {
    const { id_equipoLocal, id_equipoVisita } = partido;

    const resultado = {
        goles_local: [],
        goles_visita: []
    };

    incidencias.forEach((incidencia) => {
        if (incidencia.tipo === "Gol") {
            const gol = {
                id_gol: incidencia.id_accion,
                nombre: incidencia.nombre,
                apellido: incidencia.apellido,
                minuto: incidencia.minuto,
                dorsal: incidencia.dorsal,
                en_contra: incidencia.en_contra,
                penal: incidencia.penal_
            };

            // Si el gol es en contra, sumarlo al equipo contrario
            if (incidencia.en_contra === 'S') {
                if (incidencia.id_equipo === id_equipoLocal) {
                    resultado.goles_visita.push(gol);  // Gol en contra del equipo local
                } else if (incidencia.id_equipo === id_equipoVisita) {
                    resultado.goles_local.push(gol);  // Gol en contra del equipo visita
                }
            } else {
                // Si no es gol en contra, sumar al equipo correspondiente
                if (incidencia.id_equipo === id_equipoLocal) {
                    resultado.goles_local.push(gol);
                } else if (incidencia.id_equipo === id_equipoVisita) {
                    resultado.goles_visita.push(gol);
                }
            }
        }
    });

    // Ordenar los goles por minuto
    resultado.goles_local.sort((a, b) => a.minuto - b.minuto);
    resultado.goles_visita.sort((a, b) => a.minuto - b.minuto);

    return resultado;
};
