import React, { useEffect, useState } from 'react';
import { StatsContainerStyled, StatsFilter, StatsFilterButton, StatsHeadContainer, StatsNull, StatsWrapper } from './StatsStyles';
import Fixture from '../../components/Stats/Fixture/Fixture';
import { IoShieldHalf } from 'react-icons/io5';
import Select from '../../components/Select/Select';
import TableTeam from '../../components/Stats/TableTeam/TableTeam.jsx';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { getPosicionesTemporada, getZonas, getEstadisticasTemporada } from '../../utils/dataFetchers.js';
import { TailSpin } from 'react-loader-spinner';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorias } from '../../redux/ServicesApi/categoriasSlice.js';
import useGetStatsHandler from '../../hooks/useGetStatsHandler.js';
import { getColumns } from './helper.js';

const Stats = () => {
    const dispatch = useDispatch();
    const categorias = useSelector((state) => state.categorias.data);

    const [zonaSeleccionada, setZonaSeleccionada] = useState(() => {
        const storedZona = localStorage.getItem('ultimaZonaSeleccionada');
        return storedZona ? Number(storedZona) : null;
    });
    
    const [zonasFiltradas, setZonasFiltradas] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('Posiciones');
    const [zonas, setZonas] = useState([]);
    const [posicionesPorZona, setPosicionesPorZona] = useState({});
    const [loading, setLoading] = useState(true);

    // Use custom hook
    const { estadisticaZona, getEstadisticasZonaHandler } = useGetStatsHandler(zonaSeleccionada, filtroActivo);

    useEffect(() => {
        dispatch(fetchCategorias());
    }, [dispatch]);

    useEffect(() => {
        const fetchZonas = async () => {
            setLoading(true);
            try {
                const data = await getZonas();
                setZonas(data);
            } catch (error) {
                console.error('Error en la petición', error);
            } finally {
                setLoading(false);
            }
        };
        fetchZonas();
    }, []);

    useEffect(() => {
        if (zonaSeleccionada) {
            const zonasFiltradas = zonas?.filter(zona => zona.id_categoria === zonaSeleccionada);
            setZonasFiltradas(zonasFiltradas);
        } else {
            setZonasFiltradas([]);
        }
    }, [zonaSeleccionada, zonas]);

    useEffect(() => {
        if (zonaSeleccionada) {
            setLoading(true);
            getEstadisticasZonaHandler();
            const fetchPosiciones = async () => {
                const nuevasPosiciones = {};
                for (const zona of zonasFiltradas) {
                    try {
                        const data = await getPosicionesTemporada(zona.id_zona);
                        nuevasPosiciones[zona.id_zona] = data;
                    } catch (error) {
                        console.error('Error en la petición de posiciones:', error);
                    }
                }
                setPosicionesPorZona(nuevasPosiciones);
                setLoading(false);
            };
            fetchPosiciones();
        } else {
            setPosicionesPorZona({});
            setLoading(false);
        }
    }, [filtroActivo, zonaSeleccionada, zonasFiltradas]);

    const handleZona = (e) => {
        const selectedCategoria = Number(e.target.value);
        if (selectedCategoria === 0) {
            setZonaSeleccionada(null);
            localStorage.removeItem('ultimaZonaSeleccionada');
        } else {
            setZonaSeleccionada(selectedCategoria);
            localStorage.setItem('ultimaZonaSeleccionada', selectedCategoria);
        }
    };

    const handleFiltroClick = (filtro) => {
        setFiltroActivo(filtro);
    };

    const getColumnsForFilter = () => getColumns(filtroActivo);

    return (
        <StatsContainerStyled className='container'>
            <StatsWrapper className='wrapper'>
                <StatsHeadContainer>
                    <Select 
                        data={categorias}
                        placeholder='Seleccionar categoría'
                        column='nombre'
                        id_='id_categoria'
                        icon={<IoShieldHalf className='icon-select' />}
                        value={zonaSeleccionada === null ? '' : zonaSeleccionada}
                        onChange={handleZona}
                    />
                    <StatsFilter>
                        <StatsFilterButton
                            className={filtroActivo === 'Fixture' ? 'active' : ''}
                            onClick={() => handleFiltroClick('Fixture')}
                        >
                            Fixture
                        </StatsFilterButton>
                        <StatsFilterButton
                            className={filtroActivo === 'Posiciones' ? 'active' : ''}
                            onClick={() => handleFiltroClick('Posiciones')}
                        >
                            Posiciones
                        </StatsFilterButton>
                        <StatsFilterButton
                            className={filtroActivo === 'Goleadores' ? 'active' : ''}
                            onClick={() => handleFiltroClick('Goleadores')}
                        >
                            Goleadores
                        </StatsFilterButton>
                        <StatsFilterButton
                            className={filtroActivo === 'Asistencias' ? 'active' : ''}
                            onClick={() => handleFiltroClick('Asistencias')}
                        >
                            Asistencias
                        </StatsFilterButton>
                        <StatsFilterButton
                            className={filtroActivo === 'Expulsados' ? 'active' : ''}
                            onClick={() => handleFiltroClick('Expulsados')}
                        >
                            Expulsados
                        </StatsFilterButton>
                        <StatsFilterButton
                            className={filtroActivo === 'Amarillas' ? 'active' : ''}
                            onClick={() => handleFiltroClick('Amarillas')}
                        >
                            Amarillas
                        </StatsFilterButton>
                    </StatsFilter>
                </StatsHeadContainer>

                {(zonaSeleccionada === null || zonaSeleccionada === 0) && (
                    <StatsNull>Seleccione una categoría para visualizar las estadísticas</StatsNull>
                )}

                {loading && (
                    <SpinerContainer>
                        <TailSpin width='40' height='40' color='#2AD174' />
                    </SpinerContainer>
                )}

                {/* Renderizado por Zona */}
                {!loading && zonaSeleccionada && filtroActivo === 'Fixture' && <Fixture zona={zonasFiltradas?.[0]} categoria={zonasFiltradas?.[0].id_categoria}/>}
                {!loading && zonaSeleccionada && filtroActivo === 'Posiciones' && (
                    zonasFiltradas?.map(zona => (
                        <TablePosiciones 
                            key={zona.id_zona}
                            data={posicionesPorZona[zona.id_zona]} 
                            zona={zona} 
                            dataColumns={getColumnsForFilter()}
                        />
                    ))
                )}

                {/* Renderizado por Categoría */}
                {!loading && zonaSeleccionada && filtroActivo !== 'Fixture' && filtroActivo !== 'Posiciones' && (
                    <TableTeam data={estadisticaZona} dataColumns={getColumnsForFilter()} zona={zonasFiltradas?.[0]}/>
                )}
            </StatsWrapper>
        </StatsContainerStyled>
    );
};

export default Stats;
