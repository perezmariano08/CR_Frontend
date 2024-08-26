import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiLifebuoy, HiMiniPencil, HiMiniStop, HiOutlineXCircle } from "react-icons/hi2";
import { IoIosStar } from "react-icons/io";
import { toggleHiddenModal, setActionToDelete, toggleHiddenAction, setCurrentStateModal, setActionToEdit, setEnabledActionEdit } from '../../../redux/Planillero/planilleroSlice';
import { IncidentLocal, IndicentsContainer, IndicentsWrapper, IconContainer } from './IndicentsStyles';
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { URLImages } from '../../../utils/utils';
import { AlignmentDivider, AlignmentTeam, AlignmentTeams } from '../Alignment/AlignmentStyles';
import toast, { Toaster } from 'react-hot-toast';
import useNameAndShieldTeams from '../../../hooks/useNameAndShieldTeam';

const Incidents = ({ incidentes, formaciones, partidoId }) => {
  const dispatch = useDispatch();
  const partidos = useSelector((state) => state.partidos.data);
  const partido = partidos.find((partido) => partido.id_partido === partidoId);
  const equipos = useSelector((state) => state.equipos.data);
  const matches = useSelector((state) => state.match);
  const match = matches.find(p => p.ID === partidoId);

  // Get local and visitor incidents
  const getIncidenciasFromLocal = (team, isLocal) => {
    if (!team || !team.Player) return [];

    return team.Player
      .filter(player => player.Actions)
      .flatMap(player => player.Actions.map(action => {
        let detalleGol = '';
        if (action.Type === 'Gol') {
          if (action.Detail.penal === 'si') detalleGol += ' (p)';
          if (action.Detail.enContra === 'si') detalleGol += ' (ec)';
        }
        return {
          ID: action.ID,
          idPartido: partidoId,
          idEquipo: team.id_equipo,
          idJugador: player.ID,
          dorsal: player.Dorsal,
          Nombre: player.Nombre + detalleGol,
          Accion: action.Type,
          Minuto: parseInt(action.Time, 10),
          Detail: action.Detail,
          Local: isLocal
        };
      }));
  };

  // Get database incidents
  const getIncidenciasFromDatabase = () => {
    const jugadores = [
      ...(formaciones.local || []),
      ...(formaciones.visitante || [])
    ];

    return incidentes
      .filter(i => i.tipo !== 'Asistencia')
      .map(incident => {
        const jugador = jugadores.find(j => j.id_jugador === incident.id_jugador);
        return {
          ID: `${incident.tipo}-${incident.minuto}-${incident.id_jugador}`,
          idPartido: partidoId,
          idEquipo: incident.id_equipo,
          idJugador: incident.id_jugador,
          dorsal: jugador ? jugador.dorsal : '',
          Nombre: `${incident.nombre} ${incident.apellido}`,
          Accion: incident.tipo,
          Minuto: incident.minuto,
          Detail: {
            penal: incident.penal,
            enContra: incident.en_contra
          },
          Local: incident.id_equipo === partido.id_equipoLocal
        };
      });
  };

  // Combine local and database incidents based on match status
  const incidencias = partido
    ? partido.estado === 'F'
      ? getIncidenciasFromDatabase()
      : [
          ...getIncidenciasFromLocal(match ? match.Local : {}, true),
          ...getIncidenciasFromLocal(match ? match.Visitante : {}, false)
        ]
    : [];

  incidencias.sort((a, b) => a.Minuto - b.Minuto);

  const mejorJugador = [
    ...(formaciones.local || []),
    ...(formaciones.visitante || [])
  ].find(jugador => jugador.id_jugador === partido.jugador_destacado);

  //Hook nombres y escudos equipos
  const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams([partido.id_equipoLocal, partido.id_equipoVisita]);

  const renderActionIcon = (action) => {
    switch (action.Accion) {
      case 'Gol':
        return <HiLifebuoy />;
      case 'Amarilla':
        return <TbRectangleVerticalFilled className="yellow" />;
      case 'Roja':
        return <TbRectangleVerticalFilled className="red" />;
      default:
        return null;
    }
  };

  const handleDeleteAction = (action) => {
    if (partido.estado !== 'F') {
      dispatch(toggleHiddenModal());
      dispatch(setActionToDelete(action));
      dispatch(setCurrentStateModal('action'));
    } else {
      toast.error('El partido ya ha sido cargado en la base de datos');
    }
  };

  const handleEditAccion = (action) => {
    if (partido.estado !== 'F') {
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
        <AlignmentTeam className='local'>
        <img 
            src={`${URLImages}${getEscudoEquipo(partido.id_equipoLocal)}`} 
            alt={`${getNombreEquipo(partido.id_equipoLocal)}`}/>
          <h3>{`${getNombreEquipo(partido.id_equipoLocal)}`}</h3>
        </AlignmentTeam>
        <AlignmentTeam className='visita'>
        <h3>{`${getNombreEquipo(partido.id_equipoVisita)}`}</h3>
        <img 
            src={`${URLImages}${getEscudoEquipo(partido.id_equipoVisita)}`} 
            alt={`${getNombreEquipo(partido.id_equipoVisita)}`}/>
        </AlignmentTeam>
      </AlignmentTeams>
      <IndicentsContainer>
        {incidencias.map((action, index) => (
          <IncidentLocal key={index} className={action.Local ? 'local' : 'visit'}>
            {action.Local ? (
              <>
                {partido.estado !== 'F' && (
                  <IconContainer>
                    <HiMiniPencil onClick={() => handleEditAccion(action)} />
                    <HiOutlineXCircle className='delete' onClick={() => handleDeleteAction(action)} />
                  </IconContainer>
                )}
                <h3>{action.Minuto}'</h3>
                {renderActionIcon(action)}
                <h4>{action.Nombre}</h4>
              </>
            ) : (
              <>
                <h4>{action.Nombre}</h4>
                {renderActionIcon(action)}
                <h3>{action.Minuto}'</h3>
                {partido.estado !== 'F' && (
                  <IconContainer>
                    <HiMiniPencil onClick={() => handleEditAccion(action)} />
                    <HiOutlineXCircle className='delete' onClick={() => handleDeleteAction(action)} />
                  </IconContainer>
                )}
              </>
            )}
          </IncidentLocal>
        ))}
        {partido.estado === 'F' && mejorJugador && (
          <IncidentLocal className='mejorJugador'>
            <h3>Mejor Jugador</h3>
            <h4>{mejorJugador.nombre} {mejorJugador.apellido}</h4>
            <IoIosStar />
          </IncidentLocal>
        )}
      </IndicentsContainer>
      <Toaster />
    </IndicentsWrapper>
  );
};

export default Incidents;
