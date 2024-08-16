import React from 'react'
import { HistoryMatchesContainer, HistoryMatchesWrapper, HistoryStatsContainer, HistoryStatsWrapper, HistoryTop, InfoStats, StatsHistory } from './HistoryBeetwenTeamsStyles'
import { AlignmentDivider } from '../Alignment/AlignmentStyles'
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';
import { URLImages } from '../../../utils/utils';
import { calcularEstadisticas } from './helper';

const HistoryBeetwenTeams = ({ partidosEntreEquipos, idLocal, idVisita }) => {

    const ids = [idLocal, idVisita];
    const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams(ids);

    const estadisticas = calcularEstadisticas(partidosEntreEquipos);

    return (
        <HistoryMatchesWrapper>
                <HistoryTop>
                    <img src={`${URLImages}/${getEscudoEquipo(idLocal)}`} alt={getNombreEquipo(idLocal)} />
                    <h3>Historial</h3>
                    <img src={`${URLImages}/${getEscudoEquipo(idVisita)}`} alt={getNombreEquipo(idVisita)} />
                </HistoryTop>
            <AlignmentDivider />
            <HistoryMatchesContainer>
                <HistoryStatsWrapper>
                    <HistoryStatsContainer>
                        <StatsHistory>
                            {estadisticas.victoriasLocal}
                        </StatsHistory>
                        <InfoStats>
                            <h2>Victorias</h2>
                            <p>{estadisticas.porcentajeVictoriasLocal}%</p>
                        </InfoStats>
                    </HistoryStatsContainer>

                    <HistoryStatsContainer>
                        <StatsHistory>
                            {estadisticas.empates}
                        </StatsHistory>
                        <InfoStats>
                            <h2>Empates</h2>
                            <p>{estadisticas.porcentajeEmpates}%</p>
                        </InfoStats>
                    </HistoryStatsContainer>

                    <HistoryStatsContainer>
                        <StatsHistory>
                            {estadisticas.victoriasVisita}
                        </StatsHistory>
                        <InfoStats>
                            <h2>Victorias</h2>
                            <p>{estadisticas.porcentajeVictoriasVisita}%</p>
                        </InfoStats>
                    </HistoryStatsContainer>

                </HistoryStatsWrapper>
            </HistoryMatchesContainer>
        </HistoryMatchesWrapper>
    )
}

export default HistoryBeetwenTeams
