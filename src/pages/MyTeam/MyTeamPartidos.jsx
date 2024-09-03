import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { URLImages } from '../../utils/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { getJugadoresEquipo, getPosicionesTemporada, getZonas } from '../../utils/dataFetchers.js';
import useStatsTeam from '../../hooks/useStatsTeam.js';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice.js';
import { SpinerContainer } from '../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { useEquipos } from '../../hooks/useEquipos.js';
import { ContentMenuLink, ContentUserContainer, ContentUserMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, TituloContainer, TituloText } from '../../components/Content/ContentStyles.js';
import useMatchesUser from '../../hooks/useMatchesUser.js';

const MyTeamPartidos = () => {

    const { user } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();

    const equipos = useSelector((state) => state.equipos.data);

    const searchParams = new URLSearchParams(location.search);
    const equipoIdFromParams = parseInt(searchParams.get('idEquipo'));

    const equipoId = equipoIdFromParams || user.id_equipo;

    const miEquipo = useMemo(() => equipos.find((equipo) => equipo.id_equipo === equipoId), [equipos, equipoId]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [equipoId]);

    // Custom hook para calcular estadisticas del equipo
    const { cantVictorias, cantEmpates, cantDerrotas, partidosMiEquipo } = useStatsTeam(equipoId);

    const [bdJugadores, setBdJugadores] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [posiciones, setPosiciones] = useState(null);
    const [loading, setLoading] = useState(true);

    const id_zona = miEquipo?.id_zona;
    const { escudosEquipos } = useEquipos();

    useEffect(() => {
        // Función para obtener datos
        const fetchData = async () => {
            try {
                const [jugadoresData, temporadasData, posicionesData] = await Promise.all([
                    getJugadoresEquipo(id_zona, equipoId),
                    getZonas(),
                    getPosicionesTemporada(id_zona)
                ]);

                setBdJugadores(jugadoresData);
                setZonas(temporadasData);
                setPosiciones(posicionesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (equipoId && id_zona) {
            fetchData();
        }
    }, [equipoId, id_zona]);

    useEffect(() => {
        if (equipos.length === 0) {
            dispatch(fetchEquipos());
        }
    }, [dispatch, equipos.length]);

    const zonaFiltrada = useMemo(() => 
        zonas.find((z) => z.id_zona === id_zona), 
        [zonas, id_zona]
    );

    const {partidoAMostrar, proximoPartido} = useMatchesUser(miEquipo.id_equipo);

    if (!miEquipo) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }


  return (
    <ContentUserContainer>
        <ContentUserWrapper>
            <ContentUserTituloContainerStyled>
                    <ContentUserTituloContainer>
                        <TituloContainer>
                            <img src={`${URLImages}${escudosEquipos(miEquipo.id_equipo)}`}/>
                            <TituloText>
                                <h1>{miEquipo?.nombre}</h1>
                                <p>{`${zonaFiltrada?.nombre_zona}`}</p>
                            </TituloText>
                        </TituloContainer>
                    </ContentUserTituloContainer>
                    <ContentUserMenuTitulo>
                    <ContentMenuLink>
                        <NavLink to={`/my-team`}>
                            Resumen
                        </NavLink>
                        {/* <NavLink to={`/my-team/partidos`}>
                            Partidos
                        </NavLink> */}
                        </ContentMenuLink>
                    </ContentUserMenuTitulo>
            </ContentUserTituloContainerStyled>

    </ContentUserWrapper>
</ContentUserContainer>
  )
}

export default MyTeamPartidos