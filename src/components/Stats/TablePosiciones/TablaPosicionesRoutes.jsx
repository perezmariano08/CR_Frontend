import React from 'react'
import { FormatoDetalleItem, TablaFormatoDetalle, TablaPosiciones, TableContainerStyled, TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../Table/TableStyles'
import { Column } from 'primereact/column';
import { URLImages } from '../../../utils/utils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const TablePosicionesRoutes = ({ data, dataColumns, id_categoria }) => {
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const equipos = useSelector((state) => state.equipos.data);
    const navigate = useNavigate();

    //SACAR
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo.img !== null ? equipo.img : '/uploads/Equipos/team-default.png';
    };

    //SACAR
    const equipoBodyTemplate = (rowData, field) => (
        <div className="team" style={{minWidth: '140px', cursor: 'pointer', height: '100%'}} 
            onClick={() => verPaginaEquipo(rowData.id_equipo)}
        >
            <img src={`${URLImages}${escudosEquipos(rowData.id_equipo)}`} alt={rowData.equipo}/>
            <span>{rowData.equipo}</span>
        </div>
    );

    const posicionTemplate = (rowData) => {    
        // Define la clase de color basada en la posición o categoría
        let colorClass = '';
    
        // Serie A
        if (id_categoria === 1) {
            if (rowData.pos === 1 || rowData.pos === 2) {
                colorClass = 'green'; // Campeón
            } else if (rowData.pos > 2 && rowData.pos < 11) {
                colorClass = 'orange'; // Campeón
            }
        }

        // Serie B
        if (id_categoria === 2) {
            if (rowData.pos === 1) {
                colorClass = 'green'; // Campeón
            } else if (rowData.pos === 2) {
                colorClass = 'orange'; // Campeón
            } else if (rowData.pos > 2 && rowData.pos < 9) {
                colorClass = 'blue'; // Campeón
            } else if (rowData.pos > 8 && rowData.pos < 11) {
                colorClass = 'yellow'; // Campeón
            } else if (rowData.pos === 11) {
                colorClass = 'red'; // Campeón
            }
        }

        // Serie C
        if (id_categoria === 3) {
            if (rowData.pos === 1 || rowData.pos === 2 ) {
                colorClass = 'green'; // Campeón
            } else if (rowData.pos > 2 && rowData.pos < 7) {
                colorClass = 'orange'; // Campeón
            } else if (rowData.pos > 6 && rowData.pos < 11) {
                colorClass = 'blue'; // Campeón
            } else if (rowData.pos > 8 && rowData.pos < 11) {
                colorClass = 'yellow'; // Campeón
            } else if (rowData.pos === 11) {
                colorClass = 'red'; // Campeón
            }
        }

        // Serie D
        if (id_categoria === 4) {
            if (rowData.pos === 1 ) {
                colorClass = 'green'; // Campeón
            } else if (rowData.pos === 2) {
                colorClass = 'orange'; // Campeón
            } else if (rowData.pos > 2 && rowData.pos < 11) {
                colorClass = 'blue'; // Campeón
            }
        }

        // SUB 19 Serie A
        if (id_categoria === 5) {
            if (rowData.pos > 0 && rowData.pos < 9) {
                colorClass = 'orange'; // Campeón
            } else if (rowData.pos > 8 && rowData.pos < 12) {
                colorClass = 'blue'; // Campeón
            }
        }

         // SUB 19 Serie B
        if (id_categoria === 6) {
            if (rowData.pos === 1) {
                colorClass = 'green'; // Campeón
            } else if (rowData.pos === 2) {
                colorClass = 'orange'; // Campeón
            } else if (rowData.pos > 2 && rowData.pos < 11) {
                colorClass = 'blue'; // Campeón
            }
        }

    
        return (
            <div className='pos'>
                {/* Muestra la posición */}
                {rowData.pos}
    
                {/* Muestra el color condicionalmente */}
                <span className={colorClass}></span>
            </div>
        );
    };


    const verPaginaEquipo = (idEquipo) => {
        navigate(`/my-team?idEquipo=${idEquipo}`);
    }

    const rowClassName = (rowData) => {
        return {
            'my-team-row': rowData.id_equipo === idMyTeam
        };
    }    

    return (
        <>
            <TablaPosiciones
                value={data}
                emptyMessage="No hay datos disponibles"
                rowClassName={rowClassName}
                removableSort
            >
                {dataColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable
                        // style={{ width: 'auto' }}
                        body={col.field === 'pos'
                            ? posicionTemplate
                            : col.field === 'equipo'
                                ? equipoBodyTemplate
                                : null} />
                ))}
            </TablaPosiciones>
            {
                id_categoria === 1 && <TablaFormatoDetalle>
                    <FormatoDetalleItem>
                        <span className='green'></span>
                        <p>Clasifica a Semifinal Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='orange'></span>
                        <p>Clasifica a Octavos Copa Oro</p>
                    </FormatoDetalleItem>
                </TablaFormatoDetalle>
            }
            {
                id_categoria === 2 && <TablaFormatoDetalle>
                    <FormatoDetalleItem>
                        <span className='green'></span>
                        <p>Asciende directo a Serie A</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='orange'></span>
                        <p>Clasifica a Semifinal Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='blue'></span>
                        <p>Clasifica a Cuartos Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='yellow'></span>
                        <p>Clasifica a Cuartos Copa Plata</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='red'></span>
                        <p>Eliminado</p>
                    </FormatoDetalleItem>
                </TablaFormatoDetalle>
            }
            {
                id_categoria === 3 && <TablaFormatoDetalle>
                    <FormatoDetalleItem>
                        <span className='green'></span>
                        <p>Clasifica a Cuartos Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='orange'></span>
                        <p>Clasifica a Octavos Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='blue'></span>
                        <p>Clasifica a Octavos Copa Plata</p>
                    </FormatoDetalleItem>
                </TablaFormatoDetalle>
            }
            {
                id_categoria === 4 && <TablaFormatoDetalle>
                    <FormatoDetalleItem>
                        <span className='green'></span>
                        <p>Ascenso a Serie C y Clasifica a Semifinal Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='orange'></span>
                        <p>Clasifica a Semifinal Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='blue'></span>
                        <p>Clasifica a Octavos Copa Oro</p>
                    </FormatoDetalleItem>
                </TablaFormatoDetalle>
            }
            {
                id_categoria === 5 && <TablaFormatoDetalle>
                    <FormatoDetalleItem>
                        <span className='orange'></span>
                        <p>Clasifica a Cuartos Oro (1° y 2° tienen ventaja deportiva)</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='blue'></span>
                        <p>Clasifica a Semifinal Copa Plata</p>
                    </FormatoDetalleItem>
                </TablaFormatoDetalle>
            }
            {
                id_categoria === 6 && <TablaFormatoDetalle>
                    <FormatoDetalleItem>
                        <span className='green'></span>
                        <p>Ascenso a Serie A y Clasifica a Semifinal Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='orange'></span>
                        <p>Clasifica a Semifinal Copa Oro</p>
                    </FormatoDetalleItem>
                    <FormatoDetalleItem>
                        <span className='blue'></span>
                        <p>Clasifica a Octavos Copa Oro</p>
                    </FormatoDetalleItem>
                </TablaFormatoDetalle>
            }
        </>
    )
}

export default TablePosicionesRoutes