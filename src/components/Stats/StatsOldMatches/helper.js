export const resultOfTheMatch = (partido, idEquipo) => {
    if (!partido || !idEquipo) return '';
    
    if (partido.id_equipoLocal === idEquipo) {
        if (partido.goles_local > partido.goles_visita) return 'win';
        if (partido.goles_local < partido.goles_visita) return 'loss';
        return 'draw';
    } else if (partido.id_equipoVisita === idEquipo) {
        if (partido.goles_visita > partido.goles_local) return 'win';
        if (partido.goles_visita < partido.goles_local) return 'loss';
        return 'draw';
    }
};

export const getResultColor = (result) => {
    switch (result) {
        case 'win': return 'var(--green)';
        case 'loss': return 'var(--red)';
        case 'draw': return 'var(--gray-200)';
    }
};
