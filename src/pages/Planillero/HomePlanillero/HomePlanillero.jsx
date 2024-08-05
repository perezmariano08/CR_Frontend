import React from 'react';
import { HomeWrapper } from '../../Home/HomeStyles';
import Section from '../../../components/Section/Section';
import { HomePlanilleroContainer } from './HomePlanilleroStyles';
import CardPartido from '../../../components/Stats/CardPartido/CardPartido';
import { useAuth } from '../../../Auth/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SpinerContainer } from '../../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';
import useFetchMatches from '../../../hooks/useFetchMatches';
import useMessageWelcome from '../../../hooks/useMessageWelcome';

const HomePlanillero = () => {
    const { user, userId, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    const partidos = useSelector((state) => state.partidos.data);
    const loadingPartidos = useSelector((state) => state.partidos.loading);

    //Traer todos los partidos del planillero
    useFetchMatches((partidos) => partidos.id_planillero === userId);
    useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast)

    const partidosFiltrados = partidos.filter((partido) => partido.id_planillero === userId);

    return (
        <HomePlanilleroContainer>
            <HomeWrapper>
                <Section>
                    {
                        partidosFiltrados && partidosFiltrados.length > 0 ? (
                            <h2>Mis Partidos</h2>
                        ) : (
                            <h2>No tienes partidos cargados</h2>
                        )}
                    {loadingPartidos ? (
                        <SpinerContainer>
                            <TailSpin width='40' height='40' color='#2AD174' />
                        </SpinerContainer>
                    ) : (
                        partidosFiltrados.map((partido) => (
                            <CardPartido key={partido.id_partido} rol={user.id_rol} partido={partido}/>
                        ))
                    )}
                </Section>
            </HomeWrapper>
            <Toaster />
        </HomePlanilleroContainer>
    );
};

export default HomePlanillero;
