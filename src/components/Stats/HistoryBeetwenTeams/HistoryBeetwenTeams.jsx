import React from 'react'
import { HistoryMatchesContainer, HistoryMatchesWrapper, HistoryStatsContainer, HistoryStatsWrapper, HistoryTop, InfoStats, StatsHistory } from './HistoryBeetwenTeamsStyles'
import { AlignmentDivider } from '../Alignment/AlignmentStyles'
import { URLImages } from '../../../utils/utils';
import { calcularEstadisticas } from './helper';
import { useEquipos } from '../../../hooks/useEquipos';
import CardPartidoGenerico from '../../CardsPartidos/CardPartidoGenerico/CardPartidoGenerico';
import { PartidosGenericosContainer } from '../../CardsPartidos/CardPartidoGenerico/CardPartidosGenericoStyles';

const HistoryBeetwenTeams = ({ partidosEntreEquipos, partido }) => {

    const { nombresEquipos, escudosEquipos } = useEquipos();

    const estadisticas = calcularEstadisticas(partidosEntreEquipos, partido.id_equipoLocal, partido.id_equipoVisita);
    
    return (
        <HistoryMatchesWrapper>
                <HistoryTop>
                    <img src={`${URLImages}/${escudosEquipos(partido?.id_equipoLocal)}`} alt={nombresEquipos(partido?.id_equipoLocal)} />
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
                    <img src={`${URLImages}/${escudosEquipos(partido?.id_equipoVisita)}`} alt={nombresEquipos(partido?.id_equipoLocal)} />
                </HistoryTop>
            {/* <AlignmentDivider /> */}
            <HistoryMatchesContainer>
                {/* <HistoryStatsWrapper>
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

                </HistoryStatsWrapper> */}
                <PartidosGenericosContainer>
                    {partidosEntreEquipos.map((p) => (
                        <CardPartidoGenerico key={p.id_partido} {...p} />
                    ))}
                </PartidosGenericosContainer>
            </HistoryMatchesContainer>
        </HistoryMatchesWrapper>
    )
}

export default HistoryBeetwenTeams
