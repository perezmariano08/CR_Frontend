import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { actualizarEstadoPartido, actualizarPartido, actualizarPartidoVacante, borrarFirmaJugador, borrarIncidencia, updateSancionados } from '../../../utils/dataFetchers';
import { setActionToDelete, setDescripcionPartido, setJugador, toggleModal } from '../../../redux/Planillero/planilleroSlice';

const ModalConfirmation = () => {
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    const searchParams = new URLSearchParams(window.location.search);
    const id_partido = parseInt(searchParams.get('id'));

    const modal = useSelector((state) => state.planillero.modal);
    const modalType = useSelector((state) => state.planillero.modalType);
    const jugador = useSelector((state) => state.planillero.jugador);
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete);
    const descripcionRedux = useSelector((state) => state.planillero.description);
    const penal_local = useSelector((state) => state.planillero.penales?.penal_local);
    const penal_visita = useSelector((state) => state.planillero.penales?.penal_visita);
    const mvpSelectedRedux = useSelector((state) => state.planillero.mvpSelected);

    const [loading, setLoading] = useState(false);

    const closeAndClearModal = () => {
        dispatch(toggleModal());
        dispatch(setJugador(null));
        dispatch(setActionToDelete({ type: null, id_action: null, id_equipo: null, id_jugador: null }));
        dispatch(setDescripcionPartido(null))
    }

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeAndClearModal();
        }
    };

    let text = ''
    if (modalType === 'deleteDorsal') {
        text = `¿Estás seguro de que quieres eliminar el dorsal del jugador ${jugador?.dorsal}? Esta acción eliminara todas las acciones del jugador y no podrá ser revertida.`;
    } else if (modalType === 'deleteAction') {
        text = `¿Estás seguro que quieres eliminar esta incidencia? Esta acción no podrá ser revertida.`;
    } else if (modalType === 'matchPush') { 
        text = '¿Estás seguro que quieres subir el partido? Esta acción no podrá ser revertida.';
    }
    
    const handleNext = async () => {
        setLoading(true);
        try {
            if (modalType === 'deleteDorsal') {
                const res = await borrarFirmaJugador(id_partido, jugador?.id_jugador);
                toast.success(res.mensaje);
                window.location.reload();
            } else if (modalType === 'deleteAction') {
                let accion;
                if (actionToDelete.type === 'Gol') {
                    accion = 'gol';
                } else if (actionToDelete.type === 'Amarilla') {
                    accion = 'amarilla';
                } else if (actionToDelete.type === 'Roja') {                
                    accion = 'roja';
                }
                const res = await borrarIncidencia(accion, id_partido, actionToDelete.id_action, actionToDelete.id_equipo, actionToDelete.id_jugador);
                toast.success(res.mensaje);
            } else if (modalType === 'matchPush') {

                const data = {
                    id_partido: id_partido,
                    descripcion: descripcionRedux,
                    pen_local: penal_local,
                    pen_visita: penal_visita,
                }

                if (mvpSelectedRedux) {

                    await actualizarEstadoPartido(id_partido);
                    await actualizarPartido(data);
                    await actualizarPartidoVacante(id_partido);
                    await updateSancionados(token);

                    toast.success('Partido subido correctamente');
                } else {
                    toast.error('Debe seleccionar un jugador MVP antes de finalizar el partido');
                }
            }
            closeAndClearModal();
        } catch (error) {
            console.error(error);
            toast.error(res.data.mensaje || "Ocurrió un error. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            {modal === 'modalConfirmation' && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBack>
                            <HiArrowLeft onClick={closeAndClearModal}/>
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                            {text}
                            <AlignmentDivider />
                        </ActionTitle>
                        <ButtonContainer>
                            {
                                !loading ? (
                                <ActionNext onClick={handleNext}>
                                    Confirmar
                                </ActionNext>
                                ) : 
                                (
                                <ActionNext className='loader'>
                                    <LoaderIcon/>
                                </ActionNext>
                                )
                            }
                            <ActionNext onClick={closeAndClearModal} className="cancel">
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
