import React, { memo }from 'react';
import { JugadorSancionadoBodyTemplate, TableContainerStyled, TableTitle, TableTitleDivider } from '../Table/TableStyles';
import {TableTeamWrapper} from '../TableTeam/TableTeam'
import { Column } from 'primereact/column';
import { URLImages } from '../../../utils/utils';
import { StatsNull } from '../../../pages/Stats/StatsStyles';
import { useEquipos } from '../../../hooks/useEquipos';

const TableSanciones = memo(({ data, dataColumns }) => {

    if (!data || data.length === 0) {
        return <StatsNull>No hay datos disponibles.</StatsNull>;
    }

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
