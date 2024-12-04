import React from 'react';
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles';
import { URLImages } from '../../../utils/utils';
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';

const Alignment = ({ formaciones, partido }) => {
  // Hook para nombres y escudos de equipos
  const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams([partido.id_equipoLocal, partido.id_equipoVisita]);
  // Jugadores locales y visitantes
  const localPlayers = formaciones?.local || [];
  const visitantePlayers = formaciones?.visitante || [];

  if (formaciones?.local.length === 0 && formaciones?.visitante.length === 0) {
    return ''
  }

  return (
    <AlignmentWrapper>
      <h3>Formaciones</h3>
      <AlignmentDivider />
      <AlignmentTeams>
        <AlignmentTeam>
          <img 
            src={`${URLImages}${getEscudoEquipo(partido.id_equipoLocal)}`} 
            alt={getNombreEquipo(partido.id_equipoLocal)}
          />
          <h3>{getNombreEquipo(partido.id_equipoLocal)}</h3>
        </AlignmentTeam>
        <AlignmentTeam>
          <h3>{getNombreEquipo(partido.id_equipoVisita)}</h3>
          <img 
            src={`${URLImages}${getEscudoEquipo(partido.id_equipoVisita)}`} 
            alt={getNombreEquipo(partido.id_equipoVisita)}
          />
        </AlignmentTeam>
      </AlignmentTeams>
      <AlignmentPlayerContainer>
        <AlignmentLocal>
          {localPlayers.map((player, index) => (
            <AlignmentPlayer key={player.id_jugador}>
              {partido.estado === 'F' ? (
                <>
                  <h4>{player.dorsal}</h4>
                  <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
                </>
              ) : (
                <>
                  <h4>{index + 1}</h4>
                  <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
                </>
              )}
            </AlignmentPlayer>
          ))}
        </AlignmentLocal>
        <AlignmentVisit>
          {visitantePlayers.map((player, index) => (
            <AlignmentPlayer key={player.id_jugador}>
              {partido.estado === 'F' ? (
                <>
                  <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
                  <h4>{player.dorsal}</h4>
                </>
              ) : (
                <>
                  <p>{player.apellido ? `${player.apellido.toUpperCase()}, ${player.nombre}` : player.nombre}</p>
                  <h4>{index + 1}</h4>
                </>
              )}
            </AlignmentPlayer>
          ))}
        </AlignmentVisit>
      </AlignmentPlayerContainer>
    </AlignmentWrapper>
  );
};

export default Alignment;
