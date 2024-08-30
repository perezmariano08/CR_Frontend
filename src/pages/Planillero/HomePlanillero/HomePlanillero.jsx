import React, { useEffect, useState } from 'react';
import { HomeWrapper, ViewMore } from '../../Home/HomeStyles';
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

    //Custom Hooks
    useFetchMatches((partidos) => partidos.id_planillero === userId);
    useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast);

    const partidosPendientes = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado === 'P')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosNoPendientes = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado !== 'P')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosFiltrados = [...partidosPendientes, ...partidosNoPendientes];

    useEffect(() => {
        if (!showAll) {
            window.scrollTo(0, 0);
        }
    }, [showAll]);

    const handleViewMore = (e, accion) => {
        e.preventDefault();
        if (accion) {
            setShowAll(true);
        } else {
            setShowAll(false);
        }   
    }

    return (
        <HomePlanilleroContainer>
            <HomeWrapper>
                <Section>
                    {partidosFiltrados && partidosFiltrados.length > 0 ? (
                        <h2>Mis Partidos</h2>
                    ) : (
                        <h2>No tienes partidos cargados</h2>
                    )}
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
                    <ViewMore>
                        <a href="" onClick={(e) => handleViewMore(e, !showAll)}>
                            {showAll ? 'Ver menos' : 'Ver más'}
                        </a>
                    </ViewMore>
                )}
            </HomeWrapper>
            <Toaster />
        </HomePlanilleroContainer>
    );
};

export default HomePlanillero;
