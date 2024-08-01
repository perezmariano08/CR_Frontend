import React from 'react';
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles';
import { useSelector } from 'react-redux';
import { URL } from '../../../utils/utils';

const Alignment = ({ formaciones, jugadores, partido }) => {
  const equipos = useSelector((state) => state.equipos.data);

  const escudosEquipos = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
    return equipo ? equipo.img : null;
  };

  const nombreEquipos = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
    return equipo ? equipo.nombre : null;
  };

  const getJugadoresPorEquipo = (idEquipo) => {
    return jugadores.filter((j) => j.id_equipo === idEquipo && j.eventual === 'N');
  };

  const localPlayers = partido.estado === 'F' ? formaciones?.local || [] : getJugadoresPorEquipo(partido.id_equipoLocal);
  const visitantePlayers = partido.estado === 'F' ? formaciones?.visitante || [] : getJugadoresPorEquipo(partido.id_equipoVisita);

  const renderPlayers = (players, isMatchFinished, isLocal) => {
    let numero = 1;
    return players.map(player => (
      <AlignmentPlayer key={player.id_jugador}>
        {isMatchFinished ? (
          isLocal ? (
            <>
              <h4>{player.dorsal}</h4>
              <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
            </>
          ) : (
            <>
              <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
              <h4>{player.dorsal}</h4>
            </>
          )
        ) : (
          isLocal ? (
            <>
              <h4>{numero++}</h4>
              <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
            </>
          ) : (
            <>
              <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
              <h4>{numero++}</h4>
            </>
          )
        )}
      </AlignmentPlayer>
    ));
  };

  return (
    <AlignmentWrapper>
      <h3>Formaciones</h3>
      <AlignmentDivider />
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
          {renderPlayers(localPlayers, partido.estado === 'F', true)}
        </AlignmentLocal>
        <AlignmentVisit>
          {renderPlayers(visitantePlayers, partido.estado === 'F', false)}
        </AlignmentVisit>
      </AlignmentPlayerContainer>
    </AlignmentWrapper>
  );
};

export default Alignment;
