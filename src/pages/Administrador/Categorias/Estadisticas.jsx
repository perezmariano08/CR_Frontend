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
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import CategoriasMenuNav from './CategoriasMenuNav';
import { EquiposDetalle, ResumenItemDescripcion, ResumenItemsContainer, ResumenItemTitulo, ResumenItemWrapper } from './categoriasStyles';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';
import { getPosicionesTemporada, getSanciones, getZonas } from '../../../utils/dataFetchers';
import TablePosiciones from '../../../components/Stats/TablePosiciones/TablePosiciones';
import { dataPosicionesTemporadaColumnsMinus, dataSancionesColumns } from '../../../components/Stats/Data/Data';
import TableSanciones from '../../../components/Stats/TableSanciones/TableSanciones';

const Estadisticas = () => {
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL
    
    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const planteles = useSelector((state) => state.planteles.data);
    const jugadoresCategoria = planteles.filter((p) => p.id_categoria == id_categoria)
    const partidos = useSelector((state) => state.partidos.data);
    const temporadas = useSelector((state) => state.temporadas.data);

    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);
    const [posiciones, setPosiciones] = useState(null);
    
    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchTemporadas());
        dispatch(fetchJugadores());
        dispatch(fetchPlanteles());
    }, []);

    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const categoriasEdicion = categoriasList.filter(categoria => categoria.id_edicion == id_categoria)
    const categoriasListLink = categoriasEdicion.map(categoria => ({
        ...categoria,
        link: `/admin/ediciones/categorias/resumen/${categoria.id_categoria}`, 
    }));

    const zonasFiltradas = zonas.find((z) => z.id_categoria === categoriaFiltrada.id_categoria);
    const id_zona = zonasFiltradas?.id_zona

    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);

    useEffect(() => {
        getZonas()
            .then((data) => setZonas(data))
            .catch((error) => console.error('Error fetching zonas:', error));

        getSanciones()
            .then((data) => sancionesActivas(data))
            .catch((error) => console.error('Error fetching sanciones:', error));
    }, []);

    useEffect(() => {
        if (id_zona) {
            getPosicionesTemporada(id_zona)
                .then((data) => {
                    setPosiciones(data);
                })
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [id_zona]);

    const sancionesActivas = (sanciones) => {
        const sancionesFiltradas = sanciones.filter(s => s.fechas_restantes > 0)
        console.log(sancionesFiltradas);
        const sancionesPorCategoria = sancionesFiltradas.filter(s => s.id_categoria === categoriaFiltrada.id_categoria)
        setSanciones(sancionesPorCategoria);
    }

    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <NavLink to={`/admin/ediciones/categorias/${edicionFiltrada.id_edicion}`}>{edicionFiltrada.nombre_temporada}</NavLink>
                /
                <div>{categoriaFiltrada.nombre}</div>
            </MenuContentTop>
            <CategoriasMenuNav id_categoria={id_categoria} />
            <ResumenItemsContainer>
                <ResumenItemWrapper>
                    <ResumenItemTitulo>
                        <p>Posiciones</p>
                        {/* <span>LIGUILLA</span> */}
                    </ResumenItemTitulo>
                        <TablePosiciones
                            data={posiciones}
                            zona={zonasFiltradas}
                            dataColumns={dataPosicionesTemporadaColumnsMinus}
                        />
                    {/* <ResumenItemDescripcion>

                    </ResumenItemDescripcion> */}
                </ResumenItemWrapper>
                <ResumenItemWrapper>
                    <ResumenItemTitulo>
                        <p>Sanciones</p>
                        {/* <span>LIGUILLA</span> */}
                    </ResumenItemTitulo>
                        <TableSanciones
                            data={sanciones}
                            dataColumns={dataSancionesColumns}
                        />
                    {/* <ResumenItemDescripcion>

                    </ResumenItemDescripcion> */}
                </ResumenItemWrapper>
            </ResumenItemsContainer>
            
        </Content>
    );
};

export default Estadisticas;
