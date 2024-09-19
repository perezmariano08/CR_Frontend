import React from 'react'
import { TableContainerStyled, TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../Table/TableStyles'
import { Column } from 'primereact/column';
import { URLImages } from '../../../utils/utils';
import { useSelector } from 'react-redux';
import { StatsNull } from '../../../pages/Stats/StatsStyles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Auth/AuthContext';

const TablePosiciones = ({ data, zona, dataColumns }) => {
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const equipos = useSelector((state) => state.equipos.data);
    const navigate = useNavigate();

    if (!zona) {
        return null;
    }

    if (!data || data.length === 0) {
        return <StatsNull>No hay datos disponibles.</StatsNull>;
    }

    const body = (rowData) => {
        if (rowData.pos === 1) {
            return <div className="pos green">{rowData.pos}</div>;
        } else if (rowData.pos > 1 && rowData.pos < 4) {
            return <div className="pos orange">{rowData.pos}</div>;
        } else if (rowData.pos > 3 && rowData.pos < 7) {
            return <div className="pos red">{rowData.pos}</div>;
        } else {
            return <div className="pos">{rowData.pos}</div>;
        }
    };

    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo.img !== null ? equipo.img : '/uploads/Equipos/team-default.png';
    };

    const equipoBodyTemplate = (rowData) => (
        <div className="team" style={{ minWidth: '140px', cursor: 'pointer' }} 
            onClick={() => verPaginaEquipo(rowData.id_equipo)}
        >
            <img src={`${URLImages}${escudosEquipos(rowData.id_equipo)}`} alt={rowData.equipo}/>
            <span>{rowData.equipo}</span>
        </div>
    );

    const nombreTorneo = zona.nombre_edicion;

    const verPaginaEquipo = (idEquipo) => {
        navigate(`/my-team?idEquipo=${idEquipo}`);
    }

    // Aquí defines la clase para resaltar la fila de tu equipo
    const rowClassName = (rowData) => {
        return {
            'my-team-row': rowData.id_equipo === idMyTeam // Aplica la clase si el id del equipo coincide con el de tu equipo
        };
    }

    return (
        <TableContainerStyled>
            <TableTitle>
                <h3>{nombreTorneo}</h3>
                <p>{zona.nombre_categoria} - {zona.nombre_zona}</p>
            </TableTitle>
            <TableTitleDivider/>
            <TableWrapper
                value={data}
                emptyMessage="No hay datos disponibles"
                rowClassName={rowClassName}  // Aplica la función de clase de fila
            >
                {dataColumns.map((col) => (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    sortable
                    style={{ width: 'auto' }}
                    body={
                        // col.field === 'pos'
                        // ? body
                        //: 
                        col.field === 'nombre'
                        ? equipoBodyTemplate
                        : null
                    }
                />
            ))}
            </TableWrapper>
            {/* <TableTitleDivider/> */}
            {/* <TableFoot>
                <TableFootItem>
                    <div className='one'></div>
                    <h3>Copa Oro</h3>
                </TableFootItem>
                <TableFootItem>
                    <div className='two'></div>
                    <h3>Copa Plata</h3>
                </TableFootItem>
                <TableFootItem>
                    <div className='three'></div>
                    <h3>Copa Bronce</h3>
                </TableFootItem>
            </TableFoot> */}
        </TableContainerStyled>
    )
}

export default TablePosiciones;
