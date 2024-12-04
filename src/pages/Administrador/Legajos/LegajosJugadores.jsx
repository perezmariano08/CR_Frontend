import React, { useEffect, useState } from 'react';
import Content from '../../../components/Content/Content';
import LegajosMenuNav from './LegajosMenuNav';
import { dataJugadoresLegajosColumns } from '../../../Data/Jugadores/Jugadores';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../components/Table/Table';
import { LinkBodyTemplate } from '../../../components/Table/TableStyles';
import Input from '../../../components/UI/Input/Input';
import { BiSearch } from 'react-icons/bi';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';

const LegajosJugadores = () => {
    const dispatch = useDispatch()
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

    useEffect(() => {
        dispatch(fetchJugadores());
        dispatch(fetchEquipos())
        dispatch(fetchPlanteles())
        dispatch(fetchTemporadas())
    }, []);

    
    const columns = [
        {
            field: "nombre_completo",
            header: "nombre completo",
            body: (rowData) => (
                `${rowData.apellido.toUpperCase()}, ${rowData.nombre}`
            ),
        },
        {
            field: "email",
            header: "email",
            body: (rowData) => {
                rowData.email ? '-' : '-'
            },
        },
        {
            field: "dni",
            header: "dni"
        },
        {
            field: "equipos",
            header: "cant. equipos",
            body: (rowData) => {
                const cantidadEquipos = new Set(
                    planteles.filter((p) => p.id_jugador === rowData.id_jugador)
                    .map((p) => p.id_categoria)
                ).size;
        
                return `${cantidadEquipos} ${cantidadEquipos === 1 ? "equipo" : "equipos"}`;
            },
        },
        {
            field: "listas",
            header: "cant. listas",
            body: (rowData) => {
                const cantidadListas = planteles.filter((p) => p.id_jugador === rowData.id_jugador).length;
                return `${cantidadListas} ${cantidadListas === 1 ? "lista" : "listas"}`;
            },
        },
        {
            field: "link",
            header: "",
            body: (rowData) => (
                    <LinkBodyTemplate to={`/admin/ediciones/categorias/${rowData.id_jugador}`}>
                        Ingresar
                    </LinkBodyTemplate>
            ),
        },
        
    ];

    return (
        <Content>
            <LegajosMenuNav />
            {/* Input de búsqueda */}
            {/* <div style={{ width: '50%' }}>
                <Input 
                    name='jornada'
                    icon={<BiSearch className='icon-input' />} 
                    type="text" 
                    placeholder="Buscar por nombre, apellido, DNI o email" 
                    value={searchTerm} 
                    onChange={handleSearch} 
                />
            </div> */}
            {
                jugadores.length > 0 ? (
                    <Table
                        data={jugadores}
                        dataColumns={columns}
                        selection={false}
                        sortable={false}
                        id_={'id_jugador'}
                        rowField="id_jugador" 
                        path="/admin/categorias/equipos/detalle"
                    />
                ) : (
                    'No se encontraron jugadores.'
                )
            }
        </Content>
    );
};

export default LegajosJugadores;
