import React, { useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper, HomeMediumWrapper, HomeLeftWrapper, HomeRightWrapper } from './HomeStyles';
import Section from '../../components/Section/Section';
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { getPosicionesTemporada, getSanciones, getZonas } from '../../utils/dataFetchers';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { dataPosicionesTemporadaColumns, dataPosicionesTemporadaColumnsMinus, dataSancionesColumns } from '../../components/Stats/Data/Data';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import useMessageWelcome from '../../hooks/useMessageWelcome.js';
import { StatsNull } from '../Stats/StatsStyles.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import TableSanciones from '../../components/Stats/TableSanciones/TableSanciones.jsx';
import { MenuCategoriasContainer, MenuCategoriasDivider, MenuCategoriasItem, MenuCategoriasTitulo } from '../../components/Content/ContentStyles.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { URLImages } from '../../utils/utils.js';

const Home = () => {
    const dispatch = useDispatch();
    const { userRole, idMyTeam, userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    
    useEffect(() => {
        dispatch(fetchEquipos());
    }, [dispatch]);

    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idMyTeam);
    const id_zona = miEquipo?.id_zona;

    // Custom hooks
    // useFetchMatches(filterCondition);
    useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast);
    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual } = useMatchesUser(idMyTeam);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);
    const [loading, setLoading] = useState(false);

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
            <HomeContainerStyled>
                <HomeWrapper>
                    <HomeLeftWrapper>
                        <MenuCategoriasContainer>
                        <MenuCategoriasTitulo>
                            <img src={`${URLImages}/uploads/CR/logo-clausura-2024.png`}/>
                            Clausura 2024
                        </MenuCategoriasTitulo>
                        <MenuCategoriasDivider>
                            <span>CATEGORIA LIBRE</span>
                            <div/>
                        </MenuCategoriasDivider>
                        <MenuCategoriasItem to={'/categoria/posiciones/1'}>
                            Serie A
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/2'}>
                            Serie B
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/3'}>
                            Serie C
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/4'}>
                            Serie D
                        </MenuCategoriasItem>
                        <MenuCategoriasDivider>
                            <span>CATEGORIA SUB 19</span>
                            <div/>
                        </MenuCategoriasDivider>
                        <MenuCategoriasItem to={'/categoria/posiciones/5'}>
                            Serie A
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/6'}>
                            Serie B
                        </MenuCategoriasItem>
                        <MenuCategoriasDivider>
                            <span>FEMENINO</span>
                            <div/>
                        </MenuCategoriasDivider>
                        <MenuCategoriasItem to={'/categoria/posiciones/7'}>
                            Intermedias
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/8'}>
                            Principiantes
                        </MenuCategoriasItem>
                    </MenuCategoriasContainer>
                    </HomeLeftWrapper>
                    <HomeMediumWrapper>
                        <Section>
                            <h2>{proximoPartido ? 'Próximo partido' : 'Último partido'}</h2>
                            {partidoAMostrar ? (
                                <CardPartido
                                    rol={userRole}
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
                                                        rol={userRole}
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
                    </HomeMediumWrapper>
                    <HomeRightWrapper>
                        {posiciones && zonasFiltradas ? (
                            <Section>
                                <TablePosiciones
                                    data={posiciones}
                                    zona={zonasFiltradas}
                                    dataColumns={dataPosicionesTemporadaColumnsMinus}
                                />
                            </Section>
                        ) : (
                            <SpinerContainer>
                                <TailSpin width='40' height='40' color='#2AD174' />
                            </SpinerContainer>
                        )}
                    </HomeRightWrapper>
                </HomeWrapper>
            </HomeContainerStyled>
        </>
    );
};

export default Home;
