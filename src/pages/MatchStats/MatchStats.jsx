import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardFinalPartido from '../../components/Stats/CardFinalPartido/CardFinalPartido';
import Section from "../../components/Section/Section";
import { MatchStatsContainer, MatchStatsWrapper, Navigate } from './MatchStatsStyles';
import Alignment from '../../components/Stats/Alignment/Alignment';
import Incidents from '../../components/Stats/Incidents/Incidents';
import { useDispatch, useSelector } from 'react-redux';
import { SpinerContainer } from '../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';
import StatsOldMatches from '../../components/Stats/StatsOldMatches/StatsOldMatches';
import useMatchOlds from '../../hooks/useMatchOlds';
import HistoryBeetwenTeams from '../../components/Stats/HistoryBeetwenTeams/HistoryBeetwenTeams';
import MatchsBetweenTeams from '../../components/Stats/MatchsBetweenTeams/MatchsBetweenTeams';
import { useIncidencias } from '../../hooks/planilla/useIncidencias';
import { useFormaciones } from '../../hooks/planilla/useFormaciones';
import { fetchPartidos } from '../../redux/ServicesApi/partidosSlice';
import JugadorDelPartido from '../../components/Stats/JugadorDelPartido/JugadorDelPartido';

const MatchStats = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));

    const { incidencias, loading: loading_incidencias } = useIncidencias(partidoId, ['insertar-gol', 'insertar-amarilla', 'insertar-roja', 'eliminar-gol', 'eliminar-amarilla', 'eliminar-expulsion', 'actualizar-gol', 'actualizar-amarilla', 'actualizar-roja']);
    console.log(incidencias);
    
    const { formaciones, loading: loading_formaciones, socketLoading: loading_socket_formaciones } = useFormaciones(partidoId)

    const [activeTab, setActiveTab] = useState(() => 
        formaciones?.length > 0 && formaciones?.length > 0 ? 'Previa' : 'Cara a cara'
    );

    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find(p => +p.id_partido === +partidoId);

    const { partidosJugados, partidosEntreEquipos } = useMatchOlds(partido?.id_equipoLocal, partido?.id_equipoVisita);

    useEffect(() => {
        if (activeTab === 'Previa' && (!formaciones?.length || !formaciones?.length)) {
            setActiveTab('Cara a cara');
        }
    }, [formaciones]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [partidoId]);

    const localTeamId = partido?.id_equipoLocal;
    const visitingTeamId = partido?.id_equipoVisita;

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
                    <CardFinalPartido partido={partido} incidencias={incidencias} />
                </Section>

                <Navigate>
                    {
                        formaciones?.length > 0 && partido.estado !== 'S' && (
                            <p className={activeTab === 'Previa' ? 'active' : ''} onClick={() => setActiveTab('Previa')}>Previa</p>
                        )
                    }
                    <p className={activeTab === 'Cara a cara' ? 'active' : ''} onClick={() => setActiveTab('Cara a cara')}>Cara a cara</p>
                </Navigate>

                {activeTab === 'Previa' && (
                    <>
                        {
                        partido.estado !== 'S' && <Alignment formaciones={formaciones} partido={partido} />
                        }
                        {partido.estado !== 'P' && <Incidents incidencias={incidencias} formaciones={formaciones} partido={partido} />}
                        {partidosJugados.length === 0 && <StatsOldMatches partidosPorEquipo={partidosJugados} idLocal={localTeamId} idVisita={visitingTeamId} />}
                        <JugadorDelPartido formaciones={formaciones} partido={partido}/>
                    </>
                )}

                {activeTab === 'Cara a cara' && (
                    <>
                        <HistoryBeetwenTeams partidosEntreEquipos={partidosEntreEquipos} id_partido={partidoId} />
                    </>
                )}
            </MatchStatsWrapper>
        </MatchStatsContainer>
    );
};

export default MatchStats;
