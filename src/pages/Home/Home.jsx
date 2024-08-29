import React, { useCallback, useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper } from './HomeStyles';
import Section from '../../components/Section/Section';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { getPosicionesTemporada, getSanciones, getZonas } from '../../utils/dataFetchers';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { dataPosicionesTemporadaColumns, dataSancionesColumns } from '../../components/Stats/Data/Data';
import useFetchMatches from '../../hooks/useFetchMatches';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import useMessageWelcome from '../../hooks/useMessageWelcome.js';
import { StatsNull } from '../Stats/StatsStyles.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import TableSanciones from '../../components/Stats/TableSanciones/TableSanciones.jsx';

const Home = () => {
    const dispatch = useDispatch();
    const { user, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    
    useEffect(() => {
        dispatch(fetchEquipos());
    }, [dispatch]);

    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === user?.id_equipo);
    const id_zona = miEquipo?.id_zona;

    const filterCondition = useCallback(
        (partido) => miEquipo && partido.division === miEquipo.division,
        [miEquipo]
    );

    // Custom hooks
    // useFetchMatches(filterCondition);
    useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast);
    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual } = useMatchesUser(user.id_equipo);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);

    // Fetch information about zonas
    useEffect(() => {
        if (miEquipo && id_zona) {
            getPosicionesTemporada(id_zona)
                .then((data) => setPosiciones(data))
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [id_zona, miEquipo]);

    useEffect(() => {
        getZonas()
            .then((data) => setZonas(data))
            .catch((error) => console.error('Error fetching zonas:', error));

        getSanciones()
            .then((data) => sancionesActivas(data))
            .catch((error) => console.error('Error fetching sanciones:', error));
    }, []);

    const zonasFiltradas = zonas.find((z) => z.id_zona === id_zona);

    const sancionesActivas = (sanciones) => {
        const sancionesFiltradas = sanciones.filter(s => s.fechas_restantes > 0)
        setSanciones(sancionesFiltradas);
    }
    
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
                            <StatsNull>
                                <p>No hay partidos programados para tu equipo.</p>
                            </StatsNull>
                        )}
                    </Section>
                    <Section>
                        {fechaActual && partidosFecha.length > 0 ? (
                            <>
                                <h2>{`Fecha ${fechaActual} - ${partidosFecha[0]?.nombre_categoria}`}</h2>
                                <CardsMatchesContainer>
                                    <CardsMatchesWrapper>
                                        {partidosFecha
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
                            <StatsNull>
                                <p>No hay partidos disponibles para esta fecha.</p>
                            </StatsNull>
                        )}
                    </Section>
                    {posiciones && zonasFiltradas && (
                        <Section>
                            <h2>Tabla de Posiciones</h2>
                            <TablePosiciones
                                data={posiciones}
                                zona={zonasFiltradas}
                                dataColumns={dataPosicionesTemporadaColumns}
                            />
                        </Section>
                    )}
                    {sanciones && (
                        <Section>
                            <h2>Sanciones</h2>
                            <TableSanciones
                                data={sanciones}
                                dataColumns={dataSancionesColumns}
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
