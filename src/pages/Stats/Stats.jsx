import React, { useEffect, useState } from 'react';
import { StatsContainerStyled, StatsFilter, StatsFilterButton, StatsHeadContainer, StatsNull, StatsWrapper } from './StatsStyles';
import Fixture from '../../components/Stats/Fixture/Fixture';
import { IoShieldHalf } from 'react-icons/io5';
import Select from '../../components/Select/Select';
import TableTeam from '../../components/Stats/TableTeam/TableTeam.jsx';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { getPosicionesTemporada, getTemporadas, getEstadisticasTemporada } from '../../utils/dataFetchers.js';
import { dataAmarillasTemporadaColumns, dataAsistenciasTemporadaColumns, dataGoleadoresTemporadaColumns, dataPosicionesTemporadaColumns, dataRojasTemporadaColumns } from '../../components/Stats/Data/Data.jsx';
import { TailSpin } from 'react-loader-spinner';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';

const Stats = () => {
    const [temporadaSeleccionada, setTemporadaSeleccionada] = useState(null);
    const [temporadas, setTemporadas] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('Posiciones');
    const [estadisticaTemporada, setEstadisticaTemporada] = useState(null);
    const [posiciones, setPosiciones] = useState(null);
    const [loading, setLoading] = useState(true);

    const getEstadisticasTemporadaHandler = async () => {
        if (temporadaSeleccionada && filtroActivo) {
            setLoading(true);
            let estadistica;
            switch (filtroActivo) {
                case 'Goleadores':
                    estadistica = 'goles';
                    break;
                case 'Asistencias':
                    estadistica = 'asistencias';
                    break;
                case 'Expulsados':
                    estadistica = 'rojas';
                    break;
                case 'Amarillas':
                    estadistica = 'amarillas';
                    break;
                default:
                    return;
            }
            try {
                const data = await getEstadisticasTemporada(estadistica, temporadaSeleccionada);
                setEstadisticaTemporada(data);            
            } catch (error) {
                console.error('Error fetching estadisticas:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getTemporadas()
        .then((data) => setTemporadas(data))
        .catch((error) => console.error('Error en la petición', error))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const storedTemporada = localStorage.getItem('ultimaTemporadaSeleccionada');
        if (storedTemporada) {
            setTemporadaSeleccionada(storedTemporada);
        }
    }, []);

    useEffect(() => {
        if (temporadaSeleccionada) {
            setLoading(true);
            getEstadisticasTemporadaHandler();
            getPosicionesTemporada(temporadaSeleccionada)
            .then((data) => setPosiciones(data))
            .catch((error) => console.error('Error en la petición', error))
            .finally(() => setLoading(false));
        }
    }, [filtroActivo, temporadaSeleccionada]);

    const handleTemporada = (e) => {
        const selectedTemporada = e.target.value;
        setTemporadaSeleccionada(selectedTemporada);
        localStorage.setItem('ultimaTemporadaSeleccionada', selectedTemporada);
    };

    const handleFiltroClick = (filtro) => {
        setFiltroActivo(filtro);
    };

    // Temporada entera seleccionada
    const temporadaFiltrada = temporadas.find((t) => t.id_temporada == temporadaSeleccionada);

    const getColumnsForFilter = () => {
        switch (filtroActivo) {
            case 'Posiciones':
                return dataPosicionesTemporadaColumns;
            case 'Goleadores':
                return dataGoleadoresTemporadaColumns;
            case 'Asistencias':
                return dataAsistenciasTemporadaColumns;
            case 'Expulsados':
                return dataRojasTemporadaColumns;
            case 'Amarillas':
                return dataAmarillasTemporadaColumns;
            default:
                return [];
        }
    };

    return (
        <StatsContainerStyled className='container'>
            <StatsWrapper className='wrapper'>
                <StatsHeadContainer>
                    <Select 
                        data={temporadas} 
                        placeholder='Seleccionar temporada' 
                        column='nombre_temporada'
                        id_='id_temporada'
                        icon={<IoShieldHalf className='icon-select' />}
                        value={temporadaSeleccionada || '0'}
                        onChange={handleTemporada}
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

                {(temporadaSeleccionada === null || temporadaSeleccionada === '0') && (
                    <StatsNull>Seleccione una temporada para visualizar las estadísticas</StatsNull>
                )}

                {loading && (
                    <SpinerContainer>
                        <TailSpin width='40' height='40' color='#2AD174' />
                    </SpinerContainer>
                )}
                
                {!loading && temporadaSeleccionada != 0 && filtroActivo === 'Fixture' && <Fixture temporada={temporadaSeleccionada} />}
                {!loading && temporadaSeleccionada && filtroActivo !== 'Fixture' && filtroActivo !== 'Posiciones' && (
                    <TableTeam data={estadisticaTemporada} dataColumns={getColumnsForFilter()} temporada={temporadaFiltrada}/>
                )}
                {!loading && temporadaSeleccionada && filtroActivo === 'Posiciones' && (
                    <TablePosiciones data={posiciones} temporada={temporadaFiltrada} dataColumns={getColumnsForFilter()}/>
                )}
            </StatsWrapper>
        </StatsContainerStyled>
    );
};

export default Stats;
