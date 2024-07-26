import React from 'react'
import { IncidentLocal, IndicentsContainer, IndicentsWrapper, IconContainer } from './IndicentsStyles'
import { AlignmentDivider, AlignmentTeam, AlignmentTeams } from '../Alignment/AlignmentStyles'
import { HiLifebuoy, HiMiniStop, HiStar } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { HiMiniPencil, HiOutlineXCircle } from "react-icons/hi2";
import { toggleHiddenModal, setActionToDelete, toggleHiddenAction, setCurrentStateModal, setCurrentIdDorsalDelete, setActionToEdit, setEnabledActionEdit } from '../../../redux/Planillero/planilleroSlice';
import toast, { Toaster } from 'react-hot-toast';

const Incidents = () => {
  // Consumo del slice que a su vez consume la base de datos
  const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch)
  const partidos = useSelector((state) => state.partidos.data);
  const partido = partidos.find((partido) => partido.id_partido === idPartido);

  // Lógica manejo estado partido
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

  // Guardamos las incidencias en constantes
  const incidenciasLocal = match.Local.Player
    .filter(player => player.Actions)
    .map(player => player.Actions.map(action => {
      let detalleGol = '';
      if (action.Type === 'Gol') {
        if (action.Detail.penal === 'si') detalleGol += ' (p)';
        if (action.Detail.enContra === 'si') detalleGol += ' (ec)';
      }
      return {
        ID: action.ID,
        idPartido: idPartido,
        idEquipo: match.Local.id_equipo,
        idJugador: player.ID,
        dorsal: player.Dorsal,
        Nombre: player.Nombre + detalleGol,
        Accion: action.Type,
        Minuto: parseInt(action.Time, 10),
        Detail: action.Detail,
        Local: true
      };
    }))
    .flat();

  const incidenciasVisita = match.Visitante.Player
    .filter(player => player.Actions)
    .map(player => player.Actions.map(action => {
      let detalleGol = '';
      if (action.Type === 'Gol') {
        if (action.Detail.penal === 'si') detalleGol += ' (p)';
        if (action.Detail.enContra === 'si') detalleGol += ' (ec)';
      }
      return {
        ID: action.ID,
        idPartido: idPartido,
        idEquipo: match.Visitante.id_equipo,
        idJugador: player.ID,
        dorsal: player.Dorsal,
        Nombre: player.Nombre + detalleGol,
        Accion: action.Type,
        Minuto: parseInt(action.Time, 10),
        Detail: action.Detail,
        Local: false
      };
    }))
    .flat();

  // Las unificamos
  const incidencias = [
    ...incidenciasLocal,
    ...incidenciasVisita
  ].sort((a, b) => a.Minuto - b.Minuto);

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
    if (match.matchState !== 'matchPush') {
      dispatch(toggleHiddenModal());
      dispatch(setActionToDelete(action));
      dispatch(setCurrentStateModal('action'));
    } else {
      toast.error('El partido ya ha sido cargado en la base de datos');
    }
  }

  const handleEditAccion = (action) => {
    console.log(action);
    if (match.matchState !== 'matchPush') {
      dispatch(setActionToEdit(action));
      dispatch(setEnabledActionEdit())
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
          <img src={`/Escudos/${escudosEquipos(partido.id_equipoLocal)}`} alt={`${nombreEquipos(partido.id_equipoLocal)}`} />
          <h3>{`${nombreEquipos(partido.id_equipoLocal)}`}</h3>
        </AlignmentTeam>

        <AlignmentTeam>
          <h3>{`${nombreEquipos(partido.id_equipoVisita)}`}</h3>
          <img src={`/Escudos/${escudosEquipos(partido.id_equipoVisita)}`} alt={`${nombreEquipos(partido.id_equipoVisita)}`} />
        </AlignmentTeam>
      </AlignmentTeams>

      <IndicentsContainer>
        {incidencias.map((action, index) => (
          <IncidentLocal key={index} className={action.Local ? 'local' : 'visit'}>
            <h3>{action.Minuto}'</h3>
            {renderActionIcon(action)}
            <h4>{action.Nombre}</h4>

            <IconContainer>
              <HiMiniPencil onClick={() => handleEditAccion(action)} />
              <HiOutlineXCircle
                className='delete'
                onClick={() => handleConfirmDelete(action)}
              />
            </IconContainer>
          </IncidentLocal>
        ))}
      </IndicentsContainer>
      <Toaster/>
    </IndicentsWrapper>
  )
}

export default Incidents
