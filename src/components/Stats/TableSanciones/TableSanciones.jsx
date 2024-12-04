import React, { memo }from 'react';
import { JugadorSancionadoBodyTemplate, TableContainerStyled, TableTitle, TableTitleDivider } from '../Table/TableStyles';
import {TableTeamWrapper} from '../TableTeam/TableTeam'
import { Column } from 'primereact/column';
import { URLImages } from '../../../utils/utils';
import { StatsNull } from '../../../pages/Stats/StatsStyles';
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';

const TableSanciones = memo(({ data, dataColumns }) => {
    const equipoIds = data?.map(row => row.id_equipo);
    const { getEscudoEquipo } = useNameAndShieldTeams(equipoIds);
    
    if (!data || data.length === 0) {
        return <StatsNull>No hay datos disponibles.</StatsNull>;
    }

    const jugadorBodyTemplate = (rowData) => (
        <JugadorSancionadoBodyTemplate>
            <img 
                src={`${URLImages}${getEscudoEquipo(rowData.id_equipo)}`} 
                alt={rowData.nombre_completo} 
            />
            <span>{rowData.jugador}</span>
        </JugadorSancionadoBodyTemplate>
    );

    const nombreTorneo = data[0]?.edicion;

    return (
        <TableContainerStyled>
            <TableTeamWrapper
                value={data}
                emptyMessage="No hay datos disponibles"
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
            >
                {dataColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable
                        style={{ width: 'auto' }}
                        body={col.body}
                    />
                ))}
            </TableTeamWrapper>
        </TableContainerStyled>
    );
});

export default TableSanciones;
