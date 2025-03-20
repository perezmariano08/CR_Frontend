import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { orderData, URL } from '../../../utils/utils';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Importar toast
import { setAction, setActionToEdit, setDisabledActionEdit, toggleModal } from '../../../redux/Planillero/planilleroSlice';
import { getFormaciones } from '../../../utils/dataFetchers';

const ActionConfirmed = ({ id_partido, setFormaciones, fetchIncidencias }) => {
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    // const socket = useWebSocket();

    const modal = useSelector((state) => state.planillero.modal);
    const jugador = useSelector((state) => state.planillero.jugador);
    const action = useSelector((state) => state.planillero.action);

    const enabledEdit = useSelector((state) => state.planillero.enabledActionEdit);
    const actionEdit = useSelector((state) => state.planillero.actionToEdit);

    // const { fetchIncidencias } = useIncidencias(id_partido, token);

    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [notChanges, setNotChanges] = useState(false);

    const originalTime = useRef(actionEdit?.minute)

    useEffect(() => {
        if (enabledEdit) {
            setInputValue(actionEdit.minute || '');
        } else if (modal === 'ActionTime') {
            setInputValue('');
        }
    }, [enabledEdit, modal]);

    useEffect(() => {
        if (enabledEdit) {
            setNotChanges(+inputValue !== +originalTime.current);
        } else {
            setNotChanges(inputValue !== '');
        }
    }, [inputValue, enabledEdit]);

    useEffect(() => {
        if (enabledEdit && actionEdit.minute != null) {
            originalTime.current = actionEdit.minute;
        }
    }, [enabledEdit, actionEdit]);

    const closeModal = () => {
        dispatch(toggleModal());
        dispatch(setAction({ type: null, detail: null }));
        if (enabledEdit) {
            dispatch(setDisabledActionEdit());
        }
    }

    const handleBackModal = () => {
        if (enabledEdit) {
            dispatch(setDisabledActionEdit());
            closeModal();
            return;
        }
        if (action.type === 'gol') {
            dispatch(toggleModal('ActionDetailGol'));
            return;
        } else if (action.type === 'roja') {
            dispatch(toggleModal('ActionDetailRoja'));
            return;
        }
        dispatch(toggleModal('ActionType'));
        return
    }

    const handleInputChange = (value) => {
        if (/^\d{0,2}$/.test(value) || value === '') {
            setInputValue(value);
        }
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const data = {
                id_partido: id_partido,
                id_jugador: jugador.id_jugador,
                id_equipo: jugador.id_equipo,
                action: action.type,
                detail: action.detail,
                minute: +inputValue,
            };

            let accion;

            if (action.type === 'gol') {
                accion = 'gol';
            } else if (action.type === 'amarilla') {
                accion = 'amarilla';
            } else if (action.type === 'roja') {
                accion = 'roja';
            }

            const res = await axios.post(`${URL}/planilla/insertar-${accion}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
            
            if (accion === 'amarilla' || accion === 'roja') {
                const updatedFormaciones = await getFormaciones(id_partido, token);
                setFormaciones(orderData(updatedFormaciones));
            }
            
            closeModal();

            if (res.data.status === 200) {
                toast.success(res.data.mensaje);
                await fetchIncidencias();
            }

            dispatch(setAction({ type: null, detail: null }));
            setInputValue('');
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al insertar la acción');
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmEdit = async () => {
        try {
            setLoading(true);
            const data = {
                id_accion: actionEdit.id_action,
                minute: +inputValue,
            };

            let accion;

            if (actionEdit.type === 'Gol') {
                accion = 'gol';
            } else if (actionEdit.type === 'Amarilla') {
                accion = 'amarilla';
            } else if (actionEdit.type === 'Roja') {
                accion = 'roja';
            }

            // !manejar mensajes desde el back
            const res = await axios.put(`${URL}/planilla/actualizar-${accion}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
            
            await fetchIncidencias();
            
            closeModal();
            toast.success(res.data.mensaje);
            dispatch(setActionToEdit({ type: null, id_action: null, minute: null }));
            dispatch(setDisabledActionEdit())
            setInputValue('');
        } catch (error) {
            const message = error.response?.data?.mensaje || 'Error desconocido';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {modal === 'ActionTime' && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBackContainer>
                            <ActionBack onClick={handleBackModal}>
                                <HiArrowLeft />
                                <p>Volver</p>
                            </ActionBack>
                            <IconClose>
                                <HiMiniXMark onClick={closeModal} />
                            </IconClose>
                        </ActionBackContainer>
                        <ActionTitle>
                            {
                                enabledEdit ? (
                                    <h3>Editar minuto de la acción</h3>
                                ) : (
                                    <h3>Indique el minuto de la acción</h3>
                                )
                            }
                            <AlignmentDivider />
                        </ActionTitle>
                        <ActionsContainer>
                            <Input2
                                placeholder={"ej: 15"}
                                value={inputValue}
                                onValueChange={handleInputChange}
                                numeric={true}
                            />
                        </ActionsContainer>
                        {
                            enabledEdit ? (
                                <ActionNext
                                    className={!inputValue || !notChanges ? 'disabled' : ''}
                                    onClick={handleConfirmEdit}
                                    disabled={!inputValue || !notChanges}
                                >
                                    {loading ? 'Editando...' : 'Editar'}
                                </ActionNext>
                            ) : (
                                <ActionNext
                                    className={!inputValue || !notChanges ? 'disabled' : ''}
                                    onClick={handleConfirm}
                                    disabled={!inputValue || !notChanges}
                                >
                                    {loading ? 'Procesando...' : 'Confirmar'}
                                </ActionNext>
                            )
                        }
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
        </>
    );
}

export default ActionConfirmed;
