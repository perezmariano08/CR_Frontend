import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardFinalPartido from '../../components/Stats/CardFinalPartido/CardFinalPartido';
import Section from "../../components/Section/Section";
import { MatchStatsContainer, MatchStatsWrapper, Navigate } from './MatchStatsStyles';
import Alignment from '../../components/Stats/Alignment/Alignment';
import Incidents from '../../components/Stats/Incidents/Incidents';
import { useSelector } from 'react-redux';
import { SpinerContainer } from '../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';
import StatsOldMatches from '../../components/Stats/StatsOldMatches/StatsOldMatches';
import useMatchOlds from '../../hooks/useMatchOlds';
import HistoryBeetwenTeams from '../../components/Stats/HistoryBeetwenTeams/HistoryBeetwenTeams';
import MatchsBetweenTeams from '../../components/Stats/MatchsBetweenTeams/MatchsBetweenTeams';
import { getFormaciones, getIndicencias } from '../../utils/dataFetchers';
import { formacionesHelper } from './helpers';

const MatchStats = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));

    const [formaciones, setFormaciones] = useState(null);
    const [incidencias, setIncidencias] = useState(null);
    const [activeTab, setActiveTab] = useState('Previa'); // Estado para controlar la pestaña activa

    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find(p => p.id_partido === partidoId);
    const jugadores = useSelector((state) => state.jugadores.data);

    //CUSTOM
    const { partidosJugados, partidosEntreEquipos } = useMatchOlds(partido?.id_equipoLocal, partido?.id_equipoVisita);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [partidoId]);

    //Fetch a formaciones e incidencias
    useEffect(() => {
        const fetchData = async () => {
            if (partidoId) {
                try {
                    const formacionesData = await getFormaciones(partidoId);
                    setFormaciones(formacionesData || []);

                    const incidenciasData = await getIndicencias(partidoId);
                    setIncidencias(incidenciasData || []);
                } catch (error) {
                    console.error('Error fetching data', error);
                }
            }
        }
        fetchData();
    }, [partidoId]);

    const localTeamId = partido.id_equipoLocal;
    const visitingTeamId = partido.id_equipoVisita;
    
    const formacionesConNombreApellido = formacionesHelper(formaciones, localTeamId, visitingTeamId);

    if (!formaciones || !incidencias || !partido) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    return (
        <MatchStatsContainer className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Section>
                    <h2>Ficha de Partido</h2>
                    <CardFinalPartido idPartido={partidoId} incidencias={incidencias} />
                </Section>

                <Navigate>
                    <p className={activeTab === 'Previa' ? 'active' : ''} onClick={() => setActiveTab('Previa')}>Previa</p>
                    <p className={activeTab === 'Cara a cara' ? 'active' : ''} onClick={() => setActiveTab('Cara a cara')}>Cara a cara</p>
                </Navigate>

                {activeTab === 'Previa' && (
                    <>
                        <Alignment formaciones={formacionesConNombreApellido} jugadores={jugadores} partido={partido} />
                        {partido.estado === 'F' &&<Incidents incidentes={incidencias} formaciones={formacionesConNombreApellido} partidoId={partidoId} />}
                        <StatsOldMatches partidosPorEquipo={partidosJugados} idLocal={localTeamId} idVisita={visitingTeamId}/>
                    </>
                )}

                {activeTab === 'Cara a cara' && (
                    <>
                        <HistoryBeetwenTeams partidosEntreEquipos={partidosEntreEquipos} idLocal={localTeamId} idVisita={visitingTeamId}/>
                        <MatchsBetweenTeams partidosEntreEquipos={partidosEntreEquipos} idLocal={localTeamId} idVisita={visitingTeamId}/>
                    </>
                )}
            </MatchStatsWrapper>
        </MatchStatsContainer>
    );
};

export default MatchStats;
