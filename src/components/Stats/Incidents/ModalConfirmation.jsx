import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { toggleHiddenModal, eliminarAccionesPorDorsal } from '../../../redux/Planillero/planilleroSlice';
import { deleteActionToPlayer, deleteTotalActionsToPlayer, manageDorsal, toggleStateMatch } from '../../../redux/Matches/matchesSlice';
import { Toaster, toast } from 'react-hot-toast';


const ModalConfirmation = () => {
    const dispatch = useDispatch()
    //Logica para eliminar accion o dorsal de la planilla
    const hiddenModal = useSelector((state) => state.planillero.modal.hidden);
    const stateModal = useSelector((state) => state.planillero.modal.modalState)
    const deleteDorsal = useSelector((state) => state.planillero.modal.dorsalDelete)
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete)
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch)
    const infoDelete = useSelector((state) => state.planillero.infoDelete);

    const handleModalConfirm = () => {
        switch(stateModal) {
            case 'action':
                dispatch(deleteActionToPlayer({ actionToDelete }));
                dispatch(toggleHiddenModal())
                toast.success('Acción eliminada', {
                    duration: 4000,
                })
                break;
            case 'dorsal':
                dispatch(deleteTotalActionsToPlayer({
                    idPartido: infoDelete.idPartido,
                    idEquipo: infoDelete.idEquipo,
                    idJugador: infoDelete.idJugador
                }));
                dispatch(toggleHiddenModal())
                toast.success('Dorsal eliminado', {
                    duration: 4000,
                })
                break;
            case 'matchFinish':
                dispatch(toggleStateMatch(idPartido))
                dispatch(toggleHiddenModal())
                toast.success('Partido Finalizado', {
                    duration: 4000,
                })
                break;
            case 'matchPush':
                dispatch(toggleStateMatch(idPartido))
                dispatch(toggleHiddenModal())
                toast.success('Partido cargado con éxito en la base de datos', {
                    duration: 4000,
                })
                break;
            default:
                break;
        }
    }

    let modalTitle;
    switch (stateModal) {
        case 'action':
            modalTitle = '¿Estás seguro de que quieres eliminar la acción?';
            break;
        case 'dorsal':
            modalTitle = `¿Estás seguro de que quieres eliminar el dorsal ${deleteDorsal}? Las acciones de este jugador serán eliminadas.`;
            break;
        case 'matchFinish':
            modalTitle = '¿Estás seguro que quieres finalizar el partido?';
            break;
        case 'matchPush':
            modalTitle = '¿Estás seguro que quieres enviar el partido? No podrás tener ningun acceso a la informacion del partido';
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
                        <ActionNext onClick={handleModalCancel} className="cancel">
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
