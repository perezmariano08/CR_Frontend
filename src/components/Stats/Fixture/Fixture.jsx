import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixtureMatch, FixtureMatchInfo, FixtureMatchTeam, FixtureTitle, FixtureTop, FixtureWrapper, NavigateFixture } from './FixtureStyles';
import { TableTitleDivider } from '../Table/TableStyles';
import { URL } from '../../../utils/utils';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';
import { useNavigate } from 'react-router-dom';

const Fixture = ({ temporada }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);

    const [fechaActual, setFechaActual] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchEquipos());
            await dispatch(fetchPartidos());
        };
        fetchData();
    }, [dispatch]);

    // Extraccion de ids para el hook
    const teamIds = [
        ...new Set(partidos.map(p => [p.id_equipoLocal, p.id_equipoVisita]).flat())
    ];

    const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams(teamIds);

    // Filtra partidosTemporada y cantidadFechas después de haber cargado los datos
    const partidosTemporada = partidos.filter((p) => p.id_temporada == temporada);
    const cantidadFechas = [...new Set(partidosTemporada.map((p) => p.jornada))].sort((a, b) => a - b);
    const partidosFecha = partidosTemporada.filter((p) => p.jornada === fechaActual);

    const handleJornada = (accion) => {
        setFechaActual((prev) => (accion ? prev + 1 : prev - 1));
    };

    const formatDate = (partido) => {
        const diaNombre = partido.dia_nombre;
        const diaNumero = partido.dia_numero;
        const mes = partido.mes;
        const año = partido.año;
        return `${diaNombre} - ${diaNumero}/${mes}/${año}`;
    };

    const formatHour = (hora) => {
        if (!hora || !hora.includes(':')) return 'Hora inválida';
        const [horaParte, minutoParte] = hora.split(':');
        return `${horaParte}:${minutoParte}`;
    };
    
    const handleStatsOfTheMatch = (id) => {
        navigate(`/stats-match?id=${id}`);
    }

    return (
        <FixtureWrapper>
            {partidosTemporada.length > 0 ? (
                <>
                    <FixtureTop>
                        <FixtureTitle>
                            <h3>{formatDate(partidosTemporada.find(p => p.jornada === fechaActual) || {})}</h3>
                            <p>Fecha {fechaActual}</p>
                        </FixtureTitle>
                        <NavigateFixture>
                            {fechaActual > Math.min(...cantidadFechas) && (
                                <button onClick={() => handleJornada(false)}>
                                    <IoIosArrowBack/>
                                </button>
                            )}
                            <h3>{fechaActual}</h3>
                            {fechaActual < Math.max(...cantidadFechas) && (
                                <button onClick={() => handleJornada(true)}>
                                    <IoIosArrowForward/>
                                </button>
                            )}
                        </NavigateFixture>
                    </FixtureTop>

                    <TableTitleDivider />
                    {partidosFecha.map((partido) => (
                        <React.Fragment key={partido.id_partido}>
                            <FixtureMatch onClick={() => handleStatsOfTheMatch(partido.id_partido)}>
                                <FixtureMatchTeam>
                                    <img src={`${URL}${getEscudoEquipo(partido.id_equipoLocal)}`} alt="" />
                                    <h4>{getNombreEquipo(partido.id_equipoLocal)}</h4>
                                </FixtureMatchTeam>
                                <FixtureMatchInfo>
                                {
                                    partido.estado === 'F' ? (
                                        <>
                                            <p>Resultado final</p>
                                            <h5>{`${partido.goles_local}-${partido.goles_visita}`}</h5>
                                        </>
                                    ) : (
                                        <>
                                            <h5>{formatHour(partido.hora)}</h5>
                                            <p>{partido.cancha}</p>
                                        </>
                                    )
                                }
                                </FixtureMatchInfo>
                                <FixtureMatchTeam className='visit'>
                                    <h4>{getNombreEquipo(partido.id_equipoVisita)}</h4>
                                    <img src={`${URL}${getEscudoEquipo(partido.id_equipoVisita)}`} alt="" />
                                </FixtureMatchTeam>
                            </FixtureMatch>
                            <TableTitleDivider />
                        </React.Fragment>
                    ))}
                </>
            ) : (
                <p>No hay datos disponibles.</p>
            )}
        </FixtureWrapper>
    );
};

export default Fixture;
