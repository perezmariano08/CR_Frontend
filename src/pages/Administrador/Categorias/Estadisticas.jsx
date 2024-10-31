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
import { dataPosicionesTemporadaColumns, dataPosicionesTemporadaColumnsMinus, dataSancionesColumns } from '../../../components/Stats/Data/Data';
import TableSanciones from '../../../components/Stats/TableSanciones/TableSanciones';

const Estadisticas = () => {
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL
    
    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);

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
                    </ResumenItemTitulo>
                        <TablePosiciones
                            data={posiciones}
                            zona={zonasFiltradas}
                            dataColumns={dataPosicionesTemporadaColumns}
                        />
                </ResumenItemWrapper>
                <ResumenItemWrapper>
                    <ResumenItemTitulo>
                        <p>Sanciones</p>
                    </ResumenItemTitulo>
                        <TableSanciones
                            data={sanciones}
                            dataColumns={dataSancionesColumns}
                        />
                </ResumenItemWrapper>
            </ResumenItemsContainer>
            
        </Content>
    );
};

export default Estadisticas;
