import { useDispatch, useSelector } from 'react-redux'
import Content from '../../../components/Content/Content'
import { useEffect } from 'react'
import { fetchSedes } from '../../../redux/ServicesApi/sedesSlice'
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice'
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice'
import { fetchAños } from '../../../redux/ServicesApi/añosSlice'
import { fetchTorneos } from '../../../redux/ServicesApi/torneosSlice'
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice.js'

import { TbRectangleVerticalFilled, TbShirtSport, TbUser, TbUsers } from 'react-icons/tb'
import { DashboardItemDivider, DashboardItemInfoWrapper, DashboardItemsWrapper, DashboardItemWrapper } from './AdminStyles.js'
import { LiaFutbol } from 'react-icons/lia'
import { IoShieldHalf } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice.js'
import { fetchUsuarios } from '../../../redux/ServicesApi/usuariosSlice.js'

const Admin = () => {
    const dispatch = useDispatch()

    // Estado del el/los Listado/s que se necesitan en el modulo
    const jugadoresList = useSelector((state) => state.jugadores.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const partidosList = useSelector((state) => state.partidos.data);
    const usuariosList = useSelector((state) => state.usuarios.data);

    // Partidos finalizados
    const partidosFinalizados = partidosList.filter(partido => partido.estado === "F").length;
    
    useEffect(() => {
        dispatch(fetchUsuarios());
        dispatch(fetchTemporadas());
        dispatch(fetchCategorias());
        dispatch(fetchSedes());
        dispatch(fetchAños());
        dispatch(fetchTorneos());
        dispatch(fetchEquipos());
        dispatch(fetchPartidos());
    }, []);


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