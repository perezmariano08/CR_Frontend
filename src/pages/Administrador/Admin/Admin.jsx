import { useDispatch, useSelector } from 'react-redux'
import Content from '../../../components/Content/Content'
import { ContentTitle } from '../../../components/Content/ContentStyles'
import { useEffect } from 'react'
import { fetchSedes } from '../../../redux/ServicesApi/sedesSlice'
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice'
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice'
import { fetchAños } from '../../../redux/ServicesApi/añosSlice'
import { fetchTorneos } from '../../../redux/ServicesApi/torneosSlice'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../../../components/Stats/Table/TableStyles'
import { TableContainerStyled } from '../../../components/Stats/Table/TableStyles'
import { TbRectangleVerticalFilled } from 'react-icons/tb'
import TableTeam from '../../../components/Stats/TableTeam/TableTeam.jsx'

const Admin = () => {
    const dispatch = useDispatch()
    const sedesList = useSelector((state) => state.sedes.data);
    const temporadasList = useSelector((state) => state.temporadas.data);
    const añosList = useSelector((state) => state.años.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const torneosList = useSelector((state) => state.torneos.data);
    const ColumnasTabla = [
        {field: 'pos', header: "#"},
        {field: 'equipo', header: "Equipo"},
        {field: 'pts', header: "PTS"},
        {field: 'pj', header: <TbRectangleVerticalFilled style={{color: 'yellow'}}/>},
        {field: 'pg', header: "PG"},
        {field: 'pe', header: "PE"},
        {field: 'pp', header: "PP"},
        {field: 'gf', header: "GF"},
        {field: 'gc', header: "GC"},
        {field: 'dif', header: "DIF"}
    ]
    const PosicionesData = [
        {
            pos: 1,
            equipo: "Celta de Vino",
            pts: 9,
            pj: 3,
            pg: 6,
            pe: 0,
            pp: 0,
            gf: 6,
            gc: 3,
            dif: 3
        },
        {
            pos: 2,
            equipo: "T-USA FC",
            pts: 0,
            pj: 3,
            pg: 6,
            pe: 0,
            pp: 0,
            gf: 6,
            gc: 3,
            dif: 3
        },
        {
            pos: 3,
            equipo: "T-USA FC",
            pts: 4,
            pj: 3,
            pg: 6,
            pe: 0,
            pp: 0,
            gf: 6,
            gc: 3,
            dif: 3
        },
        {
            pos: 4,
            equipo: "T-USA FC",
            pts: 9,
            pj: 3,
            pg: 6,
            pe: 0,
            pp: 0,
            gf: 6,
            gc: 3,
            dif: 3
        },
        {
            pos: 5,
            equipo: "T-USA FC",
            pts: 9,
            pj: 3,
            pg: 6,
            pe: 0,
            pp: 0,
            gf: 6,
            gc: 3,
            dif: 3
        }

    ]
    useEffect(() => {
        dispatch(fetchTemporadas());
        dispatch(fetchCategorias());
        dispatch(fetchSedes());
        dispatch(fetchAños());
        dispatch(fetchTorneos());
    }, []);

    const body = rowData => {
        if (rowData.pos === 1) {
            return <div className="pos green">
                {rowData.pos}
            </div>
        } else if ( rowData.pos > 1 && rowData.pos < 4 ) {
            return <div className="pos orange" >
                {rowData.pos}
            </div>
        } else if ( rowData.pos > 3 && rowData.pos < 6 ) {
            return <div className="pos red" >
                {rowData.pos}
            </div>
        }
    }

    const equipoBodyTemplate = (rowData) => (
        <div className="team" style={{minWidth: '140px'}}>
            <img src={`/Escudos/celta-de-vino.png`} alt={rowData.nombre} />
            <span>{rowData.equipo}</span>
        </div>
    );

    const TableTeamPosiciones = [
        {
            id_jugador: 6,
            nombre_completo: "ALIAGA, Matias",
            PJ: 3,
            G: 6,
            A: 0,
            Am: 0,
            R: 6,
        },
        {
            id_jugador: 2,
            nombre_completo: "BASSI, Alessandro",
            PJ: 3,
            G: 6,
            A: 0,
            Am: 0,
            R: 6,
        },
    ]

    return (
        <Content>
            <ContentTitle>
                Dashboard
            </ContentTitle>
            <TableTeam data={TableTeamPosiciones} id_temporada={"ID temporada"}/>
            <TableContainerStyled>
                <TableTitle>
                    <h3>Torneo Apertura</h3>
                    <p>Serie A</p>
                </TableTitle>
                <TableTitleDivider/>
                <TableWrapper
                        value={PosicionesData}
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
                                col.field === 'pos'
                                ? body
                                : col.field === 'equipo'
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
                        <h3>Descenso</h3>
                    </TableFootItem>        
                </TableFoot>
            </TableContainerStyled>
        </Content>
    )
}

export default Admin