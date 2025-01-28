import React from 'react';
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles';
import { URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';
import { Skeleton } from 'primereact/skeleton';

const Alignment = ({ formaciones, partido }) => {

  const loading = !formaciones || !partido;

  if (loading) {
    return (
      <AlignmentWrapper>
        <h3>Formaciones</h3>
        <AlignmentDivider />
        <AlignmentTeams>
          <AlignmentTeam>
            <Skeleton shape="circle" width="4rem" height="4rem" />
            <Skeleton width="10rem" height="1.5rem" />
          </AlignmentTeam>
          <AlignmentTeam>
            <Skeleton width="10rem" height="1.5rem" />
            <Skeleton shape="circle" width="4rem" height="4rem" />
          </AlignmentTeam>
        </AlignmentTeams>
        <AlignmentPlayerContainer>
          <AlignmentLocal>
            {[...Array(5)].map((_, index) => (
              <AlignmentPlayer key={index}>
                <Skeleton width="2rem" height="2rem" />
                <Skeleton width="12rem" height="1rem" />
              </AlignmentPlayer>
            ))}
          </AlignmentLocal>
          <AlignmentVisit>
            {[...Array(5)].map((_, index) => (
              <AlignmentPlayer key={index}>
                <Skeleton width="12rem" height="1rem" />
                <Skeleton width="2rem" height="2rem" />
              </AlignmentPlayer>
            ))}
          </AlignmentVisit>
        </AlignmentPlayerContainer>
      </AlignmentWrapper>
    );
  }

  const { nombresEquipos, escudosEquipos } = useEquipos();

  const localPlayers = partido.estado === 'F'
  ? formaciones.filter(f => +f.id_equipo === +partido.id_equipoLocal && f.dorsal)
  : formaciones.filter(f => +f.id_equipo === +partido.id_equipoLocal);

const visitantePlayers = partido.estado === 'F'
  ? formaciones.filter(f => +f.id_equipo === +partido.id_equipoVisita && f.dorsal)
  : formaciones.filter(f => +f.id_equipo === +partido.id_equipoVisita);

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
