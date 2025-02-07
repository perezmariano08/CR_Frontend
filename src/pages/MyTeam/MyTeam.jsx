import React, { useEffect, useState, useMemo } from 'react';
import { 
    MyTeamMatches, 
    MyTeamMatchesItem, 
    MyTeamMatchesDivisor, 
    MyTeamSectionTop,
    MyTeamSection
} from './MyTeamStyles';
import Section from '../../components/Section/Section';
import TableTeam from '../../components/Stats/TableTeam/TableTeam.jsx';
import CardOldMatches from '../../components/Stats/CardOldMatches/CardOldMatches';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { URLImages } from '../../utils/utils';
import { dataPlantelColumns, dataPosicionesTemporadaColumns } from '../../components/Stats/Data/Data.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import { getJugadoresEquipo, getPosicionesTemporada, getZonas } from '../../utils/dataFetchers.js';
import useStatsTeam from '../../hooks/useStatsTeam.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { useEquipos } from '../../hooks/useEquipos.js';
import { ContentMenuLink, ContentUserContainer, ContentUserMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, TablePosicionesContainer, TituloContainer, TituloText } from '../../components/Content/ContentStyles.js';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import CardPartido from '../../components/Stats/CardPartido/CardPartido.jsx';
import { PartidosGenericosContainer } from '../../components/CardsPartidos/CardPartidoGenerico/CardPartidosGenericoStyles.js';
import CardPartidoGenerico from '../../components/CardsPartidos/CardPartidoGenerico/CardPartidoGenerico.jsx';
import { SectionHome, SectionHomeTitle } from '../Home/HomeStyles.js';
import { fetchPartidos } from '../../redux/ServicesApi/partidosSlice.js';

const MyTeam = () => {
    const { user } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();

    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const equipos = useSelector((state) => state.equipos.data);
    const temporadas = useSelector((state) => state.temporadas.data);

    const searchParams = new URLSearchParams(location.search);
    const equipoIdFromParams = parseInt(searchParams.get('idEquipo'));

    const equipoId = equipoIdFromParams || idMyTeam;

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


    const temporadasEquipo = temporadas.filter(t => t.id_equipo === equipoId && t.tipo_zona === "todos-contra-todos");
            const ultimaTemporada = temporadasEquipo.length > 0 
                ? temporadasEquipo[temporadasEquipo.length - 1] 
                : null;

            console.log("Última temporada encontrada:", ultimaTemporada);

            const id_zona_temporada = ultimaTemporada ? ultimaTemporada.id_zona : 1;
    const id_zona = id_zona_temporada;
    const { escudosEquipos } = useEquipos();
    
    useEffect(() => {
        if (equipos.length === 0) {
            dispatch(fetchEquipos());
            dispatch(fetchTemporadas());
            dispatch(fetchPartidos());
        }
    }, [dispatch, equipos.length]);

    const zonaFiltrada = useMemo(() => 
        zonas.find((z) => z.id_zona === id_zona), 
        [zonas, id_zona]
    );

    const {partidoAMostrar, proximoPartido} = useMatchesUser(equipoId);

    if (!miEquipo) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    useEffect(() => {
        console.log(id_zona, equipoId);

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

    
    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                <ContentUserTituloContainerStyled>
                        <ContentUserTituloContainer>
                            <TituloContainer>
                                <img src={`${URLImages}${escudosEquipos(miEquipo.id_equipo)}`}/>
                                <TituloText>
                                    <h1>{miEquipo?.nombre}</h1>
                                </TituloText>
                            </TituloContainer>
                        </ContentUserTituloContainer>
                        <ContentUserMenuTitulo>
                        <ContentMenuLink>
                            <NavLink to={`/my-team`}>
                                Resumen
                            </NavLink>
                            {/* <NavLink to={`/my-team/partidos`}>
                                Partidos
                            </NavLink> */}
                            </ContentMenuLink>
                        </ContentUserMenuTitulo>
                    </ContentUserTituloContainerStyled>

                    <MyTeamSectionTop>
                        {
                            proximoPartido && (
                                <Section>
                                    <h2>Próximo partido</h2>
                                    <CardPartido partido={partidoAMostrar}/>
                                </Section>
                            )
                        }

                        <MyTeamSection>
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
                        </MyTeamSection>
                    </MyTeamSectionTop>

                    <Section>
                        {
                            loading ? (
                                <SpinerContainer>
                                    <TailSpin width='40' height='40' color='#2AD174' />
                                </SpinerContainer>
                            ) : (
                                <TableTeam data={bdJugadores} zona={zonaFiltrada} dataColumns={dataPlantelColumns} id_equipo={equipoId}/>
                            )
                        }
                                
                        
                    </Section>
                    {/* <Section>
                        <h2>Posiciones</h2>
                        <TablePosiciones 
                            data={posiciones} 
                            zona={zonaFiltrada} 
                            id_categoria={1}
                            dataColumns={dataPosicionesTemporadaColumns}
                        />
                    </Section> */}
                    <SectionHome>
                        <SectionHomeTitle>
                            Últimos partidos
                        </SectionHomeTitle>
                        <PartidosGenericosContainer>
                            {partidosMiEquipo
                            .sort((a, b) => new Date(b.dia) - new Date(a.dia))
                            .map((p) => (
                                <CardPartidoGenerico key={p.id_partido} {...p} />
                            ))}
                        </PartidosGenericosContainer>
                    </SectionHome>
                    {/* <Section>
                        <CardOldMatches partidos={partidosMiEquipo} equipo={miEquipo}/>
                    </Section> */}
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
}

export default MyTeam;
