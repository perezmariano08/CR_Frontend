import React, { useState } from 'react';
import Content from '../../../components/Content/Content';
import LegajosMenuNav from './LegajosMenuNav';
import { dataEquiposColumns, dataEquiposLegajosColumns } from '../../../Data/Equipos/DataEquipos';
import { useSelector } from 'react-redux';
import Table from '../../../components/Table/Table';
import { URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';
import { EquipoBodyTemplate, LinkBodyTemplate } from '../../../components/Table/TableStyles';
import Input from '../../../components/UI/Input/Input';
import { BsCalendar2Event } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';

const LegajosEquipos = () => {
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const equipos = useSelector((state) => state.equipos.data);
    const planteles = useSelector((state) => state.planteles.data);
    
    // Estado para el input de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Función para actualizar el estado de búsqueda
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtrar los equipos en función del valor del input
    const filteredEquipos = equipos.filter((e) => 
        nombresEquipos(e.id_equipo).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const TablaEquipos = filteredEquipos.map((e) => ({
        ...e,
        equipo: (
            <EquipoBodyTemplate>
                <img src={`${URLImages}${escudosEquipos(e.id_equipo)}`} alt={nombresEquipos(e.id_equipo)} />
                <span>{nombresEquipos(e.id_equipo)}</span>
            </EquipoBodyTemplate>
        ),
        listas: `${new Set(planteles.filter((p) => p.id_equipo == e.id_equipo).map((p) => p.id_categoria)).size}`,
        jugadores: `${planteles.filter((p) => p.id_equipo == e.id_equipo).length}`,
        link: (
            <LinkBodyTemplate to={`/admin/ediciones/categorias/${e.id_equipo}`}>
                Ingresar
            </LinkBodyTemplate>
        ),
    }));

    return (
        <Content>
            <LegajosMenuNav />

            {/* Input de búsqueda */}
            <div style={{width: '50%'}}>
                <Input 
                    name='jornada'
                    icon={<BiSearch className='icon-input'/>} 
                    type="text" 
                    placeholder="Buscar" 
                    value={searchTerm} 
                    onChange={handleSearch} 
                />
            </div>

            {
                TablaEquipos.length > 0 ? <Table
                data={TablaEquipos}
                dataColumns={dataEquiposLegajosColumns}
                selection={false}
                sortable={false}
                id_={'id_equipo'}
                urlClick={`/admin/categorias/equipos/detalle/`}
                rowClickLink
            /> : 
            'No se encontraron equipos.'
            }

            
        </Content>
    );
};

export default LegajosEquipos;
