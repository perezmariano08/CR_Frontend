import React, { useEffect, useState } from 'react';
import { HomeWrapper, TopContainer, ViewMore, ViewMoreWrapper } from '../../Home/HomeStyles';
import Section from '../../../components/Section/Section';
import { HomePlanilleroContainer } from './HomePlanilleroStyles';
import CardPartido from '../../../components/Stats/CardPartido/CardPartido';
import { useAuth } from '../../../Auth/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { SpinerContainer } from '../../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';
import useFetchMatches from '../../../hooks/useFetchMatches';
import useMessageWelcome from '../../../hooks/useMessageWelcome';

const HomePlanillero = () => {
    const { userRole, userId, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    const partidos = useSelector((state) => state.partidos.data);
    const loadingPartidos = useSelector((state) => state.partidos.loading);

    const [showAll, setShowAll] = useState(false);
    const [isPending, setIsPending] = useState(true); 

    // Custom Hooks
    useFetchMatches((partidos) => partidos.id_planillero === userId);
    useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast);

    const partidosPendientes = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado === 'P')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosPlanillados = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado === 'F')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosFiltrados = isPending ? partidosPendientes : partidosPlanillados;

    useEffect(() => {
        if (!showAll) {
            window.scrollTo(0, 0);
        }
    }, [showAll]);

    const handleViewMore = (e, accion) => {
        e.preventDefault();
        setShowAll(accion);
    }

    const handleToggleChange = () => {
        setIsPending(!isPending); // Cambiar entre partidos pendientes y planillados
    };

    return (
        <HomePlanilleroContainer>
            <HomeWrapper className='planilla'>
                <Section>
                    <TopContainer>
                        <label className="toggle-switch">
                            <input type="checkbox" onChange={handleToggleChange} checked={!isPending} />
                            <span className="slider round"></span>
                        </label>
                        {partidosFiltrados && partidosFiltrados.length > 0 ? (
                            <h2>{isPending ? 'Partidos Pendientes' : 'Partidos Planillados'}</h2>
                        ) : (
                            <h2>No tienes partidos cargados</h2>
                        )}
                    </TopContainer>
                    {loadingPartidos ? (
                        <SpinerContainer>
                            <TailSpin width='40' height='40' color='#2AD174' />
                        </SpinerContainer>
                    ) : (
                        partidosFiltrados.slice(0, showAll ? partidosFiltrados.length : 3).map((partido) => (
                            <CardPartido key={partido.id_partido} rol={userRole} partido={partido} />
                        ))
                    )}
                </Section>
                {partidosFiltrados.length > 3 && (
                    <ViewMoreWrapper>
                        <ViewMore href="" onClick={(e) => handleViewMore(e, !showAll)} className={showAll ? 'menos' : 'mas'}>
                            {showAll ? 'Ver menos' : 'Ver más'}
                        </ViewMore>
                    </ViewMoreWrapper>
                )}
            </HomeWrapper>
            <Toaster />
        </HomePlanilleroContainer>
    );
};

export default HomePlanillero;
