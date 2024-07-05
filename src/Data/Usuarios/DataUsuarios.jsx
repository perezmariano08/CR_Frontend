export const dataUsuariosColumns = [
    { field: 'dni', header: 'DNI' },
    { field: 'usuario', header: 'Nombre' },
    { field: 'nacimiento', header: 'Nacimiento' },
    { field: 'telefono', header: 'Telefono' },
    { field: 'rol', header: 'Rol' },
    { field: 'estado', header: 'Estado' },
    { field: 'equipo', header: 'Equipo FAV' }
];

export const dataUsuarios = [
    {
        id: 1,
        dni: '12345678',
        nombre: 'POZZO, Joaquín',
        nacimiento: '2001-06-09',
        telefono: '3512345678',
        email: 'pozzojoa@gmail.com',
        rol: 'ADMIN',
        estado: 'Activo',
        equipoFav: 'T-USA FC'
    },
    {
        id: 2,
        dni: '12345678',
        nombre: 'PEREYRA, Octavio',
        nacimiento: '2005-06-09',
        telefono: '3512345678',
        email: 'octa@gmail.com',
        rol: 'CAPITÁN',
        estado: 'Activo',
        equipoFav: 'T-USA FC'
    },
    {
        id: 3,
        dni: '12345678',
        nombre: 'PEREZ, Mariano',
        nacimiento: '2002-06-09',
        telefono: '3512345678',
        email: 'perezmariano.pm@gmail.com',
        rol: 'PLANILLERO',
        estado: 'Activo',
        equipoFav: '-'
    }
];