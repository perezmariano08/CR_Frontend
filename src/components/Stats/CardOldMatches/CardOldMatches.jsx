import React from 'react';
import { 
    CardOldMatchesItem, 
    CardOldMatchesWrapper, 
    MatchesItemDescription, 
    MatchesItemResult, 
    MatchesItemTeam, 
    MatchesItemTeams 
} from './CardOldMatchesStyles';
import { AlignmentDivider } from '../Alignment/AlignmentStyles';
import { useSelector } from 'react-redux';
import { URLImages } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';


const CardOldMatches = ({ partidos, equipo }) => {
    const navigate = useNavigate();
    
    const viewToStatsMatch = (id) => {
        navigate(`/stats-match?id=${id}`)
    }
    
    const determineColor = (golesLocal, golesVisitante) => {
        if (golesLocal > golesVisitante) {
            return 'var(--green)';
        } else if (golesLocal === golesVisitante) {
            return 'var(--gray-200)';
        } else {
            return 'var(--red)';
        }
    }
    const equipos = useSelector((state) => state.equipos.data);

    const getEquipoData = (id) => {
        return equipos.find((e) => e.id_equipo === id) || { nombre: 'Desconocido', img: 'default.png' };
    }


    return (
        <CardOldMatchesWrapper>
            <h3>Últimos partidos</h3>
            <AlignmentDivider />
            {
                partidos.length === 0 ? (
                    <div>No hay partidos disponibles</div>
                ) : (
                    partidos.map((partido) => {
                        // Verifica si el equipo es el local
                        const esLocal = partido.id_equipoLocal === equipo.id_equipo;

                        // Si no es local, intercambia los datos
                        const equipoLocal = esLocal ? partido.id_equipoLocal : partido.id_equipoVisita;
                        const equipoVisitante = esLocal ? partido.id_equipoVisita : partido.id_equipoLocal;
                        const golesLocal = esLocal ? partido.goles_local : partido.goles_visita;
                        const golesVisitante = esLocal ? partido.goles_visita : partido.goles_local;

                        const colorResultado = determineColor(golesLocal, golesVisitante);

                        const equipoLocalData = getEquipoData(equipoLocal);
                        const equipoVisitanteData = getEquipoData(equipoVisitante);

                        return (
                            <React.Fragment key={partido.id_partido}>
                                <CardOldMatchesItem onClick={() => viewToStatsMatch(partido.id_partido)}>
                                    <MatchesItemDescription>
                                        <p>{`${partido.dia_nombre} ${partido.dia_numero} / ${partido.mes}`}</p>
                                        <p className='fecha'>{`Fecha ${partido.jornada} ${partido.nombre_edicion}`}</p>
                                    </MatchesItemDescription>
                                    <MatchesItemTeams>
                                        <MatchesItemTeam>
                                            <p>{equipoLocalData.nombre}</p>
                                            <img src={`${URLImages}${equipoLocalData.img}`} alt="Escudo del equipo local" />
                                        </MatchesItemTeam>
                                        <MatchesItemResult style={{ backgroundColor: colorResultado }}>
                                            {`${golesLocal}-${golesVisitante}`}
                                        </MatchesItemResult>
                                        <MatchesItemTeam className='visit'>
                                            <img src={`${URLImages}${equipoVisitanteData.img}`} alt="Escudo del equipo visitante" />
                                            <p>{equipoVisitanteData.nombre}</p>
                                        </MatchesItemTeam>
                                    </MatchesItemTeams>
                                </CardOldMatchesItem>
                                <AlignmentDivider />
                            </React.Fragment>
                        );
                    })
                )
            }
        </CardOldMatchesWrapper>
    );
}

export default CardOldMatches;
