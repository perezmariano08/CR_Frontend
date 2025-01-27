import React, { useEffect, useMemo, useState } from 'react';
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
import { obtenerTipoPartido } from '../../components/Stats/statsHelpers';
import usePartido from '../../hooks/planilla/usePartido';
import CardPartidoIda from '../../components/Stats/CardPartidoIda/CardPartidoIda';

const MatchStats = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find(p => +p.id_partido === +partidoId);

    const stableEventosSocket = useMemo(() => [
        'insertar-gol',
        'insertar-amarilla',
        'insertar-roja',
        'eliminar-gol',
        'eliminar-amarilla',
        'eliminar-expulsion',
        'actualizar-gol',
        'actualizar-amarilla',
        'actualizar-roja',
    ], []);

    const { incidencias, loading: loading_incidencias } = useIncidencias(partidoId, stableEventosSocket);

    const { formaciones, loading: loading_formaciones, socketLoading: loading_socket_formaciones } = useFormaciones(partidoId)

    const [activeTab, setActiveTab] = useState('Previa');

    useEffect(() => {
        if (formaciones?.length > 0 && partido?.estado !== 'S') {
            setActiveTab('Previa');
        } else {
            setActiveTab('Cara a cara');
        }
    }, [formaciones, partido?.estado]);
    

    const { partidosJugados, partidosEntreEquipos } = useMatchOlds(partido?.id_equipoLocal, partido?.id_equipoVisita);

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
    
    const esVuelta = obtenerTipoPartido(partido)
    const [partidoIda, setPartidoIda] = useState(null);

    useEffect(() => {
        if (partido && obtenerTipoPartido(partido) == 'vuelta') {
            const partidoIda = partidos.find((p) => p.id_partido == partido.ida);
            setPartidoIda(partidoIda);
        }
    }, [partido.id_partido, partido]);
    
    return (
        <MatchStatsContainer className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Section>
                    <h2>Ficha del Partido</h2>
                    {
                        esVuelta === 'vuelta' && (
                            <CardPartidoIda partido={partidoIda} />
                        )
                    }
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
                        {partido.estado !== 'S' && (
                            <Alignment formaciones={formaciones} partido={partido} />
                        )}
                        {partido.estado !== 'P' && (<Incidents incidencias={incidencias} formaciones={formaciones} partido={partido}/>)}
                        {partidosJugados.length === 0 && <StatsOldMatches partidosPorEquipo={partidosJugados} idLocal={localTeamId} idVisita={visitingTeamId} />}
                    </>
                )}

                {activeTab === 'Cara a cara' && (
                    <>
                        <HistoryBeetwenTeams partidosEntreEquipos={partidosEntreEquipos} partido={partido} />
                        {
                            partidosEntreEquipos.length > 0 && (
                                <MatchsBetweenTeams partidosEntreEquipos={partidosEntreEquipos}/>
                            )
                        }
                    </>
                )}
            </MatchStatsWrapper>
        </MatchStatsContainer>
    );
};

export default MatchStats;
