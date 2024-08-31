import React from 'react'
import { TableContainerStyled, TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../Table/TableStyles'
import { Column } from 'primereact/column';
import { URLImages } from '../../../utils/utils';
import { useSelector } from 'react-redux';
import { StatsNull } from '../../../pages/Stats/StatsStyles';
import { useNavigate } from 'react-router-dom';
import { SpinerContainer } from '../../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const TablePosicionesRoutes = ({ data, dataColumns }) => {

    const equipos = useSelector((state) => state.equipos.data);
    const navigate = useNavigate();

    const body = rowData => {
        if (rowData.pos === 1) {
            return <div className="pos ">{rowData.pos}</div>
        }
        if ( rowData.pos > 1 && rowData.pos < 4 ) {
            return <div className="pos ">{rowData.pos}</div>
        } 
        if ( rowData.pos > 3 && rowData.pos < 7 ) {
            return <div className="pos ">{rowData.pos}</div>
        } 

        return <div className="pos ">{rowData.pos}</div>
    };

    //SACAR
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo.img !== null ? equipo.img : '/uploads/Equipos/team-default.png';
    };

    //SACAR
    const equipoBodyTemplate = (rowData, field) => (
        <div className="team" style={{minWidth: '140px', cursor: 'pointer'}} 
            onClick={() => verPaginaEquipo(rowData.id_equipo)}
        >
            <img src={`${URLImages}${escudosEquipos(rowData.id_equipo)}`} alt={rowData.equipo}/>
            <span>{rowData.equipo}</span>
        </div>
    );


    const verPaginaEquipo = (idEquipo) => {
        navigate(`/my-team?idEquipo=${idEquipo}`);
    }

    return (
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
                        : 
                        col.field === 'nombre'
                        ? equipoBodyTemplate
                        : null
                    }
                />
            ))}
        </TableWrapper>
    )
}

export default TablePosicionesRoutes