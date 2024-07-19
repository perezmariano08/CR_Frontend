import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { toggleHiddenModal, eliminarAccionesPorDorsal } from '../../../redux/Planillero/planilleroSlice';
import { addDescToMatch, deleteActionToPlayer, deleteTotalActionsToPlayer, manageDorsal, toggleStateMatch } from '../../../redux/Matches/matchesSlice';
import { Toaster, toast } from 'react-hot-toast';
import Axios from 'axios';
import { URL } from '../../../utils/utils';

const ModalConfirmation = () => {
    const dispatch = useDispatch()
    const hiddenModal = useSelector((state) => state.planillero.modal.hidden);
    const stateModal = useSelector((state) => state.planillero.modal.modalState)
    const deleteDorsal = useSelector((state) => state.planillero.modal.dorsalDelete)
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete)
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch)
    const infoDelete = useSelector((state) => state.planillero.infoDelete);
    const descToMatch = useSelector((state) => state.planillero.timeMatch.desc)
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);

    const golesLocal = match.Local.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));
    const golesVisita = match.Visitante.Player.filter(player => player.Actions && player.Actions.some(action => action.Type === 'Gol'));
    const jugadorDestacado = useSelector((state) => state.planillero.timeMatch.jugador_destacado)

    const bd_partido = {
        id_partido: idPartido,
        goles_local: golesLocal.length,
        goles_visita: golesVisita.length,
        descripcion: descToMatch,
        jugador_destacado: jugadorDestacado
    }

    console.log(bd_partido);

    const updateMatch = async () => {
        try {
            await Axios.put(`${URL}/user/update-partido`, {
                id_partido: bd_partido.id_partido,
                goles_local: bd_partido.goles_local,
                goles_visita: bd_partido.goles_visita,
                descripcion: bd_partido.descripcion,
                jugador_destacado: jugador_destacado,
                estado: 'F'
            });
            toast.success('Se actualizaron los datos correctamente');
        } catch (error) {
            toast.error('Error al verificar los datos.');
            console.error('Error al verificar los datos:', error);
        }
    };

    const handleModalConfirm = () => {
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
                    updateMatch().then(() => {
                        dispatch(toggleStateMatch(idPartido));
                        dispatch(toggleHiddenModal());
                    });
                } else {
                    toast.error('Se debe seleccionar el MVP antes de finalizar')
                    return
                }
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
            modalTitle = '¿Estás seguro que quieres enviar el partido? No podrás tener ningun acceso a la información del partido';
            break;
        default:
            modalTitle = '';
            break;
    }

    const handleModalCancel = () => {
        dispatch(toggleHiddenModal());
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
                            {modalTitle}
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
