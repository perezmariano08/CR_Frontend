import React from 'react'
import { HistoryMatchesContainer, HistoryMatchesWrapper, HistoryStatsContainer, HistoryStatsWrapper, HistoryTop, InfoStats, StatsHistory } from './HistoryBeetwenTeamsStyles'
import { AlignmentDivider } from '../Alignment/AlignmentStyles'
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';
import { URLImages } from '../../../utils/utils';
import { calcularEstadisticas } from './helper';
import { useEquipos } from '../../../hooks/useEquipos';

const HistoryBeetwenTeams = ({ partidosEntreEquipos, id_partido }) => {

    const { nombresEquipos, escudosEquipos } = useEquipos();
    const partidoActual = partidosEntreEquipos.find(p => p.id_partido === id_partido)
    const estadisticas = calcularEstadisticas(partidosEntreEquipos, partidoActual?.id_equipoLocal, partidoActual?.id_equipoVisita);

    return (
        <HistoryMatchesWrapper>
                <HistoryTop>
                    <img src={`${URLImages}/${escudosEquipos(partidoActual?.id_equipoLocal)}`} alt={nombresEquipos(partidoActual?.id_equipoLocal)} />
                    <h3>Historial</h3>
                    <img src={`${URLImages}/${escudosEquipos(partidoActual?.id_equipoVisita)}`} alt={nombresEquipos(partidoActual?.id_equipoLocal)} />
                </HistoryTop>
            <AlignmentDivider />
            <HistoryMatchesContainer>
                <HistoryStatsWrapper>
                    <HistoryStatsContainer>
                        <StatsHistory>
                            {estadisticas.victoriasEquipoA}
                        </StatsHistory>
                        <InfoStats>
                            <h2>Victorias</h2>
                            <p>{estadisticas.porcentajeVictoriasEquipoA}%</p>
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
                            {estadisticas.victoriasEquipoB}
                        </StatsHistory>
                        <InfoStats>
                            <h2>Victorias</h2>
                            <p>{estadisticas.porcentajeVictoriasEquipoB}%</p>
                        </InfoStats>
                    </HistoryStatsContainer>

                </HistoryStatsWrapper>
            </HistoryMatchesContainer>
        </HistoryMatchesWrapper>
    )
}

export default HistoryBeetwenTeams
