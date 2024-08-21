import React from 'react';
import { TableContainerStyled, TableTitle, TableTitleDivider } from '../Table/TableStyles';
import { TableTeamWrapper } from './TableTeam';
import { Column } from 'primereact/column';
import { URL, URLImages } from '../../../utils/utils';
import { useSelector } from 'react-redux';
import { StatsNull } from '../../../pages/Stats/StatsStyles';

const TableTeam = ({ data, zona, dataColumns }) => {
    const jugadores = useSelector((state) => state.jugadores.data);

    if (!zona) {
        return null;
    }

    if (!data || data.length === 0) {
        return <StatsNull>No hay datos disponibles.</StatsNull>;
    }

    const imagenJugador = (idJugador) => {
        if (!jugadores) return null;
        const jugador = jugadores.find((jugador) => jugador.id_jugador === idJugador);
        return jugador ? jugador.img : null;
    };

    const jugadorBodyTemplate = (rowData) => (
        <div className="player" style={{ minWidth: '140px' }}>
            <img src={`${URLImages}/uploads/Jugadores/${imagenJugador(rowData.id_jugador)}`} alt={rowData.nombre_completo} />
            <span>{rowData.nombre_completo}</span>
        </div>
    );

    const nombreTorneo = zona.nombre_edicion;

    return (
        <TableContainerStyled>
            <TableTitle>
                <h3>{nombreTorneo}</h3>
                <p>{zona.nombre_categoria}</p>
            </TableTitle>
            <TableTitleDivider />
            <TableTeamWrapper value={data} emptyMessage="No hay datos disponibles">
                {dataColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable
                        style={{ width: 'auto' }}
                        body={col.field === 'nombre_completo' ? jugadorBodyTemplate : null}
                    />
                ))}
            </TableTeamWrapper>
        </TableContainerStyled>
    );
};
export default TableTeam;
