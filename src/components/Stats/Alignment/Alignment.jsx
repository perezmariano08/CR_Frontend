import React from 'react';
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles';
import { URLImages } from '../../../utils/utils';
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';

const Alignment = ({ formaciones, jugadores, partido }) => {
  //HOOK ESCUDOS Y NOMBRES
  const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams([partido.id_equipoLocal, partido.id_equipoVisita]);

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
        <img 
            src={`${URLImages}${getEscudoEquipo(partido.id_equipoLocal)}`} 
            alt={`${getNombreEquipo(partido.id_equipoLocal)}`}/>
          <h3>{`${getNombreEquipo(partido.id_equipoLocal)}`}</h3>
        </AlignmentTeam>
        <AlignmentTeam>
        <h3>{`${getNombreEquipo(partido.id_equipoVisita)}`}</h3>
        <img 
            src={`${URLImages}${getEscudoEquipo(partido.id_equipoVisita)}`} 
            alt={`${getNombreEquipo(partido.id_equipoVisita)}`}/>
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
