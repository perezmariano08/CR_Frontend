import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import { ContentNavWrapper, ContentTitle, MenuContentTop } from '../../../components/Content/ContentStyles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';

import { NavLink, useParams } from 'react-router-dom';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import CategoriasMenuNav from './CategoriasMenuNav';
import { EquiposDetalle, ResumenItemDescripcion, ResumenItemsContainer, ResumenItemTitulo, ResumenItemWrapper } from './categoriasStyles';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';
import { getPosicionesTemporada, getSanciones, getZonas } from '../../../utils/dataFetchers';
import TablePosiciones from '../../../components/Stats/TablePosiciones/TablePosiciones';
import { dataPosicionesTemporadaColumnsMinus, dataSancionesColumns } from '../../../components/Stats/Data/Data';
import TableSanciones from '../../../components/Stats/TableSanciones/TableSanciones';
import TablePosicionesRoutes from '../../../components/Stats/TablePosiciones/TablaPosicionesRoutes';
import { HiOutlineTrophy } from "react-icons/hi2";
import Select from '../../../components/Select/Select';
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';
import { JugadorSancionadoBodyTemplate, JugadorSancionadoNumeroFechas } from '../../../components/Stats/Table/TableStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';
import { fetchExpulsadosByCategoria } from '../../../redux/ServicesApi/expulsadosSlice';

const Estadisticas = () => {
    const dispatch = useDispatch();
    const { id_categoria } = useParams();

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const zonas = useSelector((state) => state.zonas.data);
    const sanciones = useSelector((state) => state.expulsados.data);

    // const [sanciones, setSanciones] = useState(null);
    const [posiciones, setPosiciones] = useState(null);
    const [idZona, setIdZona] = useState(null)

    const { escudosEquipos, nombresEquipos } = useEquipos();

    useEffect(() => {
        if (categoriasList.length === 0) dispatch(fetchCategorias());
        if (edicionesList.length === 0) dispatch(fetchEdiciones());
        if (zonas.length === 0) dispatch(fetchZonas());
    }, [dispatch, categoriasList.length, edicionesList.length, zonas.length]);

    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);

    const zonasActuales = zonas
        .filter(zona =>
            zona.tipo_zona === "todos-contra-todos" &&
            zona.id_categoria == categoriaFiltrada.id_categoria
        )
        .map(zona => ({
            ...zona,
            nombre_completo: `${zona.nombre_edicion} - ${zona.nombre_categoria} - ${zona.nombre_zona}`
        }));


    useEffect(() => {
        if (zonasActuales.length > 0 && !idZona) {
            setIdZona(zonasActuales[0].id_zona);
        }
    }, [zonasActuales]);


    useEffect(() => {
        dispatch(fetchExpulsadosByCategoria(id_categoria))
    }, [dispatch]);

    useEffect(() => {
        if (idZona) {
            getPosicionesTemporada(idZona)
                .then((data) => {
                    setPosiciones(data);
                })
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [idZona]);

    const sancionesActivas = (sanciones) => {
        const sancionesPorCategoria = sanciones.filter(s => s.id_categoria === categoriaFiltrada.id_categoria)
        setSanciones(sancionesPorCategoria);
    }

    const changeZonaPosiciones = (e) => {
        setIdZona(e.target.value);
    }

    const sancionadosColumns = [
        {
            field: "jugador",
            header: "Jugador",
            body: (rowData) => (
                <JugadorSancionadoBodyTemplate>
                    <img src={`${URLImages}${escudosEquipos(rowData.id_equipo)}`} alt={nombresEquipos(rowData.id_equipo)} />
                    <div className='detalle'>
                        {rowData.jugador}
                        <span>{nombresEquipos(rowData.id_equipo)}</span>
                    </div>
                </JugadorSancionadoBodyTemplate>
            )
        },
        {
            field: "fechas",
            header: "fechas / restantes",
            body: (rowData) => (
                <JugadorSancionadoNumeroFechas>
                    <span>{rowData.fechas}</span>
                    <p>/</p>
                    <p>{rowData.fechas_restantes}</p>
                </JugadorSancionadoNumeroFechas>
            )
        },
    ]

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
                    </ResumenItemTitulo>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '16px 24px'
                    }
                    }>
                        <Select
                            value={idZona}
                            onChange={changeZonaPosiciones}
                            data={zonasActuales}
                            column="nombre_completo"
                            id_="id_zona"
                            placeholder="Seleccione zona"
                            icon={<HiOutlineTrophy className='icon-select' />}
                        />
                    </div>
                    <TablePosicionesRoutes
                        small
                        data={posiciones}
                        id_categoria={id_categoria}
                        dataColumns={dataPosicionesTemporadaColumnsMinus}
                    />
                </ResumenItemWrapper>
                <ResumenItemWrapper>
                    <ResumenItemTitulo>
                        <p>Sanciones</p>
                    </ResumenItemTitulo>
                    <TableSanciones
                        data={sanciones}
                        dataColumns={sancionadosColumns}
                    />
                </ResumenItemWrapper>
            </ResumenItemsContainer>

        </Content>
    );
};

export default Estadisticas;
