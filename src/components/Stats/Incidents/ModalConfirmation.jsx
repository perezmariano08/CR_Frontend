import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { toggleHiddenModal, deleteAction, eliminarAccionesPorDorsal, toggleStateMatch } from '../../../redux/Planillero/planilleroSlice';
import { manageDorsal } from '../../../redux/Matches/matchesSlice';
import { Toaster, toast } from 'react-hot-toast';


const ModalConfirmation = () => {

    const dispatch = useDispatch()

    //Logica para eliminar accion o dorsal de la planilla
    const hiddenModal = useSelector((state) => state.planillero.modal.hidden);
    const stateModal = useSelector((state) => state.planillero.modal.modalState)
    const deleteDorsal = useSelector((state) => state.planillero.modal.dorsalDelete)
    const deleteIdDorsal = useSelector((state) => state.planillero.modal.idDorsalDelete)
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete)
    const currentTeamDelete= useSelector((state) => state.planillero.modal.currentTeam)

    const handleModalConfirm = () => {
        switch(stateModal) {
            case 'action':
                dispatch(deleteAction(actionToDelete));
                dispatch(toggleHiddenModal())
                toast.success('Acción eliminada', {
                    duration: 4000,
                })
                break;
            case 'dorsal':
                dispatch(manageDorsal({ playerId: deleteIdDorsal, dorsal: deleteDorsal, assign: false }));
                dispatch(eliminarAccionesPorDorsal({ dorsal: deleteDorsal, isLocalTeam: currentTeamDelete }));
                dispatch(toggleHiddenModal())
                toast.success('Dorsal eliminado', {
                    duration: 4000,
                })
                break;
            case 'matchFinish':
                dispatch(toggleStateMatch())
                dispatch(toggleHiddenModal())
                toast.success('Partido Finalizado', {
                    duration: 4000,
                })
                break;
        }
    }

    // Obtener el título correspondiente según el estado actual del modal
    let modalTitle;
    switch (stateModal) {
        case 'action':
            modalTitle = '¿Estás seguro de que quieres eliminar la acción?';
            break;
        case 'dorsal':
            modalTitle = `¿Estás seguro de que quieres eliminar el dorsal ${deleteDorsal}? Las acciones de este jugador serán eliminadas.`;
            break;
        case 'matchFinish':
            modalTitle = '¿Estás seguro que quieres finalizar el partido? No podras editar ningún dato una vez confirmado';
            break;
        default:
            modalTitle = '';
            break;
    }

    const handleModalCancel = () => {
        dispatch(toggleHiddenModal())
    }

    return (
        <>
            {!hiddenModal && (
                <ActionConfirmedContainer>
                    <ActionConfirmedWrapper>
                        <ActionBack>
                            <HiArrowLeft onClick={handleModalCancel}/>
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                            {
                                modalTitle
                            }
                            <AlignmentDivider />
                        </ActionTitle>
                        <ButtonContainer>
                        <ActionNext onClick={handleModalConfirm}>
                            Confirmar
                        </ActionNext>
                        <ActionNext onClick={handleModalCancel}>
                            Cancelar
                        </ActionNext>
                        </ButtonContainer>

                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
                
            )}
            <Toaster/>
        </>
    );
}

export default ModalConfirmation;
