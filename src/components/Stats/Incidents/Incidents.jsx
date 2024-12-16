import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiLifebuoy, HiMiniPencil, HiMiniStop, HiOutlineXCircle } from "react-icons/hi2";
import { IoIosStar } from "react-icons/io";
import { IncidentLocal, IndicentsContainer, IndicentsWrapper, IconContainer } from './IndicentsStyles';
import { TbRectangleVerticalFilled } from "react-icons/tb";
import { URLImages } from '../../../utils/utils';
import { AlignmentDivider, AlignmentTeam, AlignmentTeams } from '../Alignment/AlignmentStyles';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../Auth/AuthContext';
import { setActionToDelete, setActionToEdit, setEnabledActionEdit, setModalType, toggleModal } from '../../../redux/Planillero/planilleroSlice';
import { useEquipos } from '../../../hooks/useEquipos';
import { SpinerContainer } from '../../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const Incidents = ({ incidencias: incidentes, formaciones, partido }) => {
  const { userRole } = useAuth();
  const dispatch = useDispatch();

  const [realTimeIncidencias, setRealTimeIncidencias] = useState([]);

  // Manejo de incidencias locales
  useEffect(() => {
    if (incidentes) {
      setRealTimeIncidencias(incidentes.filter(i => i.tipo !== 'Asistencia'));
    }
  }, [incidentes]);

    if (!partido) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

  const mejorJugador = formaciones?.find(f => +f.id_jugador === +partido.jugador_destacado);

  // Hook nombres y escudos equipos
  const { nombresEquipos, escudosEquipos } = useEquipos();

  const renderActionIcon = (action) => {
    switch (action.tipo) {
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
      dispatch(setActionToDelete({ type: action.tipo, id_action: action.id_accion, id_equipo: action.id_equipo, id_jugador: action.id_jugador }));
      dispatch(toggleModal('modalConfirmation'));
      dispatch(setModalType('deleteAction'));
    } else {
      toast.error('El partido ya ha sido cargado en la base de datos');
    }
  };

  const handleEditAccion = (action) => {

    if (partido.estado !== 'F') {
      dispatch(setEnabledActionEdit());
      dispatch(setActionToEdit({ type: action.tipo, id_action: action.id_accion, minute: action.minuto }));
      dispatch(toggleModal('ActionTime'));
    } else {
      toast.error('El partido ya ha sido cargado en la base de datos');
    }
  };

  if (incidentes?.length === 0) {
    return ''
  }
  
  return (
    <IndicentsWrapper>
      <h3>Incidencias</h3>
      <AlignmentDivider />
      <AlignmentTeams>
        <AlignmentTeam className='local'>
          <img 
              src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} 
              alt={`${nombresEquipos(partido.id_equipoLocal)}`}/>
            <h3>{`${nombresEquipos(partido.id_equipoLocal)}`}</h3>
        </AlignmentTeam>
        <AlignmentTeam className='visita'>
          <h3>{`${nombresEquipos(partido.id_equipoVisita)}`}</h3>
          <img 
              src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} 
              alt={`${nombresEquipos(partido.id_equipoVisita)}`}/>
        </AlignmentTeam>
      </AlignmentTeams>
      <IndicentsContainer>
        {realTimeIncidencias.map((action) => (
          <IncidentLocal key={action.id_accion} className={action.id_equipo === partido.id_equipoLocal ? 'local' : 'visit'}>
            {action.id_equipo === partido.id_equipoLocal ? (
              <>
                {partido.estado !== 'F' && userRole !== null &&  (
                  <IconContainer>
                    <HiMiniPencil onClick={() => handleEditAccion(action)} />
                    <HiOutlineXCircle className='delete' onClick={() => handleDeleteAction(action)} />
                  </IconContainer>
                )}
                <h3>{action.minuto}'</h3>
                {renderActionIcon(action)}
                <h4>
                  {action.nombre} {action.apellido} 
                  {action.tipo === 'Gol' && action.en_contra === 'S' && ' (e.c)'}
                  {action.tipo === 'Gol' && action.penal === 'S' && ' (p)'}
                </h4>
              </>
            ) : (
              <>
                  <h4>
                    {action.nombre} {action.apellido} 
                    {action.tipo === 'Gol' && action.en_contra === 'S' && ' (e.c)'}
                    {action.tipo === 'Gol' && action.penal === 'S' && ' (p)'}
                  </h4>
                {renderActionIcon(action)}
                <h3>{action.minuto}'</h3>
                {partido.estado !== 'F' && userRole !== null && (
                  <IconContainer>
                    <HiMiniPencil onClick={() => handleEditAccion(action)} />
                    <HiOutlineXCircle className='delete' onClick={() => handleDeleteAction(action)} />
                  </IconContainer>
                )}
              </>
            )}
          </IncidentLocal>
        ))}
        {partido.estado !== 'C' && mejorJugador && (
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
