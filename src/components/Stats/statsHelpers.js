export const obtenerTipoPartido = (partido) => {
    
    const { ida, vuelta } = partido;
    if (partido.id_partido === ida) return 'ida';
    if (partido.id_partido === vuelta) return 'vuelta';

    return null;
};

export const renderizarTituloPartido = (partido, zona) => {        
    const tipoPartido = obtenerTipoPartido(partido, zona);
    if (!tipoPartido) return null;        
    return `Partido de ${tipoPartido}`;
};