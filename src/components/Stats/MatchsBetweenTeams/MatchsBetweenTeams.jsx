import React from 'react'
import { CardOldMatchesItem, CardOldMatchesWrapper, MatchesItemDescription, MatchesItemResult, MatchesItemTeam, MatchesItemTeams } from '../CardOldMatches/CardOldMatchesStyles'
import { AlignmentDivider } from '../Alignment/AlignmentStyles'
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';
import { URLImages } from '../../../utils/utils';

const MatchsBetweenTeams = ({ partidosEntreEquipos, idLocal, idVisita}) => {

    const ids = [idLocal, idVisita];
    const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams(ids);

  return (
    <CardOldMatchesWrapper>
        {
            partidosEntreEquipos.map((p) => {
                return  <CardOldMatchesItem key={p.id_partido}>
            <MatchesItemDescription>
            <p>{`${p.dia_nombre} ${p.dia_numero} / ${p.mes}`}</p>
            <p className='fecha'>{`Fecha ${p.jornada} ${p.nombre_edicion}`}</p>
            </MatchesItemDescription>
            <MatchesItemTeams>
                <MatchesItemTeam>
                    <p>{getNombreEquipo(idLocal)}</p>
                    <img src={`${URLImages}/${getEscudoEquipo(idLocal)}`} alt={getNombreEquipo(idLocal)} />
                </MatchesItemTeam>
                <MatchesItemResult>
                    <p>{p.goles_local}-{p.goles_visita}</p>
                </MatchesItemResult>
                <MatchesItemTeam>
                    <p>{getNombreEquipo(idVisita)}</p>
                    <img src={`${URLImages}/${getEscudoEquipo(idVisita)}`} alt={getNombreEquipo(idVisita)} />
                </MatchesItemTeam>
            </MatchesItemTeams>
        </CardOldMatchesItem>
            })
        }

        <AlignmentDivider />
    </CardOldMatchesWrapper>
  )
}

export default MatchsBetweenTeams
