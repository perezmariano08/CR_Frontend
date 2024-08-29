import React, { useEffect, useState, useMemo } from 'react';
import { 
    MyTeamTitleContainer, 
    MyTeamInfo, 
    MyTeamName, 
    MyTeamContainerStyled, 
    MyTeamWrapper, 
    MyTeamMatches, 
    MyTeamMatchesItem, 
    MyTeamMatchesDivisor 
} from './MyTeamStyles';
import Section from '../../components/Section/Section';
import TableTeam from '../../components/Stats/TableTeam/TableTeam.jsx';
import CardOldMatches from '../../components/Stats/CardOldMatches/CardOldMatches';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { URLImages } from '../../utils/utils';
import { dataPlantelColumns, dataPosicionesTemporadaColumns } from '../../components/Stats/Data/Data.jsx';
import { useLocation } from 'react-router-dom';
import { getJugadoresEquipo, getPosicionesTemporada, getZonas } from '../../utils/dataFetchers.js';
import useStatsTeam from '../../hooks/useStatsTeam.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { useEquipos } from '../../hooks/useEquipos.js';

const MyTeam = () => {
    const { user } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();

    const equipos = useSelector((state) => state.equipos.data);

    const searchParams = new URLSearchParams(location.search);
    const equipoIdFromParams = parseInt(searchParams.get('idEquipo'));

    const equipoId = equipoIdFromParams || user.id_equipo;

    const miEquipo = useMemo(() => equipos.find((equipo) => equipo.id_equipo === equipoId), [equipos, equipoId]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [equipoId]);

    // Custom hook para calcular estadisticas del equipo
    const { cantVictorias, cantEmpates, cantDerrotas, partidosMiEquipo } = useStatsTeam(equipoId);

    const [bdJugadores, setBdJugadores] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [posiciones, setPosiciones] = useState(null);
    const [loading, setLoading] = useState(true);

    const id_zona = miEquipo?.id_zona;
    const { escudosEquipos } = useEquipos();

    useEffect(() => {
        // Función para obtener datos
        const fetchData = async () => {
            try {
                const [jugadoresData, temporadasData, posicionesData] = await Promise.all([
                    getJugadoresEquipo(id_zona, equipoId),
                    getZonas(),
                    getPosicionesTemporada(id_zona)
                ]);

                setBdJugadores(jugadoresData);
                setZonas(temporadasData);
                setPosiciones(posicionesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (equipoId && id_zona) {
            fetchData();
        }
    }, [equipoId, id_zona]);

    useEffect(() => {
        if (equipos.length === 0) {
            dispatch(fetchEquipos());
        }
    }, [dispatch, equipos.length]);

    const zonaFiltrada = useMemo(() => 
        zonas.find((z) => z.id_zona === id_zona), 
        [zonas, id_zona]
    );

    if (!miEquipo) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    return (
        <>
            <MyTeamTitleContainer>
                <MyTeamInfo>
                    <img src={`${URLImages}${escudosEquipos(miEquipo.id_equipo)}`} alt="" />
                    <MyTeamName>
                        <h2>{miEquipo.nombre}</h2>
                        <h3>{zonaFiltrada?.nombre_categoria}</h3>
                    </MyTeamName>
                </MyTeamInfo>
            </MyTeamTitleContainer>
            <MyTeamContainerStyled className='container'>
                <MyTeamWrapper className='wrapper'>
                    <Section>
                        <h2>Estadísticas</h2>
                        <MyTeamMatches>
                            <MyTeamMatchesItem className='pj'>
                                <h4>{partidosMiEquipo.length}</h4>
                                <MyTeamMatchesDivisor/>
                                <h5>PJ</h5>
                            </MyTeamMatchesItem>
                            <MyTeamMatchesItem className='pg'>
                                <h4>{cantVictorias}</h4>
                                <MyTeamMatchesDivisor/>
                                <h5>PG</h5>
                            </MyTeamMatchesItem>
                            <MyTeamMatchesItem className='pp'>
                                <h4>{cantDerrotas}</h4>
                                <MyTeamMatchesDivisor/>
                                <h5>PP</h5>
                            </MyTeamMatchesItem>
                            <MyTeamMatchesItem className='pe'>
                                <h4>{cantEmpates}</h4>
                                <MyTeamMatchesDivisor/>
                                <h5>PE</h5>
                            </MyTeamMatchesItem>
                        </MyTeamMatches>
                    </Section>

                    <Section>
                        <h2>Plantel</h2>
                        {
                            loading ? (
                                <SpinerContainer>
                                    <TailSpin width='40' height='40' color='#2AD174' />
                                </SpinerContainer>
                            ) : (
                                <TableTeam data={bdJugadores} zona={zonaFiltrada} dataColumns={dataPlantelColumns}/>
                            )
                        }
                    </Section>
                        
                    <Section>
                        <h2>Posiciones</h2>
                        <TablePosiciones data={posiciones} zona={zonaFiltrada} dataColumns={dataPosicionesTemporadaColumns}/>
                    </Section>

                    <Section>
                        <CardOldMatches partidos={partidosMiEquipo} equipo={miEquipo}/>
                    </Section>
                </MyTeamWrapper>
            </MyTeamContainerStyled>
        </>
    );
}

export default MyTeam;
