import React, { useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper } from './HomeStyles';
import Section from '../../components/Section/Section';
import Table from '../../components/Stats/Table/Table';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../../Auth/AuthContext';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../redux/ServicesApi/partidosSlice';
import { fetchJugadores } from '../../redux/ServicesApi/jugadoresSlice';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const jugadoresData = useSelector((state) => state.jugadores.data);
    const loadingPartidos = useSelector((state) => state.partidos.loading);

    const { user, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();

    useEffect(() => {
        if (userName && showWelcomeToast) {
            toast(`Bienvenid@, ${userName}`, {
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

    useEffect(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
        dispatch(fetchJugadores());
}, [dispatch]);

    //Proximo partido de mi equipo o actual ACTUALIZAR !!
    const miEquipo = equipos.find((equipo) => equipo.id_equipo === user.id_equipo)
    const partido = partidos.filter((partido) => partido.id_equipoLocal === miEquipo.id_equipo || partido.id_equipoVisita === miEquipo.id_equipo)[0];
    const partidosFecha = partidos.filter((partido) => partido.division === miEquipo.division)

    return (
        <>  
            <HomeContainerStyled className='container'>
                <HomeWrapper className='wrapper'>
                    <Section>
                        <h2>Próximo partido</h2>
                        <CardPartido rol={user.id_rol} partido={partido}/>
                    </Section>
                    <Section>
                        <h2>{`Fecha ${partidosFecha[0].jornada} - ${partidosFecha[0].torneo} ${partidosFecha[0].año}`}</h2>
                        <CardsMatchesContainer>
                            <CardsMatchesWrapper>
                            {
                                partidosFecha.map((p) => (
                                    <CardPartido key={p.id_partido} rol={user.id_rol} partido={p} />
                                ))
                            }
                            </CardsMatchesWrapper>
                        </CardsMatchesContainer>
                    </Section>
                    <Section>
                        <h2>Posiciones</h2>
                        <Table/>
                    </Section>
                </HomeWrapper>
            </HomeContainerStyled>
            <Toaster/>
        </> 
    );
}

export default Home;
