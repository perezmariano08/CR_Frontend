import React, { useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper, HomeMediumWrapper, HomeLeftWrapper, HomeRightWrapper, CircleLive, CategoriasListaWrapper, CategoriasListaTitulo, CategoriasItem, CategoriasItemsWrapper } from './HomeStyles';
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
import DreamteamUser from '../User/Dreamteam/DreamteamUser.jsx';
import { Carousel } from 'primereact/carousel';
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
    
    const equipos = useSelector((state) => state.equipos.data);
    const miEquipo = equipos?.find((equipo) => equipo.id_equipo === idMyTeam);
    const id_zona = miEquipo?.id_zona;

    const { partidoAMostrar, partidosFecha, proximoPartido, fechaActual, partidoEnDirecto, ultimoPartido, zonaActual } = useMatchesUser(idMyTeam);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [sanciones, setSanciones] = useState(null);

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

    const tituloCategoria = (id_zona) => {

        const id_categoria = zonas.find((zona) => zona.id_zona === id_zona).id_categoria;
        const nombreCategoria = categorias.find((categoria) => categoria.id_categoria == id_categoria).nombre;

        return nombreCategoria ? nombreCategoria : '';
    }

    const nombreZona = (id_zona) => {
        const zona = zonas.find((zona) => zona.id_zona === id_zona);
        return zona ? zona.nombre_zona : '';
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
                        {ediciones.map((edicion) => (
                            <CategoriasListaWrapper key={edicion.id_edicion}>
                            <CategoriasListaTitulo>
                                <p>{edicion.nombre} {edicion.temporada}</p>
                            </CategoriasListaTitulo>
                            <CategoriasItemsWrapper>
                                {categorias
                                .filter(
                                    (categoria) =>
                                    categoria.id_edicion === edicion.id_edicion &&
                                    categoria.publicada === "S"
                                )
                                .map((categoria) => (
                                    <CategoriasItem 
                                    key={categoria.id_categoria} 
                                    to={`/categoria/posiciones/${categoria.id_categoria}`}
                                    >
                                    {categoria.nombre}
                                    </CategoriasItem>
                                ))}
                            </CategoriasItemsWrapper>
                            </CategoriasListaWrapper>
                        ))}
                </HomeLeftWrapper>
                <HomeMediumWrapper>
                    <Section>
                        <h2>{tituloPartido} {tituloPartido === 'En directo' && (<CircleLive/>)}</h2>
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
                                <h2>{
                                    zonaActual.tipo_zona === 'todos-contra-todos'
                                        ? `Fecha ${fechaActual} - ${partidosFecha[0]?.nombre_categoria}`
                                        : `${zonaActual.nombre_zona} - ${partidosFecha[0]?.nombre_categoria}`
                                    }

                                </h2>
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
                                    <p>{tituloCategoria(id_zona)}</p>
                                    <span>{nombreZona(id_zona)}</span>
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
                    <DreamteamUser fecha={fechaActual} id_categoria={partidoAMostrar?.id_categoria} zona={zonasFiltradas}/>
                </HomeRightWrapper>
                </HomeWrapper>
            </HomeContainerStyled>
        </>
    );
};

export default Home;
