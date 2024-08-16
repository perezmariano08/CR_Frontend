import React from 'react';
import { LocalContainer, OldMatchContainer, OldMatchResultContainer, StatsOldMatchesContainer, StatsOldMatchesWrapper, VisitaContainer } from './StatsOldMatchesStyles';
import { AlignmentDivider } from '../Alignment/AlignmentStyles';
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';
import { URLImages } from '../../../utils/utils';
import { getResultColor, resultOfTheMatch } from './helper';
import { useNavigate } from 'react-router-dom';

const StatsOldMatches = ({ partidosPorEquipo, idLocal, idVisita }) => {
    const navigate = useNavigate();

    const partidosLocal = partidosPorEquipo.local;
    const partidosVisita = partidosPorEquipo.visita;
    const ids = [idLocal, idVisita];

    const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams(ids);
    
    const viewToStatsMatch = (id) => {
        navigate(`/stats-match?id=${id}`)
    }

    return (
        <StatsOldMatchesWrapper>
            <h3>Últimos partidos</h3>
            <AlignmentDivider />
            <StatsOldMatchesContainer>
                <LocalContainer>
                    {
                        partidosLocal.map((p) => {
                            const result = resultOfTheMatch(p, idLocal);
                            return (
                                <OldMatchContainer key={p.id_partido} onClick={() => viewToStatsMatch(p.id_partido)}>
                                    <img src={`${URLImages}/${getEscudoEquipo(p.id_equipoLocal)}`} alt={getNombreEquipo(p.id_equipoLocal)} />
                                    <OldMatchResultContainer style={{ backgroundColor: getResultColor(result) }}>
                                        {p.goles_local} - {p.goles_visita}
                                    </OldMatchResultContainer>
                                    <img src={`${URLImages}/${getEscudoEquipo(p.id_equipoVisita)}`} alt={getNombreEquipo(p.id_equipoVisita)} />
                                </OldMatchContainer>
                            );
                        })
                    }
                </LocalContainer>
                <VisitaContainer>
                    {
                        partidosVisita.map((p) => {
                            const result = resultOfTheMatch(p, idVisita);
                            return (
                                <OldMatchContainer key={p.id_partido} onClick={() => viewToStatsMatch(p.id_partido)}>
                                    <img src={`${URLImages}/${getEscudoEquipo(p.id_equipoLocal)}`} alt={getNombreEquipo(p.id_equipoLocal)} />
                                    <OldMatchResultContainer style={{ backgroundColor: getResultColor(result) }}>
                                        {p.goles_local} - {p.goles_visita}
                                    </OldMatchResultContainer>
                                    <img src={`${URLImages}/${getEscudoEquipo(p.id_equipoVisita)}`} alt={getNombreEquipo(p.id_equipoVisita)} />
                                </OldMatchContainer>
                            );
                        })
                    }
                </VisitaContainer>
            </StatsOldMatchesContainer>
        </StatsOldMatchesWrapper>
    );
};

export default StatsOldMatches;