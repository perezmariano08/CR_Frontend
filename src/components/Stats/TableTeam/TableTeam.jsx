import React from 'react'
import { TableContainerStyled, TableTitle, TableTitleDivider } from '../Table/TableStyles'
import { TableTeamWrapper } from './TableTeam';
import { Column } from 'primereact/column';
import { URL } from '../../../utils/utils';
import { useSelector } from 'react-redux';

const TableTeam = ({data, id_temporada}) => {

    const ColumnasTabla = [
        {field: 'nombre_completo', header: "nombre"},
        {field: 'PJ', header: "PJ"},
        {field: 'G', header: "PG"},
        {field: 'A', header: "PE"},
        {field: 'Am', header: "PP"},
        {field: 'R', header: "GF"},
    ]

    // Traer equipos
    const jugadores = useSelector((state) => state.jugadores.data)
    const imagenJugador = (idJugador) => {
        const jugador = jugadores.find((jugador) => jugador.id_jugador === idJugador);
        return jugador ? jugador.img : null;
    };

    const jugadorBodyTemplate = (rowData) => (
        <div className="player" style={{minWidth: '140px'}}>
            <img src={`${URL}/uploads/Jugadores/${imagenJugador(rowData.id_jugador)}`} alt={rowData.nombre_completo} />
            <span>{rowData.nombre_completo}</span>
        </div>
    );


    return (
    <TableContainerStyled>
        <TableTitle>
            {/* Falta renderizado automatico del nombre del torneo */}
            <h3>{id_temporada}</h3>
            <p>"Libre - Serie A" (Datos que se sacan con el ID temporada) </p>
        </TableTitle>
        <TableTitleDivider/>
        <TableTeamWrapper
            value={data}
            emptyMessage="No hay datos disponibles"
        >
            {ColumnasTabla.map((col) => (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    sortable
                    style={{ width: 'auto' }}
                    body={
                        col.field === 'nombre_completo'
                        ? jugadorBodyTemplate
                        : null
                    }
                />
            ))}
        </TableTeamWrapper>
    </TableContainerStyled>
)
}

export default TableTeam