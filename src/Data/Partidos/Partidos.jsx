export const dataPartidosColumns = [
    { field: 'acciones', header: '', sortable: true },
    { field: 'id_equipoLocal', header: <div style={{textAlign: 'end', width:'100%'}}>Local</div>, sortable: true },
    { field: 'resultado', header: '', sortable: false},
    { field: 'id_equipoVisita', header: 'Visitante', sortable: true },
    { field: 'dia', header: 'Dia', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true },
    { field: 'hora', header: 'Hora', sortable: true },
    { field: 'planillero', header: 'Planillero', sortable: true },
    { field: 'cancha', header: 'Cancha', sortable: true },
    { field: 'arbitro', header: 'Árbitro', sortable: true },
    
    // { field: 'descripcion', header: 'Descripcion', sortable: true },
];

export const dataFormacionesPartidoColumns = [
    { field: 'acciones', header: '', sortable: true },
    { field: 'dorsal', header: '#', sortable: true },
    { field: 'id_jugador', header: 'Jugador', sortable: true },
    { field: 'dni', header: 'DNI', sortable: true },
    // { field: 'descripcion', header: 'Descripcion', sortable: true },
];

export const dataPartidos = []