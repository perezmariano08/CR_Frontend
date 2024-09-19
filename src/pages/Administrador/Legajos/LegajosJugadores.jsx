import React, { useState } from 'react';
import Content from '../../../components/Content/Content';
import LegajosMenuNav from './LegajosMenuNav';
import { dataJugadoresLegajosColumns } from '../../../Data/Jugadores/Jugadores';
import { useSelector } from 'react-redux';
import Table from '../../../components/Table/Table';
import { LinkBodyTemplate } from '../../../components/Table/TableStyles';
import Input from '../../../components/UI/Input/Input';
import { BiSearch } from 'react-icons/bi';

const LegajosJugadores = () => {
    const jugadores = useSelector((state) => state.jugadores.data);
    const planteles = useSelector((state) => state.planteles.data);

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Función para actualizar el estado con el valor del input
    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase()); // Convertir el término a minúsculas para una búsqueda insensible a mayúsculas
    };

    // Filtrar los jugadores en función del término de búsqueda (apellido, nombre, dni o email)
    const filteredJugadores = jugadores.filter((e) => {
        const fullName = `${e.apellido.toUpperCase()}, ${e.nombre}`.toLowerCase(); // Apellido y nombre concatenados
        return (
            fullName.includes(searchTerm) ||
            e.dni?.toString().includes(searchTerm) || // Comparar con el DNI si está presente
            e.email?.toLowerCase().includes(searchTerm) // Comparar con el email
        );
    });

    const TablaJugadores = filteredJugadores.map((e) => ({
        ...e,
        listas: `${new Set(planteles.filter((p) => p.id_jugador === e.id_jugador).map((p) => p.id_categoria)).size}`,
        equipos: `${planteles.filter((p) => p.id_jugador === e.id_jugador).length}`,
        link: (
            <LinkBodyTemplate to={`/admin/ediciones/categorias/${e.id_jugador}`}>
                Ingresar
            </LinkBodyTemplate>
        ),
        nombre: `${e.apellido.toUpperCase()}, ${e.nombre}`
    }));

    return (
        <Content>
            <LegajosMenuNav />
            {/* Input de búsqueda */}
            <div style={{ width: '50%' }}>
                <Input 
                    name='jornada'
                    icon={<BiSearch className='icon-input' />} 
                    type="text" 
                    placeholder="Buscar por nombre, apellido, DNI o email" 
                    value={searchTerm} 
                    onChange={handleSearch} 
                />
            </div>
            {
                TablaJugadores.length > 0 ? (
                    <Table
                        data={TablaJugadores}
                        dataColumns={dataJugadoresLegajosColumns}
                        paginator={false}
                        selection={false}
                        sortable={false}
                        id_={'id_equipo'}
                        urlClick={`/admin/categorias/equipos/detalle/`}
                        rowClickLink
                    />
                ) : (
                    'No se encontraron jugadores.'
                )
            }
        </Content>
    );
};

export default LegajosJugadores;
