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
import { getFormaciones, getIndicencias, traerPlantelesPartido } from '../../utils/dataFetchers';
import { formacionesHelper } from './helpers';

const MatchStats = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));

    const [formaciones, setFormaciones] = useState([]);
    const [incidencias, setIncidencias] = useState(null);
    const [activeTab, setActiveTab] = useState('Previa');
    const [loading, setLoading] = useState(true);

    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find(p => p.id_partido === partidoId);
    const jugadores = useSelector((state) => state.jugadores.data);

    const { partidosJugados, partidosEntreEquipos } = useMatchOlds(partido?.id_equipoLocal, partido?.id_equipoVisita);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [partidoId]);

    useEffect(() => {
        const fetchData = async () => {
            if (partidoId) {
                setLoading(true);
                try {
                    let formacionesData = [];
                    if (partido.estado === 'F') {
                        formacionesData = await getFormaciones(partidoId);
                    } else {
                        setIncidencias(await getIndicencias(partidoId));
                        const plantelesData = await traerPlantelesPartido(partidoId);
                        // Asegúrate de que plantelesData sea un array
                        formacionesData = Array.isArray(plantelesData) ? plantelesData : [];
                    }
                    setFormaciones(formacionesHelper(formacionesData, partido.id_equipoLocal, partido.id_equipoVisita));
                } catch (error) {
                    console.error('Error fetching data', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [partidoId, partido?.estado]);
    
    const localTeamId = partido?.id_equipoLocal;
    const visitingTeamId = partido?.id_equipoVisita;

    if (loading) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    if (!partido) {
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
                    <CardFinalPartido idPartido={partidoId}/>
                </Section>

                <Navigate>
                    <p className={activeTab === 'Previa' ? 'active' : ''} onClick={() => setActiveTab('Previa')}>Previa</p>
                    <p className={activeTab === 'Cara a cara' ? 'active' : ''} onClick={() => setActiveTab('Cara a cara')}>Cara a cara</p>
                </Navigate>

                {activeTab === 'Previa' && (
                    <>
                        {
                        partido.estado !== 'S' && <Alignment formaciones={formaciones} jugadores={jugadores} partido={partido} />
                        }
                        {partido.estado !== 'P' && <Incidents formaciones={formaciones} partidoId={partidoId} />}
                        {partidosJugados.length === 0 && <StatsOldMatches partidosPorEquipo={partidosJugados} idLocal={localTeamId} idVisita={visitingTeamId} />}
                    </>
                )}

                {activeTab === 'Cara a cara' && (
                    <>
                        <HistoryBeetwenTeams partidosEntreEquipos={partidosEntreEquipos} idLocal={localTeamId} idVisita={visitingTeamId} />
                        {
                            partidosEntreEquipos.length > 0 && (
                                <MatchsBetweenTeams partidosEntreEquipos={partidosEntreEquipos} idLocal={localTeamId} idVisita={visitingTeamId} />
                            )
                        }
                    </>
                )}
            </MatchStatsWrapper>
        </MatchStatsContainer>
    );
};

export default MatchStats;
