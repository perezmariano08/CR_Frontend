import React from 'react'
import { IncidentLocal, IndicentsContainer, IndicentsWrapper, IconContainer } from './IndicentsStyles'
import { AlignmentDivider, AlignmentTeam, AlignmentTeams } from '../Alignment/AlignmentStyles'
import EscudoCelta from '/Escudos/celta-de-vino.png'
import { HiLifebuoy, HiMiniStop, HiStar} from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { HiMiniPencil, HiOutlineXCircle  } from "react-icons/hi2";
import { toggleHiddenModal, setActionToDelete, toggleHiddenAction, setCurrentStateModal, setCurrentIdDorsalDelete } from '../../../redux/Planillero/planilleroSlice';

const Incidents = () => {

const actions = useSelector((state) => state.planillero.planilla.actions)

const renderActionIcon = (action) => {
    switch (action.accion) {
      case 'Gol':
        return <HiLifebuoy/>;
      case 'Amarilla':
        return <HiMiniStop className="yellow" />;
      case 'Roja':
        return <HiMiniStop className="red" />;
      default:
        return null;
    }
  };

  //Logica detalle del gol
const isGolEnContra = (actions) => {
  if (actions.accion === 'Gol' && actions.golDetails.enContra === 'si') {
    return
  }
}

const isGolPenal = (actions) => {
  if (actions.accion === 'Gol' && actions.golDetails.penal === 'si') {
    return
  }
}

// Logica editar detalle de accion o borrar accion
const dispatch = useDispatch()

const handleConfirmDelete = (action) => {
  dispatch(toggleHiddenModal())
  dispatch(setActionToDelete(action))
  dispatch(setCurrentStateModal('action'))
}

const handleEditAccion = (action) => {
  dispatch(setActionToDelete(action))
  dispatch(toggleHiddenAction())
}

  return (
    <IndicentsWrapper>
        <h3>Incidencias</h3>
        <AlignmentDivider/>
        <AlignmentTeams>
            <AlignmentTeam>
                <img src={EscudoCelta} alt="" />
                <h3>Celta de Vino</h3>
            </AlignmentTeam>
            
            <AlignmentTeam>
                <h3>Celta de Vino</h3>
                <img src={EscudoCelta} alt="" />
            </AlignmentTeam>
        </AlignmentTeams>

        <IndicentsContainer>

        {actions.map((action, index) => (
          <IncidentLocal key={index} className={action.isLocalTeam ? 'local' : 'visit'}>
          <h3>{action.minuto}'</h3>
          {renderActionIcon(action)}
          <h4>{action.nombreJugador}</h4>

          <IconContainer>
            <HiMiniPencil onClick={() => handleEditAccion(action)}/>
            <HiOutlineXCircle 
            className='delete'
            onClick={() => handleConfirmDelete(action)}
            />
          </IconContainer>
        </IncidentLocal>
        ))}

        </IndicentsContainer>
    </IndicentsWrapper>
  )
}

export default Incidents