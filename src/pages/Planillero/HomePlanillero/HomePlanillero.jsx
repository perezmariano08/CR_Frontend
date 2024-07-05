import React, { useEffect } from 'react';
import { HomeWrapper } from '../../Home/HomeStyles';
import Section from '../../../components/Section/Section';
import { HomePlanilleroContainer } from './HomePlanilleroStyles';
import CardPartido from '../../../components/Stats/CardPartido/CardPartido';
import { useAuth } from '../../../Auth/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import { useDispatch, useSelector } from 'react-redux';

const HomePlanillero = () => {
    const dispatch = useDispatch();
    const { userId, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    const partidos = useSelector((state) => state.partidos.data);
    const loadingPartidos = useSelector((state) => state.partidos.loading)

    // Mostrar mensaje de bienvenida
    useEffect(() => {
        if (userName && showWelcomeToast) {
            toast(`Bienvenid@, planillero ${userName}`, {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: 'var(--gray-500)',
                    color: 'var(--white)',
                },
                duration: 4000,
                position: "top-center"
            });
            setShowWelcomeToast(false);
        }
    }, [userName, showWelcomeToast, setShowWelcomeToast]);

    // Consumir de la bd los equipos y partidos
    useEffect(() => {
        dispatch(fetchPartidos());
    }, [dispatch]);

    const partidosFiltrados = partidos.filter((partido) => {return partido.id_planillero === userId})
    console.log(partidosFiltrados);

    return (
        <HomePlanilleroContainer>
            <HomeWrapper>
                <Section>
                    <h2>Mis Partidos</h2>
                    {loadingPartidos ? (
                        <p>Cargando partidos...</p>
                    ) : (
                        partidosFiltrados.map((partido) => (
                            <CardPartido key={partido.id_partido} observer partido={partido}/>
                        ))
                    )}
                </Section>
            </HomeWrapper>
            <Toaster />
        </HomePlanilleroContainer>
    );
}

export default HomePlanillero;
