import React, { useEffect, useState } from 'react';
import { URLImages } from '../../utils/utils';
import { NavLink, useParams } from 'react-router-dom';
import { useEquipos } from '../../hooks/useEquipos.js';
import { useJugadores } from '../../hooks/useJugadores.js';
import { ContentMenuLink, ContentUserContainer, ContentUserMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, TablePosicionesContainer, TituloContainer, TituloText } from '../../components/Content/ContentStyles.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice.js';
import { EquipoPartidosWrapper, EstadisticasContainer, EstadisticasTemporada, EstadisticasTemporadaDetalles, EstadisticasTemporadaDetallesItem, EstadisticasTemporadaDetallesWrapper, EstadisticasTemporadaGeneral } from './MyTeamStyles.js';
import { getParticipacionesEquipo } from '../../utils/dataFetchers.js';
import { SectionHome, SectionHomeTitle } from '../Home/HomeStyles.js';
import { PartidosGenericosContainer } from '../../components/CardsPartidos/CardPartidoGenerico/CardPartidosGenericoStyles.js';
import useStatsTeam from '../../hooks/useStatsTeam.js';
import CardPartidoGenerico from '../../components/CardsPartidos/CardPartidoGenerico/CardPartidoGenerico.jsx';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import Section from '../../components/Section/Section.jsx';
import CardProximoPartido from '../../components/CardsPartidos/CardProximoPartido/CardProximoPartido.jsx';


const EquipoPartidos = () => {
    const { id_equipo } = { id_equipo: parseInt(useParams().id_equipo) };
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const dispatch = useDispatch()

    const temporadas = useSelector((state) => state.temporadas.data);
    const temporadasEquipo = temporadas.filter((t) => t.id_equipo === id_equipo)
    const temporadasUnicas = Array.from(
        new Map(temporadasEquipo.map(t => [t.id_categoria, t])).values()
    );
    const [estadisticas, setEstadisticas] = useState(null)
    const ultimaTemporada = temporadasEquipo.length > 0 
    ? temporadasEquipo[temporadasEquipo.length - 1] 
    : null;

    const {partidosMiEquipo } = useStatsTeam(id_equipo);
    const {partidoAMostrar, proximoPartido} = useMatchesUser(id_equipo);

    useEffect(() => {
        if (temporadas.length === 0) {
            dispatch(fetchTemporadas())
        }
        // Función para obtener datos
        const fetchData = async () => {
            try {
                const [estadisticasData] = await Promise.all([
                    getParticipacionesEquipo(id_equipo)
                ]);
                setEstadisticas(estadisticasData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [dispatch, temporadas.length]);
    
    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                    <ContentUserTituloContainerStyled>
                        <ContentUserTituloContainer>
                            <TituloContainer>
                                <img src={`${URLImages}${escudosEquipos(id_equipo)}`}/>
                                <TituloText>
                                    <h1>{nombresEquipos(id_equipo)}</h1>
                                </TituloText>
                            </TituloContainer>
                        </ContentUserTituloContainer>
                        <ContentUserMenuTitulo>
                            <ContentMenuLink>
                                <NavLink to={`/equipos/${id_equipo}`} end>
                                    Resumen
                                </NavLink>
                                <NavLink to={`/equipos/${id_equipo}/partidos`}>
                                    Partidos
                                </NavLink>
                                <NavLink to={`/equipos/${id_equipo}/participaciones`}>
                                    Participaciones
                                </NavLink>
                            </ContentMenuLink>
                        </ContentUserMenuTitulo>
                    </ContentUserTituloContainerStyled>
                    <EquipoPartidosWrapper>
                    {
                            proximoPartido && (
                                <Section>
                                    <SectionHome>
                                        <SectionHomeTitle>
                                            <span>Proximo partido</span>
                                        </SectionHomeTitle>
                                        <CardProximoPartido
                                            {...partidoAMostrar}
                                            miEquipo={id_equipo}
                                        />
                                    </SectionHome>
                                </Section>
                            )
                        }                 
                        <SectionHome style={{width: '100%'}}>
                            <PartidosGenericosContainer>
                                {partidosMiEquipo
                                .sort((a, b) => new Date(b.dia) - new Date(a.dia))
                                .map((p) => (
                                    <CardPartidoGenerico key={p.id_partido} {...p} />
                                ))}
                            </PartidosGenericosContainer>
                        </SectionHome>
                    </EquipoPartidosWrapper>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
}

export default EquipoPartidos;
