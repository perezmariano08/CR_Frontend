import React from 'react';
import { FixtureMatch, FixtureMatchInfo, FixtureMatchTeam, FixtureTitle, FixtureWrapper } from './FixtureStyles';
import { TableTitleDivider } from '../Table/TableStyles';
import { useSelector } from 'react-redux';

const Fixture = ({ temporada }) => {
    const equipos = useSelector((state) => state.equipos.data);
    const partidos = useSelector((state) => state.partidos.data);
    const partidosTemporada = partidos.filter((p) => p.id_temporada === temporada);

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

    const escudoEquipo = (id) => {
        const equipoEncontrado = equipos.find(equipo => equipo.id_equipo === id);
        return equipoEncontrado?.img || '';
    };

    const nombreEquipo = (id) => {
        const equipoEncontrado = equipos.find(equipo => equipo.id_equipo === id);
        return equipoEncontrado?.nombre || '';
    };


    return (
        <FixtureWrapper>
            {partidosTemporada.length > 0 && (
                <>
                    <FixtureTitle>
                        <h3>{formatDate(partidosTemporada[0])}</h3>
                        <p>Fecha {partidosTemporada[0].jornada}</p>
                    </FixtureTitle>
                    <TableTitleDivider />
                    {partidosTemporada.map((partido) => (
                        <React.Fragment key={partido.id_partido}>
                            <FixtureMatch>
                                <FixtureMatchTeam>
                                    <img src={`/Escudos/${escudoEquipo(partido.id_equipoLocal)}`} alt="" />
                                    <h4>{nombreEquipo(partido.id_equipoLocal)}</h4>
                                </FixtureMatchTeam>
                                <FixtureMatchInfo>
                                    <h5>{formatHour(partido.hora)}</h5>
                                    <p>Cancha {partido.cancha}</p>
                                </FixtureMatchInfo>
                                <FixtureMatchTeam className='visit'>
                                    <h4>{nombreEquipo(partido.id_equipoVisita)}</h4>
                                    <img src={`/Escudos/${escudoEquipo(partido.id_equipoVisita)}`} alt="" />
                                </FixtureMatchTeam>
                            </FixtureMatch>
                            <TableTitleDivider />
                        </React.Fragment>
                    ))}
                </>
            )}
        </FixtureWrapper>
    );
};

export default Fixture;
