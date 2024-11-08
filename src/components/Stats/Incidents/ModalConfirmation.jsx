import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { toggleHiddenModal, handleBestPlayerOfTheMatch, handleMvpSlice, setDescripcionPartido, setJugadoresDestacados, setPenales } from '../../../redux/Planillero/planilleroSlice';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import useBdPartido from './customHook/useBdPartido';
import useGenerarBdFormaciones from './customHook/useGenerarBdFormaciones';
import useGenerarBdStats from './customHook/useGenerarBdStats';
import useGenerarBdEventual from './customHook/useGenerarBdEventual';
import useOperationMatch from './customHook/useOperationMatch';
import useGenerarBdDreamTeam from './customHook/useGenerarBdDreamTeam';
import { useWebSocket } from '../../../Auth/WebSocketContext';
import { URL } from '../../../utils/utils';
import axios from 'axios';
import { actualizarPartidoVacante } from '../../../utils/dataFetchers';

const ModalConfirmation = () => {
    const socket = useWebSocket();
    const dispatch = useDispatch();
    const hiddenModal = useSelector((state) => state.planillero.modal.hidden);
    const stateModal = useSelector((state) => state.planillero.modal.modalState);
    const deleteDorsal = useSelector((state) => state.planillero.modal.dorsalDelete);
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete);
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const infoDelete = useSelector((state) => state.planillero.infoDelete);
    const jugadorDestacado = useSelector((state) => state.planillero.timeMatch.mvp);

    const token = localStorage.getItem('token')

    const [loading, setLoading] = useState(false);

    //Custom Hooks
    const {bd_partido} = useBdPartido(idPartido);
    const {bd_formaciones} = useGenerarBdFormaciones(idPartido);
    const {bd_goles, bd_rojas, bd_amarillas, bd_asistencias} = useGenerarBdStats(idPartido);
    const {bd_jugadores_eventuales} = useGenerarBdEventual(idPartido);
    const {bd_dreamTeam} = useGenerarBdDreamTeam(idPartido);

    // Envío a la base de datos
    const { 
        updateMatch, 
        updateSancionados,
    } = useOperationMatch(bd_jugadores_eventuales, bd_partido, bd_formaciones, bd_goles, bd_rojas, bd_amarillas, bd_asistencias, bd_dreamTeam);

    // Escuchar cambios en el MVP a través del socket
    useEffect(() => {
        const handleMvpUpdate = (nuevoMvp) => {
            dispatch(handleMvpSlice(nuevoMvp));
        };

        socket.on('mvpActualizado', handleMvpUpdate);

        return () => {
            socket.off('mvpActualizado', handleMvpUpdate); // Limpieza del evento al desmontar
        };
    }, [dispatch, socket]);

    const handleDeleteDorsal = async (idPartido, idEquipo, playerId) => {
        try {
            // await dispatch(deletePlayerDorsal({ idPartido, idEquipo, idJugador: playerId }));
            await axios.delete(`${URL}/user/borrar-firma-jugador`, { data: { idPartido, idJugador: playerId }});
            // Emitir el socket si lo necesitas
            socket.emit('dorsalEliminado', { idPartido, idJugador: playerId, dorsal: '' });
        } catch (error) {
            console.error('Error al eliminar el dorsal:', error);
            toast.error('Error al eliminar el dorsal');
        }
    };

    const borrarAccion = async () => {
        try {
            const response = await axios.post(`${URL}/user/eliminar-accion?id_partido=${idPartido}`, actionToDelete);
            toast.success('Acción eliminada', { duration: 4000 });
            socket.emit('eliminarAccion', actionToDelete);
        } catch (error) {
            console.error('Error al eliminar la acción:', error);
            toast.error('Error al eliminar la acción');
        }
    };

    const actualizarEstadoPartido = async (partidoId) => {
        try {
            const response = await axios.post(`${URL}/user/actualizar-estado-partido`, { idPartido: partidoId });
            // toast.success('Estado del partido actualizado con éxito');
            socket.emit('estadoPartidoActualizado', { idPartido: partidoId, nuevoEstado: response.data.nuevoEstado });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        } catch (error) {
            console.error('Error al actualizar el estado del partido:', error);
            toast.error('Error al actualizar el estado del partido');
        }
    };

    const handleModalConfirm = async () => {
        try {
            setLoading(true);
            switch(stateModal) {
                case 'action':
                    // dispatch(deleteActionToPlayer({ actionToDelete }));
                    await borrarAccion();
                    dispatch(toggleHiddenModal());
                    break;
                case 'dorsal':
                    await handleDeleteDorsal(infoDelete.idPartido, infoDelete.idEquipo, infoDelete.idJugador);
                    dispatch(toggleHiddenModal());
                    toast.success('Dorsal eliminado', { duration: 4000 });
                    setTimeout(() => {
                        window.location.reload(); // Esta línea solo se ejecuta aquí
                    }, 500)
                    break;
                case 'matchFinish':
                    // dispatch(toggleStateMatch(idPartido));
                    dispatch(toggleHiddenModal());
                    toast.success('Partido Finalizado', { duration: 4000 });
                    break;
                case 'matchPush':
                    if (jugadorDestacado) {

                        await updateMatch();
                        await updateSancionados();
                        await actualizarEstadoPartido(idPartido);
                        await actualizarPartidoVacante(idPartido);

                        dispatch(setDescripcionPartido(''));
                        dispatch(toggleHiddenModal());
                        dispatch(handleBestPlayerOfTheMatch(null));
                        dispatch(handleMvpSlice(null));
                        dispatch(setJugadoresDestacados([]))
                        dispatch(setPenales({ penalLocal: null, penalVisita: null }));

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
            toast.error('Ocurrio un error durante la operacion');
            console.error('Error: ', error);
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
            modalTitle = '¿Estás seguro que quieres enviar el partido? No podrás editar una vez finalizado';
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
