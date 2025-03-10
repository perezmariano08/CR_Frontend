import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { TableContainerStyled } from './TableStyles';
import { setSelectedRows } from '../../redux/SelectedRows/selectedRowsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { VscKebabVertical } from "react-icons/vsc";
import { URLImages } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

const Table = ({ data, dataColumns, arrayName, id_ , paginator = 'true', selection = true , urlClick, rowClickLink = false, sortable = true, rowField, path}) => {

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

    const formatPartidoDateTime = dateString => {
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
    
        return `${day}/${month}/${year}`;
    }

    const roles = useSelector((state) => state.roles.data)
    const nombreRol = (idRol) => {
        const rol = roles.find((rol) => rol.id_rol === idRol);
        return rol ? rol.nombre : null;
    };

    const equipos = useSelector((state) => state.equipos.data)
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo.img !== null ? equipo.img : '/uploads/Equipos/team-default.png';
    };

    const nombresEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : '';
    };

    const usuarios = useSelector((state) => state.usuarios.data)
    const imagenUsuarios = (idUsuario) => {
        const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario);
        return usuario ? usuario.img : null;
    };

    const imagenUsuariosBody = rowData => (
        <div className="td-user" style={{minWidth: '200px'}}>
            <img src={`${URLImages}${imagenUsuarios(rowData.id_usuario)}`} alt={rowData.usuario} />
            <span>{rowData.usuario}</span>
        </div>
    );

    const equipoBodyTemplate = (rowData, field) => {
        if (!rowData[field]) {
            return (
                <div className="td-temporada orange">
                    Falta equipo
                </div>
            );
        }
    
        return (
            <div className="td-team" style={{minWidth: '140px'}}>
                <img src={`${URLImages}${escudosEquipos(rowData[field])}`} alt={nombresEquipos(rowData[field])} />
                <span>{nombresEquipos(rowData[field])}</span>
            </div>
        );
    };
    
    const rolBodyTemplate = rowData => {
        return nombreRol(rowData.id_rol)
    }

    const golNuloTemplate = (rowData, field) => {
        if (rowData[field] === null) {
            return "-"
        } else {
            return rowData[field]
        }
    }

    const booleanoBodyTemplate = (rowData, field) => {
        if (rowData[field] === "N") {
            return "No"
        } else {
            return "Si"
        }
    }

    const estadoBodyTemplate = (rowData, field) => {
        if (rowData[field] === "N") {
            return <div className="td-estado activo">
                Activo
            </div>
        } else {
            return <div className="td-estado inactivo">
                Inactivo
            </div>
        }
    }

    const estadoAIBodyTemplate = (rowData, field) => {
        if (rowData[field] === "I") {
            return <div className="td-estado activo">
                Finalizada
            </div>
        } else {
            return <div className="td-estado proceso">
                <RiLoader4Fill/>
                En proceso
            </div>
        }
    }

    const estadoUsuarioBodyTemplate = (rowData, field) => {
        if (rowData[field] === "A") {
            return <div className="td-estado activo">
                Activo
            </div>
        } else {
            return <div className="td-estado inactivo">
                Inactivo
            </div>
        }
    }

    const estadoTemporadaEquipo = (rowData, field) => {
        if (rowData[field] === null) {
            return <div className="td-temporada orange">
                Falta temporada
            </div>
        } else {
            return <div>
                {rowData.temporada}
            </div>
        }
    }

    const fechaBodyTemplate = (rowData, field) => {
        return <div style={{minWidth: '140px'}}>
            {formatDateTime(rowData[field])}
        </div>
    }

    const fechaPartidoBodyTemplate = (rowData, field) => {
        return <div>
            {formatPartidoDateTime(rowData[field])}
        </div>
    }

    const jugadorBodyTemplate = rowData => {
        if (rowData.sancionado === "S"){
            return <div className="td-player">
                <span className='circulo rojo'></span>
                <img 
                    src={`/Jugadores/${rowData.img}`} 
                    alt={rowData.jugador} 
                />
                <span>{rowData.apellido.toUpperCase()}, {rowData.nombre}</span>
                
            </div>
        } else {
            return <div className="td-player">
                <span className='circulo verde'></span>
                <img 
                    src={`/Jugadores/${rowData.img}`} 
                    alt={rowData.jugador} 
                />
                <span>{rowData.apellido.toUpperCase()}, {rowData.nombre}</span>
            </div>
        }
    };
    
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

    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleRowClick = (e) => {
        const fieldValue = e.data[rowField]; // Obtiene el valor del campo dinámico de la fila seleccionada        
        navigate(`${path}/${fieldValue}`); // Navega a la página de detalles usando el path y el valor del campo
    };

    return (
        <>
        <TableContainerStyled
                value={data}
                emptyMessage="No hay datos disponibles"
                removableSort
                paginator={paginator}
                rows={25}
                rowsPerPageOptions={[5, 10, 25, 50]}
                selectionMode={rowClick ? null : 'multiple'}
                selection={selectedProducts}
                onSelectionChange={onSelectionChange}
                dataKey={id_}
                // onRowClick={rowClickLink ? (e) => handleRowClicks(e.data) : null} Condicional para onRowClick
                onRowClick={rowField ? handleRowClick :  null} // Condicional para onRowClick
            >
                {
                    selection && (
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    )
                }
                {dataColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable={sortable}
                        style={{ width: 'auto' }}
                        body={
                            col.body ? col.body :
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
                                : arrayName === 'Partidos' && col.field === 'dia'
                                ? rowData => fechaPartidoBodyTemplate(rowData, 'dia')
                                : arrayName === 'Jugadores' && col.field === 'sancionado'
                                ? rowData => booleanoBodyTemplate(rowData, 'sancionado')
                                : arrayName === 'Jugadores' && col.field === 'eventual'
                                ? rowData => booleanoBodyTemplate(rowData, 'eventual')
                                : arrayName === 'Partidos' && col.field === 'goles_local'
                                ? rowData => golNuloTemplate(rowData, 'goles_local')
                                : arrayName === 'Partidos' && col.field === 'goles_visita'
                                ? rowData => golNuloTemplate(rowData, 'goles_visita')
                                : arrayName === 'Usuarios' && col.field === 'estado'
                                ? rowData => estadoUsuarioBodyTemplate(rowData, 'estado')
                                : arrayName === 'Equipos' && col.field === 'temporada'
                                ? rowData => estadoTemporadaEquipo(rowData, 'temporada')
                                : null
                        }
                    />
                ))}
            </TableContainerStyled>
        </>
    );
};

export default Table;
