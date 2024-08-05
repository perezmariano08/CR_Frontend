import React, { useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper } from './HomeStyles';
import Section from '../../components/Section/Section';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../../Auth/AuthContext';
import { useSelector } from 'react-redux';
import { useMatches, useNavigate } from 'react-router-dom';
import { getPosicionesTemporada, getTemporadas } from '../../utils/dataFetchers';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { dataPosicionesTemporadaColumns } from '../../components/Stats/Data/Data';
import useFetchMatches from '../../hooks/useFetchMatches';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import useMessageWelcome from '../../hooks/useMessageWelcome.js';

const Home = () => {
    const { user, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();

    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === user.id_equipo);
    const id_temporada = miEquipo?.id_temporada;

    //Custom hooks
    useFetchMatches((partido) => miEquipo && partido.division === miEquipo.division);
    useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast)
    const { partidoAMostrar, partidos, proximoPartido, fechaActual } = useMatchesUser(user.id_equipo);

    const [posiciones, setPosiciones] = useState(null);
    const [temporadas, setTemporadas] = useState([]);

    //Fetch a informacion de temporadas 
    useEffect(() => {
        if (id_temporada) {
            getPosicionesTemporada(id_temporada)
            .then((data) => setPosiciones(data))
            .catch((error) => console.error('Error en la petición', error))
        } else {
            console.error('ID de temporada no definido');
        }
    }, [id_temporada]);

    useEffect(() => {
        getTemporadas()
            .then((data) => setTemporadas(data))
            .catch((error) => console.error('Error fetching temporadas:', error));
    }, []);

    const temporadaFiltrada = temporadas.find((t) => t.id_temporada === id_temporada);

    return (
        <>
            <HomeContainerStyled className='container'>
                <HomeWrapper className='wrapper'>
                    <Section>
                        <h2>{proximoPartido ? 'Próximo partido' : 'Último partido'}</h2>
                        {partidoAMostrar ? (
                            <CardPartido
                                rol={user.id_rol}
                                partido={partidoAMostrar}
                            />
                        ) : (
                            <p>No hay partidos programados para tu equipo.</p>
                        )}
                    </Section>
                    <Section>
                        {fechaActual && partidos.length > 0 ? (
                            <>
                                <h2>{`Fecha ${fechaActual} - ${partidos[0].torneo} ${partidos[0].año}`}</h2>
                                <CardsMatchesContainer>
                                    <CardsMatchesWrapper>
                                        {partidos
                                            .filter(
                                                (p) =>
                                                    miEquipo && p.division === miEquipo.division && p.jornada === fechaActual
                                            )
                                            .map((p) => (
                                                <CardPartido
                                                    key={p.id_partido}
                                                    rol={user.id_rol}
                                                    partido={p}
                                                />
                                            ))}
                                    </CardsMatchesWrapper>
                                </CardsMatchesContainer>
                            </>
                        ) : (
                            <p>No hay partidos disponibles.</p>
                        )}
                    </Section>
                    {posiciones && temporadaFiltrada && (
                        <Section>
                            <h2>Tabla de Posiciones</h2>
                            <TablePosiciones
                                data={posiciones}
                                temporada={temporadaFiltrada}
                                dataColumns={dataPosicionesTemporadaColumns}
                            />
                        </Section>
                    )}
                </HomeWrapper>
            </HomeContainerStyled>
            <Toaster />
        </>
    );
};

export default Home;
