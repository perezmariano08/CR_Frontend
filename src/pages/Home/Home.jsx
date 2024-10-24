import React, { useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper, HomeMediumWrapper, HomeLeftWrapper, HomeRightWrapper, CategoriasListaWrapper, CategoriasListaTitulo, CategoriasItem, CategoriasItemsWrapper } from './HomeStyles';
import Section from '../../components/Section/Section';
import { useDispatch, useSelector } from 'react-redux';
import { getPosicionesTemporada, getSanciones, getZonas, traerNovedades } from '../../utils/dataFetchers';
import TablePosiciones from '../../components/Stats/TablePosiciones/TablePosiciones.jsx';
import { dataPosicionesTemporadaColumns, dataPosicionesTemporadaColumnsMinus, dataSancionesColumns } from '../../components/Stats/Data/Data';
import useMatchesUser from '../../hooks/useMatchesUser.js';
import { StatsNull } from '../Stats/StatsStyles.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import { fetchCategorias } from '../../redux/ServicesApi/categoriasSlice.js';
import { fetchEdiciones } from '../../redux/ServicesApi/edicionesSlice.js';
import TableSanciones from '../../components/Stats/TableSanciones/TableSanciones.jsx';
import { MenuCategoriasContainer, MenuCategoriasDivider, MenuCategoriasItem, MenuCategoriasTitulo } from '../../components/Content/ContentStyles.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { URLImages } from '../../utils/utils.js';
import TablaPosicionesRoutes from '../../components/Stats/TablePosiciones/TablaPosicionesRoutes';

const Home = () => {
    const dispatch = useDispatch();
    const idMyTeam = useSelector((state) => state.newUser.equipoSeleccionado)
    const userRole = 3
    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchCategorias());
        dispatch(fetchEdiciones());
    }, [dispatch]);

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    console.log(ediciones);
    
    const categoriasFiltradas = categorias.filter((c) => c.id_edicion === 1)
    
    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idMyTeam);
    const id_zona = miEquipo?.id_zona;

    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual, partidoEnDirecto, ultimoPartido } = useMatchesUser(idMyTeam);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id_zona) {
            getPosicionesTemporada(id_zona)
                .then((data) => {
                    setPosiciones(data);
                })
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [id_zona]);

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

    let tituloPartido = '';
    if (partidoEnDirecto) {
        tituloPartido = 'En directo';
    } else if (proximoPartido) {
        tituloPartido = 'Próximo Partido';
    } else if (ultimoPartido) {
        tituloPartido = 'Último Partido';
    } else {
        tituloPartido = 'No hay partidos programados';
    }

    return (
        <>
            <HomeContainerStyled>
                <HomeWrapper>
                    <HomeLeftWrapper>
                        <CategoriasListaWrapper>
                            <CategoriasListaTitulo>
                                {
                                    ediciones.filter((e) => e.id_edicion === 1).map((edicion) => {
                                        return <p>{edicion.nombre} {edicion.temporada}</p>
                                    })
                                }
                                <span>masculino</span>
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                {
                                    categorias.filter((c) => c.id_edicion === 1).map((c) => {
                                        return <CategoriasItem to={`/categoria/posiciones/${c.id_categoria}`}>
                                            {c.nombre}
                                        </CategoriasItem>
                                    })
                                }
                            </CategoriasItemsWrapper>
                        </CategoriasListaWrapper>
                        <CategoriasListaWrapper>
                            <CategoriasListaTitulo>
                                {
                                    ediciones.filter((e) => e.id_edicion === 2).map((edicion) => {
                                        return <p>{edicion.nombre} {edicion.temporada}</p>
                                    })
                                }
                                <span>femenino</span>
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                {
                                    categorias.filter((c) => c.id_edicion === 2).map((c) => {
                                        return <CategoriasItem to={`/categoria/posiciones/${c.id_categoria}`}>
                                            {c.nombre}
                                        </CategoriasItem>
                                    })
                                }
                            </CategoriasItemsWrapper>
                        </CategoriasListaWrapper>
                    </HomeLeftWrapper>
                    <HomeMediumWrapper>
                        <Section>
                            <h2>{tituloPartido}</h2>
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
                                <CategoriasListaWrapper>
                                    <CategoriasListaTitulo>
                                        <p>Serie A - Libre</p>
                                        <span>Liguilla</span>
                                    </CategoriasListaTitulo>
                                    <TablaPosicionesRoutes
                                        data={posiciones}
                                        id_categoria={2}
                                        // zona={zonasFiltradas}
                                        dataColumns={dataPosicionesTemporadaColumnsMinus}
                                    />
                                </CategoriasListaWrapper>
                                
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
