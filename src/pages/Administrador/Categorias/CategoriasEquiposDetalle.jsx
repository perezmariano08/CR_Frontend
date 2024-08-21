import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { LuDownload, LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import { ContentNavWrapper, ContentTitle, MenuContentTop } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { dataEdicionesColumns } from '../../../Data/Ediciones/DataEdiciones';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { CategoriasEdicionEmpty, TablasTemporadaContainer, TablaTemporada } from '../Ediciones/edicionesStyles';
import useForm from '../../../hooks/useForm';
import { TbPlayFootball } from 'react-icons/tb';
import Select from '../../../components/Select/Select';

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import { CategoriaEquiposEmpty, EquipoDetalleInfo, EquipoWrapper } from './categoriasStyles';
import { dataJugadoresColumns } from '../../../Data/Jugadores/Jugadores';

const CategoriasEquiposDetalle = () => {
    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const jugadoresList = useSelector((state) => state.jugadores.data);

    const dispatch = useDispatch();
    const { id_page } = useParams(); // Obtenemos el id desde la URL

    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
    }, []);

    
    const equipoFiltrado = equiposList.find(equipo => equipo.id_equipo == id_page);
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == equipoFiltrado.id_categoria);
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    const categoriaEquipos = equiposList.filter((equipo) => equipo.id_categoria == equipoFiltrado.id_categoria)
    const jugadoresEquipoFiltrado = jugadoresList.filter(jugador => jugador.id_equipo == id_page && jugador.eventual === 'N');
    
    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <NavLink to={`/admin/ediciones/categorias/${edicionFiltrada.id_edicion}`}>{edicionFiltrada.nombre_temporada}</NavLink>
                /
                <div>{categoriaFiltrada.nombre}</div>
            </MenuContentTop>
            <ContentNavWrapper>
                <li><NavLink to={`/admin/categorias/resumen/${edicionFiltrada.id_edicion}`}>Resumen</NavLink></li>
                <li><NavLink to={`/admin/categorias/formato/${edicionFiltrada.id_edicion}`}>Formato</NavLink></li>
                <li><NavLink to={`/admin/categorias/fixture/${id_page}`}>Fixture</NavLink></li>
                <li><NavLink to={`/admin/categorias/equipos/${edicionFiltrada.id_edicion}`}>Equipos ({categoriaEquipos.length})</NavLink></li>
                <li><NavLink to={`/admin/categorias/config/${edicionFiltrada.id_edicion}`}>Configuración</NavLink></li>
            </ContentNavWrapper>
            <EquipoDetalleInfo>
                <EquipoWrapper>
                    <img src={`https://coparelampago.com${equipoFiltrado.img}`} alt={equipoFiltrado.nombre} />
                    <h1>{equipoFiltrado.nombre}</h1>
                </EquipoWrapper>
                <Button bg="success" color="white" >
                    <p>Editar equipo</p>
                </Button>
            </EquipoDetalleInfo>
            {
                jugadoresEquipoFiltrado.length > 0 ? (
                    <>
                        <p>Lista de buena fé ({jugadoresEquipoFiltrado.length} jugadores)</p>
                        <Table
                            data={jugadoresEquipoFiltrado}
                            dataColumns={dataJugadoresColumns}
                            arrayName={'Jugadores'}
                            paginator={false}
                            selection={false}
                            id_={'id_jugador'}
                            urlClick={`/admin/categorias/equipos/${edicionFiltrada.id_edicion}/detalle/`}
                            rowClickLink
                        />
                    </>
                ) : (
                    <p>No se han encontrado jugadores.</p>
                )
            }
        </Content>
    );
};

export default CategoriasEquiposDetalle;
