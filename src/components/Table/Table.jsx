import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { TableContainerStyled } from './TableStyles';
import { setSelectedRows } from '../../redux/SelectedRows/selectedRowsSlice';
import { useDispatch, useSelector } from 'react-redux';

const Table = ({ data, dataColumns, arrayName, id_ }) => {
    const dispatch = useDispatch();
    const selectedProducts = useSelector((state) => state.selectedRows.selectedRows);
    const [rowClick, setRowClick] = useState(true);
    
    const imageBodyTemplate = rowData => (
        <div className="td-team">
            <img src={`/Escudos/${rowData.img}`} alt={rowData.nombre} />
            <span>{rowData.nombre}</span>
        </div>
    );

    const cellPlayerTemplate = rowData => (
        <div className="td-player">
            <img 
                src={`/Jugadores/${rowData.img}`} 
                alt={rowData.jugador} 
            />
            <span>{rowData.jugador}</span>
        </div>
    );

    const cellUserTemplate = rowData => (
        <div className="td-player">
            <img 
                src={`/Usuarios/${rowData.img}`} 
                alt={rowData.usuario} 
            />
            <span>{rowData.usuario}</span>
        </div>
    );

    const onSelectionChange = (e) => {
        dispatch(setSelectedRows(e.value));
    };


    return (
        <>
            <TableContainerStyled
                value={data}
                removableSort
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                emptyMessage="No hay datos disponibles"
                selectionMode={rowClick ? null : 'multiple'}
                selection={selectedProducts}
                onSelectionChange={onSelectionChange}
                dataKey={id_}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {dataColumns.map((col, i) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable
                        style={{ width: 'auto' }}
                        body={
                            arrayName === 'Equipos' && col.field === 'nombre'
                                ? imageBodyTemplate
                                : arrayName === 'Jugadores' && col.field === 'jugador'
                                ? cellPlayerTemplate
                                : null
                        }
                    />
                ))}
            </TableContainerStyled>
        </>
    );
};

export default Table;
