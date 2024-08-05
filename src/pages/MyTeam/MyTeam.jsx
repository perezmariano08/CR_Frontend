import React, { useEffect, useState } from 'react'
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
import { URL } from '../../utils/utils';
import { dataPlantelColumns, dataPosicionesTemporadaColumns } from '../../components/Stats/Data/Data.jsx';
import { useLocation } from 'react-router-dom';
import { getJugadoresEquipo, getPosicionesTemporada, getTemporadas } from '../../utils/dataFetchers.js';
import useStatsTeam from '../../hooks/useStatsTeam.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';

const MyTeam = () => {
    const { user } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();

    const equipos = useSelector((state) => state.equipos.data);

    const searchParams = new URLSearchParams(location.search);
    const equipoIdFromParams = parseInt(searchParams.get('idEquipo'));

    const equipoId = equipoIdFromParams || user.id_equipo;
    
    const miEquipo = equipos.find((equipo) => equipo.id_equipo === equipoId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [equipoId]);

    //Custom hook para calcular estadisticas del equipo
    const { cantVictorias, cantEmpates, cantDerrotas, partidosMiEquipo } = useStatsTeam(equipoId);

    const [bdJugadores, setBdJugadores] = useState(null);
    const [temporadas, setTemporadas] = useState([]);

    const id_temporada = miEquipo?.id_temporada;

    //Fetch a jugadores
    useEffect(() => {
        if (equipoId) {
            getJugadoresEquipo(id_temporada, equipoId)
            .then((data) => setBdJugadores(data))
            .catch((error) => console.error('Error fetching temporadas:', error))
        } else {
            console.error('ID de equipo no definido');
        }
    }, [equipoId]);

    //Fetch a temporadas
    useEffect(() => {
        getTemporadas()
            .then((data) => setTemporadas(data))
            .catch((error) => console.error('Error fetching temporadas:', error));
    }, []);

    const [posiciones, setPosiciones] = useState(null);
    //Fetch a posiciones temporadas
    useEffect(() => {
        if (id_temporada) {
            getPosicionesTemporada(id_temporada)
            .then((data) => setPosiciones(data))
            .catch((error) => console.error('Error en la petición', error))
        } else {
            console.error('ID de temporada no definido');
        }
    }, [id_temporada]);

    useEffect(() => {
        dispatch(fetchEquipos());
    }, [dispatch]);

    const temporadaFiltrada = temporadas.find((t) => t.id_temporada === id_temporada);

    if (!miEquipo) {
        return  <SpinerContainer>
                    <TailSpin width='40' height='40' color='#2AD174' />
                </SpinerContainer>
    }
    
    return (
        <>
            <MyTeamTitleContainer>
                <MyTeamInfo>
                    <img src={`${URL}${miEquipo.img}`} alt="" />
                    <MyTeamName>
                        <h2>{miEquipo.nombre}</h2>
                        <h3>{miEquipo.division}</h3>
                    </MyTeamName>
                </MyTeamInfo>
            </MyTeamTitleContainer>
            <MyTeamContainerStyled className='container'>
                <MyTeamWrapper className='wrapper'>
                    <Section>
                        <h2>Partidos</h2>
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
                        <TableTeam data={bdJugadores} temporada={temporadaFiltrada} dataColumns={dataPlantelColumns}/>
                    </Section>
                        
                    <Section>
                        <h2>Posiciones</h2>
                        <TablePosiciones data={posiciones} temporada={temporadaFiltrada} dataColumns={dataPosicionesTemporadaColumns}/>
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
