import React, { useEffect, useState } from 'react';
import Content from '../../../components/Content/Content';
import { ContentNavWrapper, FormacionEquipo, FormacionEquipoImg, FormacionesPartido, MenuContentTop, TituloPartidoDetalle, TituloPartidoEquipo, TituloPartidoResultado } from '../../../components/Content/ContentStyles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { NavLink, useParams } from 'react-router-dom';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { dataFormacionesPartidoColumns } from '../../../Data/Partidos/Partidos';
import Table from '../../../components/Table/Table';
import { AccionesBodyTemplate } from '../../../components/Table/TableStyles';
import Button from '../../../components/Button/Button';
import { IoPencil, IoTrashOutline } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';

const CategoriasFixturePartido = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams(); // Obtenemos el id desde la URL

    const [formaciones, setFormaciones] = useState([]);
    const partidosList = useSelector((state) => state.partidos.data);
    const partidoFiltrado = partidosList.find(partido => partido.id_partido == id_page);
    const equiposList = useSelector((state) => state.equipos.data)
    const jugadoresList = useSelector((state) => state.jugadores.data)

    useEffect(() => {
        // Función para obtener las formaciones
        const fetchFormaciones = async () => {
            try {
                const response = await fetch(`https://api-coparelampago.vercel.app/user/get-partidos-formaciones?id_partido=${id_page}`);
                if (!response.ok) {
                    throw new Error('Error al obtener las formaciones');
                }
                const data = await response.json();
                setFormaciones(data);
            } catch (error) {
                console.error('Error fetching formaciones:', error);
            }
        };

        fetchFormaciones();
    }, []);

    const formacionesTable = formaciones.map(formacion => {
        const jugador = jugadoresList.find(jugador => jugador.id_jugador === formacion.id_jugador);
    
        // Verifica si el jugador fue encontrado
        if (!jugador) {
            console.error(`Jugador con id ${formacion.id_jugador} no encontrado`);
            return formacion; // Retorna la formación original o puedes personalizar qué hacer en este caso
        }
    
        return {
            ...formacion,
            acciones: (
                <AccionesBodyTemplate >
                    <Button bg={"danger"} onClick={''}>
                        <IoTrashOutline />
                    </Button>
                    <Button bg={"import"} onClick={''}>
                        <IoPencil />
                    </Button>
                </AccionesBodyTemplate>
            ),
            dorsal: (
                <>
                    {`${formacion.dorsal}`}
                </>
            ),
            id_jugador: (
                <>
                    {`${jugador.apellido}, ${jugador.nombre}`}
                </>
            ),
            dni: (
                <>
                    {`${jugador.dni}`}
                </>
            ),
        };
    });
    
    

    const formacionesLocal = formacionesTable.filter((formacion => formacion.id_equipo === partidoFiltrado.id_equipoLocal))
    const formacionesVisita = formacionesTable.filter((formacion => formacion.id_equipo === partidoFiltrado.id_equipoVisita))
    
    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchPartidos());
    }, []);

    return (
        <Content>
            {/* <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <NavLink to={`/admin/ediciones/categorias/${edicionFiltrada.id_edicion}`}>{edicionFiltrada.nombre_temporada}</NavLink>
                /
                <div>{categoriaFiltrada.nombre}</div>
            </MenuContentTop>
            <ContentNavWrapper>
                <li><NavLink to={`/admin/categorias/resumen/${id_page}`}>Resumen</NavLink></li>
                <li><NavLink to={`/admin/categorias/formato/${id_page}`}>Formato</NavLink></li>
                <li><NavLink to={`/admin/categorias/fixture/${id_page}`}>Fixture</NavLink></li>
                <li><NavLink to={`/admin/categorias/equipos/${id_page}`}>Equipos ({categoriaEquipos.length})</NavLink></li>
                <li><NavLink to={`/admin/categorias/config/${id_page}`}>Configuración</NavLink></li>
            </ContentNavWrapper> */}
            <TituloPartidoDetalle>
                <TituloPartidoEquipo>
                    {equiposList.find((equipo => equipo.id_equipo === partidoFiltrado.id_equipoLocal)).nombre}
                    <img src="https://coparelampago.com/uploads/Equipos/team-default.png" alt="" srcset="" />
                </TituloPartidoEquipo>
                <TituloPartidoResultado>
                    {`${partidoFiltrado.goles_local} - ${partidoFiltrado.goles_visita}`}
                </TituloPartidoResultado>
                <TituloPartidoEquipo>
                    <img src="https://coparelampago.com/uploads/Equipos/team-default.png" alt="" srcset="" />
                    {equiposList.find((equipo => equipo.id_equipo === partidoFiltrado.id_equipoVisita)).nombre}
                </TituloPartidoEquipo>
            </TituloPartidoDetalle>
            <FormacionesPartido>
                <FormacionEquipo>
                    <FormacionEquipoImg>
                        <img src="https://coparelampago.com/uploads/Equipos/team-default.png" alt="" srcset="" />
                        {equiposList.find((equipo => equipo.id_equipo === partidoFiltrado.id_equipoLocal)).nombre}
                    </FormacionEquipoImg>
                    <Table
                        data={formacionesLocal}
                        dataColumns={dataFormacionesPartidoColumns}
                        paginator={false}
                        selection={false}
                        sortable={false}
                    />
                    <Button bg={"success"} onClick={''}>
                        <FiPlus />
                        Agregar jugador
                    </Button>
                </FormacionEquipo>
                <FormacionEquipo>
                    <FormacionEquipoImg>
                        <img src="https://coparelampago.com/uploads/Equipos/team-default.png" alt="" srcset="" />
                        {equiposList.find((equipo => equipo.id_equipo === partidoFiltrado.id_equipoVisita)).nombre}
                    </FormacionEquipoImg>
                    
                    <Table
                        data={formacionesVisita}
                        dataColumns={dataFormacionesPartidoColumns}
                        paginator={false}
                        selection={false}
                        sortable={false}
                    />
                    <Button bg={"success"} onClick={''}>
                        <FiPlus />
                        Agregar jugador
                    </Button>
                </FormacionEquipo>
            </FormacionesPartido>
        </Content>
    );
};

export default CategoriasFixturePartido;
