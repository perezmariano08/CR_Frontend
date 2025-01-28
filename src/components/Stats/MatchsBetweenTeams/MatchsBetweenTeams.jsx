import React from 'react'
import { CardOldMatchesItem, CardOldMatchesWrapper, MatchesItemDescription, MatchesItemResult, MatchesItemTeam, MatchesItemTeams } from '../CardOldMatches/CardOldMatchesStyles'
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';
import { URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';
import CardPartidoGenerico from '../../../components/CardsPartidos/CardPartidoGenerico/CardPartidoGenerico'
const MatchsBetweenTeams = ({ partidosEntreEquipos}) => {

    const { escudosEquipos, nombresEquipos } = useEquipos();

    const goToMatchStats = (id) => {
        window.location.href = `/stats-match?id=${id}`;
    }


    return (
        <CardOldMatchesWrapper>
            {
                partidosEntreEquipos && partidosEntreEquipos.length > 0 ? (
                    partidosEntreEquipos.map((p) => (
                        <CardOldMatchesItem key={p.id_partido} onClick={() => goToMatchStats(p.id_partido)}>
                            <MatchesItemDescription>
                                <p>{`${p.dia_nombre} ${p.dia_numero} / ${p.mes}`}</p>
                                <p className='fecha'>{`Fecha ${p.jornada} ${p.nombre_edicion}`}</p>
                            </MatchesItemDescription>
                            <MatchesItemTeams>
                                <MatchesItemTeam className='local'>
                                    <p>{nombresEquipos(p.id_equipoLocal)}</p>
                                    <img src={`${URLImages}/${escudosEquipos(p.id_equipoLocal)}`} alt={nombresEquipos(p.id_equipoLocal)} />
                                </MatchesItemTeam>
                                <MatchesItemResult>
                                    <p>{p.goles_local}-{p.goles_visita}</p>
                                </MatchesItemResult>
                                <MatchesItemTeam>
                                    <img src={`${URLImages}/${escudosEquipos(p.id_equipoVisita)}`} alt={nombresEquipos(p.id_equipoVisita)} />
                                    <p>{nombresEquipos(p.id_equipoVisita)}</p>
                                </MatchesItemTeam>
                            </MatchesItemTeams>
                        </CardOldMatchesItem>
                    ))
                ) : (
                    <p>No hay partidos entre estos dos equipos.</p>
                )
            }
            {/* <CardPartidoGenerico {...partidosEntreEquipos} /> */}
            {partidosEntreEquipos.map((p) => (
                <CardPartidoGenerico key={p.id_partido} {...p} />
            ))}
        </CardOldMatchesWrapper>
    )
}

export default MatchsBetweenTeams
