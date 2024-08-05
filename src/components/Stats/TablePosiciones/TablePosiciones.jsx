import React from 'react'
import { TableContainerStyled, TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../Table/TableStyles'
import { Column } from 'primereact/column';
import { URL } from '../../../utils/utils';
import { useSelector } from 'react-redux';
import { StatsNull } from '../../../pages/Stats/StatsStyles';
import { useNavigate } from 'react-router-dom';

const TablePosiciones = ({ data, temporada, dataColumns }) => {
    const equipos = useSelector((state) => state.equipos.data);
    const navigate = useNavigate();
    if (!temporada) {
        return null;
    }

    if (!data || data.length === 0) {
        return <StatsNull>No hay datos disponibles.</StatsNull>;
    }

    const body = rowData => {
        if (rowData.pos === 1) {
            return <div className="pos green">{rowData.pos}</div>
        } else if ( rowData.pos > 1 && rowData.pos < 4 ) {
            return <div className="pos orange">{rowData.pos}</div>
        } else if ( rowData.pos > 3 && rowData.pos < 7 ) {
            return <div className="pos red">{rowData.pos}</div>
        }
    };

    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : 'team-default.png';
    };

    const equipoBodyTemplate = (rowData, field) => (
        <div className="team" style={{minWidth: '140px', cursor: 'pointer'}} 
            onClick={() => verPaginaEquipo(rowData.id_equipo)}
        >
            <img src={`${URL}${escudosEquipos(rowData.id_equipo)}`} alt={rowData.nombre}/>
            <span>{rowData.nombre}</span>
        </div>
    );

    const nombreTorneo = `${temporada.torneo} ${temporada.año}`;

    const verPaginaEquipo = (idEquipo) => {
        navigate(`/my-team?idEquipo=${idEquipo}`);
    }

    return (
        <TableContainerStyled>
            <TableTitle>
                <h3>{nombreTorneo}</h3>
                <p>{temporada.division}</p>
            </TableTitle>
            <TableTitleDivider/>
            <TableWrapper
                    value={data}
                    emptyMessage="No hay datos disponibles"
                >
                {dataColumns.map((col) => (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    sortable
                    style={{ width: 'auto' }}
                    body={
                        col.field === 'pos'
                        ? body
                        : col.field === 'nombre'
                        ? equipoBodyTemplate
                        : null
                    }
                />
            ))}
            </TableWrapper>
            <TableTitleDivider/>
            <TableFoot>
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
            </TableFoot>
        </TableContainerStyled>
    )
}

export default TablePosiciones