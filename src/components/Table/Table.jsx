import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { TableContainerStyled } from './TableStyles';
import { setSelectedRows } from '../../redux/SelectedRows/selectedRowsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { VscKebabVertical } from "react-icons/vsc";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';

const Table = ({ data, dataColumns, arrayName, id_ }) => {
    const dispatch = useDispatch();
    const selectedProducts = useSelector((state) => state.selectedRows.selectedRows);
    const [rowClick, setRowClick] = useState(true);
    
    const formatDateTime = dateString => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '00-00-0000 00:00:00';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    // Traer equipos
    const roles = useSelector((state) => state.roles.data)
    const nombreRol = (idRol) => {
        const rol = roles.find((rol) => rol.id_rol === idRol);
        return rol ? rol.nombre : null;
    };

    // Traer equipos
    const equipos = useSelector((state) => state.equipos.data)
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        console.log(idEquipo);
        return equipo ? equipo.img : 'team-default.png';
    };

    const nombresEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        console.log(idEquipo);
        return equipo ? equipo.nombre : 'Nombre';
    };

    const usuarios = useSelector((state) => state.usuarios.data)
    const imagenUsuarios = (idUsuario) => {
        const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario);
        console.log(idUsuario);
        return usuario ? usuario.img : null;
    };


    const imagenUsuariosBody = rowData => (
        <div className="td-user" style={{minWidth: '200px'}}>
            <img src={`/Usuarios/${imagenUsuarios(rowData.id_usuario)}`} alt={rowData.usuario} />
            <span>{rowData.usuario}</span>
        </div>
    );

    const equipoBodyTemplate = (rowData, field) => (
        <div className="td-team" style={{minWidth: '140px'}}>
            <img src={`/Escudos/${escudosEquipos(rowData[field])}`} alt={rowData.nombre} />
            <span>{nombresEquipos(rowData[field])}</span>
        </div>
    );

    const rolBodyTemplate = rowData => {
        return nombreRol(rowData.id_rol)
    }

    const booleanoBodyTemplate = (rowData, field) => {
        if (rowData[field] === "N") {
            return "No"
        } else {
            return "Si"
        }
    }

    const fechaBodyTemplate = (rowData, field) => {
        return <div style={{minWidth: '140px'}}>
            {formatDateTime(rowData[field])}
        </div>
    }

    const jugadorBodyTemplate = rowData => (
        <div className="td-player">
            <img 
                src={`/Jugadores/${rowData.img}`} 
                alt={rowData.jugador} 
            />
            <span>{rowData.apellido.toUpperCase()}, {rowData.nombre}</span>
        </div>
    );
    

    const onSelectionChange = (e) => {
        dispatch(setSelectedRows(e.value));
    };

    const editRow = (rowData) => {
        // Aquí puedes definir la lógica para guardar los datos de la fila
        alert('Editando fila:', rowData);
        // Ejemplo: enviar datos a un servidor o actualizar el estado global
    };

    const editBodyTemplate = (rowData) => (
        <VscKebabVertical onClick={() => editRow(rowData)} />
    );
    return (
        <>
        <TableContainerStyled
                value={data}
                emptyMessage="No hay datos disponibles"
                removableSort
                paginator
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                rows={50}
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={rowClick ? null : 'multiple'}
                selection={selectedProducts}
                onSelectionChange={onSelectionChange}
                dataKey={id_}
                currentPageReportTemplate="{first} al {last} de {totalRecords}"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {dataColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable
                        style={{ width: 'auto' }}
                        body={
                            arrayName === 'Equipos' && col.field === 'nombre'
                            || arrayName === 'Usuarios' && col.field === 'equipo'
                            || arrayName === 'Jugadores' && col.field === 'id_equipo'
                                ? rowData => equipoBodyTemplate(rowData, 'id_equipo')
                                : arrayName === 'Jugadores' && col.field === 'jugador' 
                                ? jugadorBodyTemplate
                                : arrayName === 'Partidos' && col.field === 'id_equipoLocal'
                                ? rowData => equipoBodyTemplate(rowData, 'id_equipoLocal')
                                : arrayName === 'Partidos' && col.field === 'id_equipoVisita'
                                ? rowData => equipoBodyTemplate(rowData, 'id_equipoVisita')
                                : arrayName === 'Usuarios' && col.field === 'usuario'
                                ? imagenUsuariosBody
                                : arrayName === 'Usuarios' && col.field === 'id_rol'
                                ? rolBodyTemplate
                                : arrayName === 'Usuarios' && col.field === 'fecha_creacion'
                                ? rowData => fechaBodyTemplate(rowData, 'fecha_creacion')
                                : arrayName === 'Usuarios' && col.field === 'fecha_actualizacion'
                                ? rowData => fechaBodyTemplate(rowData, 'fecha_actualizacion')
                                : arrayName === 'Jugadores' && col.field === 'sancionado'
                                ? rowData => booleanoBodyTemplate(rowData, 'sancionado')
                                : arrayName === 'Jugadores' && col.field === 'eventual'
                                ? rowData => booleanoBodyTemplate(rowData, 'eventual')
                                : null
                        }
                    />
                ))}
            </TableContainerStyled>
        </>
    );
};

export default Table;
