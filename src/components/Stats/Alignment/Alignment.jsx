import React from 'react';
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles';
import { URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';

const Alignment = ({ formaciones, partido }) => {
  // Hook para nombres y escudos de equipos
  const { nombresEquipos, escudosEquipos } = useEquipos();
  // Jugadores locales y visitantes
  const localPlayers = formaciones.filter(f => f.id_equipo === partido.id_equipoLocal && f.dorsal);
  const visitantePlayers = formaciones.filter(f => f.id_equipo === partido.id_equipoVisita && f.dorsal);

  if (localPlayers.length === 0 && visitantePlayers.length === 0) {
    return ''
  }

  return (
    <AlignmentWrapper>
      <h3>Formaciones</h3>
      <AlignmentDivider />
      <AlignmentTeams>
        <AlignmentTeam>
          <img 
            src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} 
            alt={nombresEquipos(partido.id_equipoLocal)}
          />
          <h3>{nombresEquipos(partido.id_equipoLocal)}</h3>
        </AlignmentTeam>
        <AlignmentTeam>
          <h3>{nombresEquipos(partido.id_equipoVisita)}</h3>
          <img 
            src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} 
            alt={nombresEquipos(partido.id_equipoVisita)}
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
