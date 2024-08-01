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
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { URL } from '../../utils/utils';
import { TableContainerStyled, TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../../components/Stats/Table/TableStyles';
import { Column } from 'primereact/column';
import { setMatches } from '../../redux/Matches/matchesSlice';

const Home = () => {
    const ColumnasTabla = [
        {field: 'pos', header: "#"},
        {field: 'nombre', header: "Equipo"},
        {field: 'PTS', header: "PTS"},
        {field: 'PJ', header: "PJ"},
        {field: 'PG', header: "PG"},
        {field: 'PE', header: "PE"},
        {field: 'PP', header: "PP"},
        {field: 'GF', header: "GF"},
        {field: 'GC', header: "GC"},
        {field: 'DIF', header: "DIF"}
    ];

    const body = rowData => {
        if (rowData.pos === 1) {
            return <div className="pos green">
                {rowData.pos}
            </div>
        } else if ( rowData.pos > 1 && rowData.pos < 4 ) {
            return <div className="pos orange" >
                {rowData.pos}
            </div>
        } else if ( rowData.pos > 3 && rowData.pos < 7 ) {
            return <div className="pos red" >
                {rowData.pos}
            </div>
        }
    };

    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : 'team-default.png';
    };

    const equipoBodyTemplate = (rowData, field) => (
        <div className="team" style={{minWidth: '140px'}}>
            <img src={`${URL}${escudosEquipos(rowData.id_equipo)}`} alt={rowData.nombre}/>
            <span>{rowData.nombre}</span>
        </div>
    );

    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);
    const equipos = useSelector((state) => state.equipos.data);
    const jugadoresData = useSelector((state) => state.jugadores.data);
    const navigate = useNavigate();

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

    const miEquipo = equipos.find((equipo) => equipo.id_equipo === user.id_equipo);
    const id_temporada = miEquipo?.id_temporada;

    const [fechaActual, setFechaActual] = useState(null);
    const [posiciones, setPosiciones] = useState(null);

    const handleMatchClick = (idPartido) => {
        navigate(`/match-stats?id=${idPartido}`);
    };

    const getPosicionesTemporada = async () => {
        try {
            const res = await Axios.get(`${URL}/user/get-posiciones-temporada?id_temporada=${id_temporada}`);
            const data = res.data;
            setPosiciones(data);
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    useEffect(() => {
        if (id_temporada) {
            getPosicionesTemporada();
        } else {
            console.error('ID de temporada no definido');
        }
    }, [id_temporada]);

    useEffect(() => {
        if (partidos.length > 0 && miEquipo) {
            const sortedPartidos = partidos
                .filter((partido) => partido.division === miEquipo.division)
                .sort((a, b) => new Date(b.dia) - new Date(a.dia));

            const latestFecha = sortedPartidos.reduce((max, partido) => {
                return partido.jornada > max ? partido.jornada : max;
            }, 0);

            setFechaActual(latestFecha);
        }
    }, [partidos, miEquipo]);

    const partidosFecha = partidos.filter((partido) => partido.division === miEquipo?.division && partido.jornada === fechaActual);

    const proximoPartido = partidosFecha
        .filter(partido => partido.estado === 'P' && (partido.id_equipoLocal === miEquipo.id_equipo || partido.id_equipoVisita === miEquipo.id_equipo))
        .sort((a, b) => new Date(b.dia) - new Date(a.dia))[0];

    const ultimoPartido = !proximoPartido && partidosFecha
        .filter(partido => partido.estado === 'F' && (partido.id_equipoLocal === miEquipo.id_equipo || partido.id_equipoVisita === miEquipo.id_equipo))
        .sort((a, b) => new Date(b.dia) - new Date(a.dia))[0];

      // Función para comparar dos arreglos de partidos
    const areMatchesEqual = (matches1, matches2) => {
        if (matches1.length !== matches2.length) return false;
        return matches1.every((match, index) => match.ID === matches2[index].ID);
    };

    // Fetch de datos inicial
    useEffect(() => {
        dispatch(fetchPartidos());
        dispatch(fetchEquipos());
        dispatch(fetchJugadores());
    }, [dispatch]);

    // Filtrar y preparar los datos de los partidos
    useEffect(() => {
        if (partidos.length > 0 && equipos.length > 0 && jugadoresData.length > 0) {
        const partidosFiltrados = partidos

        const matchesData = partidosFiltrados.map((partido) => {
            const localEquipo = equipos.find(equipo => equipo.id_equipo === partido.id_equipoLocal);
            const visitanteEquipo = equipos.find(equipo => equipo.id_equipo === partido.id_equipoVisita);

            const localJugadores = jugadoresData.filter(jugador => jugador.id_equipo === localEquipo.id_equipo && jugador.eventual === 'N');
            const visitanteJugadores = jugadoresData.filter(jugador => jugador.id_equipo === visitanteEquipo.id_equipo && jugador.eventual === 'N');

            return {
            ID: partido.id_partido,
            matchState: null,
            descripcion: null,
            jugador_destacado: null,
            Local: {
                id_equipo: localEquipo.id_equipo,
                Nombre: localEquipo.nombre,
                Player: localJugadores.map(jugador => ({
                ID: jugador.id_jugador,
                Nombre: `${jugador.nombre} ${jugador.apellido}`,
                DNI: jugador.dni,
                Dorsal: '',
                status: false,
                sancionado: jugador.sancionado,
                eventual: jugador.eventual,
                })),
            },
            Visitante: {
                id_equipo: visitanteEquipo.id_equipo,
                Nombre: visitanteEquipo.nombre,
                Player: visitanteJugadores.map(jugador => ({
                ID: jugador.id_jugador,
                Nombre: `${jugador.nombre} ${jugador.apellido}`,
                DNI: jugador.dni,
                Dorsal: '',
                status: false,
                sancionado: jugador.sancionado,
                eventual: jugador.eventual,
                })),
            },
            };
        });

        const storedMatches = JSON.parse(localStorage.getItem('matches')) || [];

        if (!areMatchesEqual(matchesData, storedMatches)) {
            dispatch(setMatches(matchesData));
            localStorage.setItem('matches', JSON.stringify(matchesData));
        }
        }
    }, [partidos, equipos, jugadoresData, user.id_usuario, dispatch]);
    
    
    return (
        <>  
            <HomeContainerStyled className='container'>
                <HomeWrapper className='wrapper'>
                    <Section>
                        <h2>{proximoPartido ? 'Próximo partido' : 'Último partido'}</h2>
                        {proximoPartido || ultimoPartido ? (
                            <CardPartido rol={user.id_rol} partido={proximoPartido || ultimoPartido} onClick={() => handleMatchClick((proximoPartido || ultimoPartido).id_partido)} />
                        ) : (
                            <p>No hay partidos programados para tu equipo.</p>
                        )}
                    </Section>
                    <Section>
                        {partidosFecha.length > 0 ? (
                            <>
                                <h2>{`Fecha ${fechaActual} - ${partidosFecha[0].torneo} ${partidosFecha[0].año}`}</h2>
                                <CardsMatchesContainer>
                                    <CardsMatchesWrapper>
                                    {
                                        partidosFecha.map((p) => (
                                            <CardPartido key={p.id_partido} rol={user.id_rol} partido={p} onClick={() => handleMatchClick(p.id_partido)} />
                                        ))
                                    }
                                    </CardsMatchesWrapper>
                                </CardsMatchesContainer>
                            </>
                        ) : (
                            <p>No hay partidos programados para esta fecha.</p>
                        )}
                    </Section>
                    <Section>
                        <h2>Posiciones</h2>
                        <TableContainerStyled>
                            <TableTitle>
                                <h3>Torneo Apertura</h3>
                                <p>Serie A</p>
                            </TableTitle>
                            <TableTitleDivider/>
                            <TableWrapper
                                    value={posiciones}
                                    emptyMessage="No hay datos disponibles"
                                >
                                    {ColumnasTabla.map((col) => (
                                    <Column
                                        key={col.field}
                                        field={col.field}
                                        header={col.header}
                                        sortable
                                        style={{ width: 'auto' }}
                                        body={
                                            col.field === 'pos'
                                            ? body
                                            : col.field === 'nombre'
                                            ? equipoBodyTemplate
                                            : null
                                        }
                                    />
                                ))}
                            </TableWrapper>
                            <TableTitleDivider/>
                            <TableFoot>
                                <TableFootItem>
                                    <div className='one'></div>
                                    <h3>Copa Oro</h3>
                                </TableFootItem>
                                <TableFootItem>
                                    <div className='two'></div>
                                    <h3>Copa Plata</h3>
                                </TableFootItem>
                                <TableFootItem>
                                    <div className='three'></div>
                                    <h3>Copa Bronce</h3>
                                </TableFootItem>
                            </TableFoot>
                        </TableContainerStyled>
                    </Section>
                </HomeWrapper>
                <Toaster/>
            </HomeContainerStyled>
        </>
    );
}

export default Home;
