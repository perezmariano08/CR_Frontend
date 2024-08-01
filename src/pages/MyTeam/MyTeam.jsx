import React, { useEffect, useState } from 'react'
import { MyTeamTitleContainer, MyTeamInfo, MyTeamName, MyTeamContainerStyled, MyTeamWrapper, MyTeamMatches, MyTeamMatchesItem, MyTeamMatchesDivisor } from './MyTeamStyles'
import Section from '../../components/Section/Section'
import Table from '../../components/Stats/Table/Table'
import CardOldMatches from '../../components/Stats/CardOldMatches/CardOldMatches'
import { TableContainerStyled, TableFoot, TableFootItem, TableTitle, TableTitleDivider, TableWrapper } from '../../components/Stats/Table/TableStyles';
import { Column } from 'primereact/column';
import { useAuth } from '../../Auth/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice'
import { fetchPartidos } from '../../redux/ServicesApi/partidosSlice'
import { fetchJugadores } from '../../redux/ServicesApi/jugadoresSlice'
import { URL } from '../../utils/utils'
import Axios from 'axios'

const MyTeam = () => {

    const ColumnasTabla = [
        {field: 'nombre_completo', header: "#"},
        {field: 'PJ', header: "PJ"},
        {field: 'G', header: "Goles"},
        {field: 'A', header: "Asistencias"},
        {field: 'Am', header: "Amarillas"},
        {field: 'R', header: "Rojas"},

    ]

    const { user } = useAuth();
    const dispatch = useDispatch();
    const equipos = useSelector((state) => state.equipos.data);
    const partidos = useSelector((state) => state.partidos.data);
    const jugadoresData = useSelector((state) => state.jugadores.data);
    
    const miEquipo = equipos.find((equipo) => equipo.id_equipo === user.id_equipo);
    const jugadores = jugadoresData.filter((jugador) => jugador.id_equipo === miEquipo.id_equipo);

    const partidosMiEquipo = partidos.filter((p) => {
        const esMiEquipo = p.id_equipoLocal === miEquipo.id_equipo || p.id_equipoVisita === miEquipo.id_equipo;
        const estadoValido = p.estado.trim() === 'F';
        return esMiEquipo && estadoValido;
    });

    const [cantVictorias, setCantVictorias] = useState(0);
    const [cantEmpates, setCantEmpates] = useState(0);
    const [cantDerrotas, setCantDerrotas] = useState(0);

    useEffect(() => {
        let victorias = 0;
        let empates = 0;
        let derrotas = 0;

        partidosMiEquipo.forEach(partido => {
            const esLocal = partido.id_equipoLocal === miEquipo.id_equipo;
            const golesLocal = esLocal ? partido.goles_local : partido.goles_visita;
            const golesVisitante = esLocal ? partido.goles_visita : partido.goles_local;

            if (golesLocal > golesVisitante) {
                victorias++;
            } else if (golesLocal < golesVisitante) {
                derrotas++;
            } else {
                empates++;
            }
        });

        setCantVictorias(victorias);
        setCantEmpates(empates);
        setCantDerrotas(derrotas);

    }, [partidosMiEquipo, miEquipo]);

    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchPartidos());
        dispatch(fetchJugadores());
    }, [dispatch]);

    const [bdJugadores, setBdJugadores] = useState(null);
    const id_equipo = miEquipo.id_equipo;
    const id_temporada = miEquipo.id_temporada;
    const getJugadoresEquipo = async () => {
        try {
            const res = await Axios.get(`${URL}/user/get-jugadores-equipo?id_temporada=${id_temporada}&id_equipo=${id_equipo}`)
            const data = res.data;
            setBdJugadores(data);
        } catch (error) {
            console.error('Error en la peticion', error);
        }
    }

    useEffect(() => {
        if (id_equipo) {
            getJugadoresEquipo();
        } else {
            console.error('ID de equipo no definido');
        }
    }, [id_equipo]);

    console.log(bdJugadores);

    return (
        <>
        <MyTeamTitleContainer>
            <MyTeamInfo>
                <img src={`${URL}${miEquipo.img}`} alt="" />
                <MyTeamName>
                    <h2>{miEquipo.nombre}</h2>
                    <h3>{miEquipo.division}</h3>
                </MyTeamName>
            </MyTeamInfo>
        </MyTeamTitleContainer>
        <MyTeamContainerStyled className='container'>
            <MyTeamWrapper className='wrapper'>
                <Section>
                    <h2>Partidos</h2>
                    <MyTeamMatches>
                        <MyTeamMatchesItem className='pj'>
                            <h4>{partidosMiEquipo.length}</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PJ</h5>
                        </MyTeamMatchesItem>
                        <MyTeamMatchesItem className='pg'>
                            <h4>{cantVictorias}</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PG</h5>
                        </MyTeamMatchesItem>
                        <MyTeamMatchesItem className='pp'>
                            <h4>{cantDerrotas}</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PP</h5>
                        </MyTeamMatchesItem>
                        <MyTeamMatchesItem className='pe'>
                            <h4>{cantEmpates}</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PE</h5>
                        </MyTeamMatchesItem>
                    </MyTeamMatches>
                </Section>

                <Section>
                    <h2>Plantel</h2>

                    {/* <TableTeam jugadores={jugadores} equipo={miEquipo}/> */}
                    <TableContainerStyled>
                        <TableTitle>
                            <h3>Torneo Apertura</h3>
                            <p>Serie A</p>
                        </TableTitle>
                        <TableTitleDivider/>
                        <TableWrapper
                                value={bdJugadores}
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
                                <h3>Descenso</h3>
                            </TableFootItem>        
                        </TableFoot>
                    </TableContainerStyled>

                </Section>
                    
                <Section>
                    <h2>Posiciones</h2>
                    <Table/>
                </Section>

                <Section>
                    <CardOldMatches partidos={partidosMiEquipo} equipo={miEquipo}/>
                </Section>

            </MyTeamWrapper>
        </MyTeamContainerStyled>
        </>
    );
}

export default MyTeam
