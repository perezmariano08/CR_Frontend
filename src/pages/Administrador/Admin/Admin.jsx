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
import { TbRectangleVerticalFilled, TbShirtSport, TbUser, TbUsers } from 'react-icons/tb'
import TableTeam from '../../../components/Stats/TableTeam/TableTeam.jsx'
import { DashboardItemDivider, DashboardItemInfoWrapper, DashboardItemsWrapper, DashboardItemWrapper } from './AdminStyles.js'
import { LiaFutbol } from 'react-icons/lia'
import { IoShieldHalf } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'

const Admin = () => {
    const dispatch = useDispatch()

    // Estado del el/los Listado/s que se necesitan en el modulo
    const jugadoresList = useSelector((state) => state.jugadores.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const partidosList = useSelector((state) => state.partidos.data);
    const usuariosList = useSelector((state) => state.usuarios.data);

    // Partidos finalizados
    const partidosFinalizados = partidosList.filter(partido => partido.estado === "F").length;


    console.log(partidosList);
    
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



    console.log(partidosFinalizados);
    

    return (
        <Content>
            <DashboardItemsWrapper>
                <DashboardItemWrapper>
                    <LiaFutbol />
                    <DashboardItemInfoWrapper>
                        <span className='numero'>{partidosFinalizados}/{partidosList.length}</span>
                        <span className='titulo'>Partidos</span>
                        <span className='descripcion'>(jugados/totales)</span>
                    </DashboardItemInfoWrapper>
                </DashboardItemWrapper>
                <DashboardItemDivider/>
                <DashboardItemWrapper>
                    <IoShieldHalf />
                    <DashboardItemInfoWrapper>
                        <span className='numero'>{equiposList.length}</span>
                        <span className='titulo'>Equipos</span>
                        <NavLink to={"/admin/equipos"} className='link'>Ver todos</NavLink>
                    </DashboardItemInfoWrapper>
                </DashboardItemWrapper>
                <DashboardItemDivider/>
                <DashboardItemWrapper>
                    <TbShirtSport />
                    <DashboardItemInfoWrapper>
                        <span className='numero'>{jugadoresList.length}</span>
                        <span className='titulo'>Jugadores</span>
                        <NavLink to={"/admin/jugadores"} className='link'>Ver todos</NavLink>
                    </DashboardItemInfoWrapper>
                </DashboardItemWrapper>
                <DashboardItemDivider/>
                <DashboardItemWrapper>
                    <TbUsers />
                    <DashboardItemInfoWrapper>
                        <span className='numero'>{usuariosList.length}</span>
                        <span className='titulo'>Usuarios</span>
                        <NavLink to={"/admin/usuarios"} className='link'>Ver todos</NavLink>
                    </DashboardItemInfoWrapper>
                </DashboardItemWrapper>
            </DashboardItemsWrapper>
        </Content>
    )
}

export default Admin