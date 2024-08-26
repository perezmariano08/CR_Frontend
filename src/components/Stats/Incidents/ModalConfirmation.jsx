import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { toggleHiddenModal, handleBestPlayerOfTheMatch } from '../../../redux/Planillero/planilleroSlice';
import { deleteActionToPlayer, deleteTotalActionsToPlayer, toggleStateMatch } from '../../../redux/Matches/matchesSlice';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import useBdPartido from './customHook/useBdPartido';
import useGenerarBdFormaciones from './customHook/useGenerarBdFormaciones';
import useGenerarBdStats from './customHook/useGenerarBdStats';
import useGenerarBdEventual from './customHook/useGenerarBdEventual';
import useOperationMatch from './customHook/useOperationMatch';

const ModalConfirmation = () => {

    const dispatch = useDispatch();
    const hiddenModal = useSelector((state) => state.planillero.modal.hidden);
    const stateModal = useSelector((state) => state.planillero.modal.modalState);
    const deleteDorsal = useSelector((state) => state.planillero.modal.dorsalDelete);
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete);
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const infoDelete = useSelector((state) => state.planillero.infoDelete);
    const jugadorDestacado = useSelector((state) => state.planillero.timeMatch.jugador_destacado);

    const [loading, setLoading] = useState(false);

    //Custom Hooks
    const {bd_partido} = useBdPartido(idPartido);
    const {bd_formaciones} = useGenerarBdFormaciones(idPartido);
    const {bd_goles, bd_rojas, bd_amarillas, bd_asistencias} = useGenerarBdStats(idPartido)
    const {bd_jugadores_eventuales} = useGenerarBdEventual(idPartido);
    
    // Envío a la base de datos
    const { 
        updateJugadores, 
        updateMatch, 
        insertFormaciones, 
        insertGoles, 
        insertRojas, 
        insertAmarillas, 
        insertAsistencias, 
        updateSancionados 
    } = useOperationMatch(bd_jugadores_eventuales, bd_partido, bd_formaciones, bd_goles, bd_rojas, bd_amarillas, bd_asistencias)

    const handleModalConfirm = async () => {
        try {
            setLoading(true);
            switch(stateModal) {
                case 'action':
                    dispatch(deleteActionToPlayer({ actionToDelete }));
                    dispatch(toggleHiddenModal());
                    toast.success('Acción eliminada', { duration: 4000 });
                    break;
                case 'dorsal':
                    dispatch(deleteTotalActionsToPlayer({
                        idPartido: infoDelete.idPartido,
                        idEquipo: infoDelete.idEquipo,
                        idJugador: infoDelete.idJugador
                    }));
                    dispatch(toggleHiddenModal());
                    toast.success('Dorsal eliminado', { duration: 4000 });
                    break;
                case 'matchFinish':
                    dispatch(toggleStateMatch(idPartido));
                    dispatch(toggleHiddenModal());
                    toast.success('Partido Finalizado', { duration: 4000 });
                    break;
                case 'matchPush':
                    if (jugadorDestacado) {
                        // Ejecutar updateJugadores primero
                        await updateJugadores();
                        
                        // Luego ejecutar las demás operaciones
                        await Promise.all([
                            updateMatch(),
                            insertFormaciones(),
                            insertGoles(),
                            insertRojas(),
                            insertAmarillas(),
                            insertAsistencias(),
                            updateSancionados()
                        ]);
                        dispatch(toggleStateMatch(idPartido));
                        dispatch(toggleHiddenModal());
                        dispatch(handleBestPlayerOfTheMatch(null)); //Borrar jugador destacado
                        toast.success('Partido subido correctamente en la base de datos');
                    } else {
                        toast.error('Se debe seleccionar el MVP antes de finalizar');
                        dispatch(toggleHiddenModal());
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            toast.error('Ocurrio un error durante la operacion')
            console.error('Error: ', error)
        } finally {
            setLoading(false);
        }
};
    
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
            modalTitle = '¿Estás seguro que quieres enviar el partido? No podrás tener ningún acceso a la información del partido';
            break;
        default:
            modalTitle = '';
            break;
    }

    const handleModalCancel = () => {
        dispatch(toggleHiddenModal());
    };

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
                            {modalTitle}
                            <AlignmentDivider />
                        </ActionTitle>
                        <ButtonContainer>
                            {
                                !loading ? (
                                <ActionNext onClick={handleModalConfirm}>
                                    Confirmar
                                </ActionNext>
                                ) : 
                                (
                                <ActionNext className='loader'>
                                    <LoaderIcon/>
                                </ActionNext>
                                )
                            }
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
};

export default ModalConfirmation;
