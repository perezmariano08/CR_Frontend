import React from 'react'
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles'
import EscudoCelta from '/Escudos/celta-de-vino.png'
import { useSelector } from 'react-redux';
import { URL } from '../../../utils/utils';

const Alignment = ({ formaciones }) => {
  console.log(formaciones);
  const equipos = useSelector((state) => state.equipos.data);

  const escudosEquipos = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
    return equipo ? equipo.img : null;
  };

  const nombreEquipos = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
    return equipo ? equipo.nombre : null;
  };

  const localPlayers = formaciones?.local || [];
  const visitantePlayers = formaciones?.visitante || [];

  return (
    <AlignmentWrapper>
        <h3>Formaciones</h3>
        <AlignmentDivider/>
        <AlignmentTeams>
          <AlignmentTeam>
            <img src={`${URL}${escudosEquipos(localPlayers[0]?.id_equipo)}`} alt="" />
            <h3>{nombreEquipos(localPlayers[0]?.id_equipo)}</h3>
          </AlignmentTeam>

          <AlignmentTeam>
            <h3>{nombreEquipos(visitantePlayers[0]?.id_equipo)}</h3>
            <img src={`${URL}${escudosEquipos(visitantePlayers[0]?.id_equipo)}`} alt="" />
          </AlignmentTeam>
        </AlignmentTeams>

        <AlignmentPlayerContainer>
          <AlignmentLocal>
            {localPlayers.map(player => (
              player.nombre ? (
                <AlignmentPlayer key={player.id_jugador}>
                  <h4>{player.dorsal}</h4>
                  <p>{player.apellido.toUpperCase()}, {player.nombre}</p>
                </AlignmentPlayer>
              ) : (
                <AlignmentPlayer key={player.id_jugador}>
                  <h4>{player.dorsal}</h4>
                  <p>{player.nombre}</p>
                </AlignmentPlayer>
              )
            ))}
          </AlignmentLocal>

          <AlignmentVisit>
            {visitantePlayers.map(player => (
              player.nombre ? (
                <AlignmentPlayer key={player.id_jugador}>
                  <p>{player.apellido.toUpperCase()}, {player.nombre}</p>
                  <h4>{player.dorsal}</h4>
                </AlignmentPlayer>
              ) : (
                <AlignmentPlayer key={player.id_jugador}>
                  <p>{player.id_nombre}</p>
                  <h4>{player.dorsal}</h4>

                </AlignmentPlayer>
              )
            ))}
          </AlignmentVisit>
        </AlignmentPlayerContainer>
    </AlignmentWrapper>
  )
}

export default Alignment
