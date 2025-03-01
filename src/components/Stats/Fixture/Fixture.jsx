import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonWrapper, FixtureMatch, FixtureMatchInfo, FixtureMatchTeam, FixtureTitle, FixtureTitleDivider, FixtureTop, FixtureWrapper, NavigateFixture } from './FixtureStyles';
import { URLImages } from '../../../utils/utils';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useEquipos } from '../../../hooks/useEquipos';

const Fixture = ({ zona, categoria }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.partidos.data);

    const [fechaActual, setFechaActual] = useState(1);
    
    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchEquipos());
            dispatch(fetchPartidos());
        };
        fetchData();
    }, [dispatch]);


    const { nombresEquipos, escudosEquipos } = useEquipos();

    // Filtra partidosTemporada y cantidadFechas después de haber cargado los datos
    const partidosTemporada = categoria !== 3 ? partidos.filter((p) => p.id_zona === zona?.id_zona) : partidos.filter((p) => p.id_categoria === zona?.id_categoria)
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
                            <ButtonWrapper>
                                {fechaActual > Math.min(...cantidadFechas) ? (
                                    <button onClick={() => handleJornada(false)}>
                                        <IoIosArrowBack/>
                                    </button>
                                ) : (
                                    <div className="placeholder" />
                                )}
                            </ButtonWrapper>
                            <h3>Fecha {fechaActual}</h3>
                            <ButtonWrapper>
                                {fechaActual < Math.max(...cantidadFechas) ? (
                                    <button onClick={() => handleJornada(true)}>
                                        <IoIosArrowForward/>
                                    </button>
                                ) : (
                                    <div className="placeholder" />
                                )}
                            </ButtonWrapper>
                        </NavigateFixture>
                    </FixtureTop>

                    <FixtureTitleDivider />
                    {partidosFecha.map((partido) => (
                        <React.Fragment key={partido.id_partido}>
                            <FixtureMatch onClick={() => handleStatsOfTheMatch(partido.id_partido)}>
                                <FixtureMatchTeam>
                                    <h4>{nombresEquipos(partido.id_equipoLocal)}</h4>
                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt="" />
                                </FixtureMatchTeam>
                                <FixtureMatchInfo>
                                {
                                    partido.estado === 'F' ? (
                                        <>
                                            <h5>{`${partido.goles_local}-${partido.goles_visita}`}</h5>
                                        </>
                                    ) : partido.estado === 'A' ? (
                                        <>
                                            <h5 className="susp">Postergado</h5>
                                        </>
                                    ) : (
                                        <>
                                            <h5>{formatHour(partido.hora)}</h5>
                                        </>
                                    )
                                }
                                </FixtureMatchInfo>
                                <FixtureMatchTeam className='visit'>
                                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt="" />
                                    <h4>{nombresEquipos(partido.id_equipoVisita)}</h4>
                                </FixtureMatchTeam>
                            </FixtureMatch>
                            {/* <FixtureTitleDivider /> */}
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
