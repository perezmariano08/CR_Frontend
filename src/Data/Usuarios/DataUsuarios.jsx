export const dataUsuariosColumns = [
    { field: 'dni', header: 'DNI' },
    { field: 'usuario', header: 'Usuario' },
    { field: 'id_rol', header: 'Rol' },
    { field: 'nacimiento', header: 'Nacimiento' },
    { field: 'telefono', header: 'Telefono' },
    { field: 'email', header: 'Email' },
    { field: 'equipo', header: 'Equipo favorito' },
    { field: 'estado', header: 'Estado' },
    { field: 'fecha_creacion', header: 'Creacion' },
    { field: 'fecha_actualizacion', header: 'Actualizacion' }
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