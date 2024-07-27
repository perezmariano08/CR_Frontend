import React from 'react';
import { IncidentLocal, IndicentsContainer, IndicentsWrapper, IconContainer } from './IndicentsStyles';
import { AlignmentDivider, AlignmentTeam, AlignmentTeams } from '../Alignment/AlignmentStyles';
import { HiLifebuoy, HiMiniStop } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { HiMiniPencil, HiOutlineXCircle } from "react-icons/hi2";
import { toggleHiddenModal, setActionToDelete, toggleHiddenAction, setCurrentStateModal, setActionToEdit, setEnabledActionEdit } from '../../../redux/Planillero/planilleroSlice';
import toast, { Toaster } from 'react-hot-toast';

const Incidents = ({ incidentes }) => {
  const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
  const partidos = useSelector((state) => state.partidos.data);
  const partido = partidos.find((partido) => partido.id_partido === idPartido);

  const matches = useSelector((state) => state.match);
  const match = matches.find(p => p.ID === idPartido);
  const equipos = useSelector((state) => state.equipos.data);

  const escudosEquipos = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
    return equipo ? equipo.img : null;
  };

  const nombreEquipos = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
    return equipo ? equipo.nombre : null;
  };

  // Convertimos las incidencias locales a un formato uniforme
  const convertToUniformFormat = (action) => {
    const nombre = action.Nombre || `${action.nombre || ''} ${action.apellido || ''}`;
    return {
      ID: action.ID || action.id_jugador,
      idPartido: action.idPartido || idPartido,
      idEquipo: action.idEquipo,
      idJugador: action.idJugador || action.id_jugador,
      dorsal: action.dorsal || '', // No disponible en los datos de ejemplo
      Nombre: nombre,
      Accion: action.Accion || action.tipo,
      Minuto: action.Minuto || action.minuto,
      Detail: action.Detail || {
        penal: action.penal,
        enContra: action.en_contra
      },
      Local: action.Local || (action.idEquipo === partido?.id_equipoLocal)
    };
  };

  const incidenciasLocal = match?.Local?.Player
    ?.filter(player => player.Actions)
    .map(player => player.Actions.map(action => convertToUniformFormat({
      ID: action.ID,
      idPartido: idPartido,
      idEquipo: match.Local.id_equipo,
      idJugador: player.ID,
      dorsal: player.Dorsal,
      Nombre: player.Nombre,
      Accion: action.Type,
      Minuto: parseInt(action.Time, 10),
      Detail: action.Detail,
      Local: true
    })))
    .flat() || [];

  const incidenciasVisita = match?.Visitante?.Player
    ?.filter(player => player.Actions)
    .map(player => player.Actions.map(action => convertToUniformFormat({
      ID: action.ID,
      idPartido: idPartido,
      idEquipo: match.Visitante.id_equipo,
      idJugador: player.ID,
      dorsal: player.Dorsal,
      Nombre: player.Nombre,
      Accion: action.Type,
      Minuto: parseInt(action.Time, 10),
      Detail: action.Detail,
      Local: false
    })))
    .flat() || [];

  // Unificamos las incidencias locales y de visita
  const incidenciasLocalAll = [
    ...incidenciasLocal,
    ...incidenciasVisita
  ].sort((a, b) => a.Minuto - b.Minuto);

  // Si el partido está terminado, usamos los datos de la base de datos
  const incidencias = partido?.estado === 'F' ? (incidentes || []).map(incident => convertToUniformFormat(incident)) : incidenciasLocalAll;

  const renderActionIcon = (action) => {
    switch (action.Accion) {
      case 'Gol':
        return <HiLifebuoy />;
      case 'Amarilla':
        return <HiMiniStop className="yellow" />;
      case 'Roja':
        return <HiMiniStop className="red" />;
      default:
        return null;
    }
  };

  // Logica editar detalle de accion o borrar accion
  const dispatch = useDispatch();

  const handleConfirmDelete = (action) => {
    if (partido?.estado !== 'F') {
      dispatch(toggleHiddenModal());
      dispatch(setActionToDelete(action));
      dispatch(setCurrentStateModal('action'));
    } else {
      toast.error('El partido ya ha sido cargado en la base de datos');
    }
  };

  const handleEditAccion = (action) => {
    if (partido?.estado !== 'F') {
      dispatch(setActionToEdit(action));
      dispatch(setEnabledActionEdit());
      dispatch(toggleHiddenAction());
    } else {
      toast.error('El partido ya ha sido cargado en la base de datos');
    }
  };

  return (
    <IndicentsWrapper>
      <h3>Incidencias</h3>
      <AlignmentDivider />
      <AlignmentTeams>
        <AlignmentTeam>
          <img src={`/Escudos/${escudosEquipos(partido?.id_equipoLocal)}`} alt={`${nombreEquipos(partido?.id_equipoLocal)}`} />
          <h3>{`${nombreEquipos(partido?.id_equipoLocal)}`}</h3>
        </AlignmentTeam>

        <AlignmentTeam>
          <h3>{`${nombreEquipos(partido?.id_equipoVisita)}`}</h3>
          <img src={`/Escudos/${escudosEquipos(partido?.id_equipoVisita)}`} alt={`${nombreEquipos(partido?.id_equipoVisita)}`} />
        </AlignmentTeam>
      </AlignmentTeams>

      <IndicentsContainer>
        {incidencias.map((action, index) => (
          <IncidentLocal key={index} className={action.idEquipo === partido?.id_equipoLocal ? 'local' : 'visit'}>
            <h3>{action.Minuto}'</h3>
            {renderActionIcon(action)}
            <h4>{`${action.Nombre}`}</h4>

            {partido?.estado !== 'F' && (
              <IconContainer>
                <HiMiniPencil onClick={() => handleEditAccion(action)} />
                <HiOutlineXCircle
                  className='delete'
                  onClick={() => handleConfirmDelete(action)}
                />
              </IconContainer>
            )}
          </IncidentLocal>
        ))}
      </IndicentsContainer>
      <Toaster />
    </IndicentsWrapper>
  );
};

export default Incidents;
