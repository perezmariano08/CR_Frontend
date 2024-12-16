import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { addActionToPlayer, editActionToPlayer } from '../../../redux/Matches/matchesSlice';
import { io } from 'socket.io-client';
import { URL } from '../../../utils/utils';
import axios from 'axios';
import { useWebSocket } from '../../../Auth/WebSocketContext';
import { toast } from 'react-hot-toast'; // Importar toast

const ActionConfirmed = () => {
    const dispatch = useDispatch();
    const partidoId = useSelector((state) => state.planillero.timeMatch.idMatch);
    const hiddenTime = useSelector((state) => state.planillero.planillaTime.hidden);
    const navigationSource = useSelector((state) => state.planillero.planilla.navigationSource);
    const { newTime } = useSelector((state) => state.planillero.planillaTime);
    const accionDetail = useSelector((state) => state.planillero.asist.dataGol);
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete);
    const { localTeam, playerSelected, playerName, dorsalPlayer, actionPlayer } = useSelector((state) => state.planillero.planilla);
    const actionToEdit = useSelector((state) => state.planillero.actionEdit);
    const enabledEdit = useSelector((state) => state.planillero.actionEditEnabled);
    const sanctionType = useSelector((state) => state.planillero.expulsadoData.tipo);

    const socket = useWebSocket();

    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false); // Estado para controlar el loading
    const [originalMinute, setOriginalMinute] = useState(""); // Guardar el minuto original

    useEffect(() => {
        // Autocompletar con el minuto de la acción a editar si enabledEdit es true
        if (enabledEdit && actionToEdit && actionToEdit.Minuto) {
            setInputValue(actionToEdit.Minuto.toString());
            setOriginalMinute(actionToEdit.Minuto);
        } else {
            setInputValue(""); // Limpiar si no es edición
        }
    }, [enabledEdit, actionToEdit]);

    const handleBack = () => {
        if (navigationSource === 'Assisted') {
            dispatch(toggleHiddenAsist());
            dispatch(toggleHiddenTime());
        } else {
            dispatch(toggleHiddenAction());
            dispatch(toggleHiddenTime());
        }
    };

    const handleInputChange = (value) => {
        if (/^\d{0,2}$/.test(value) || value === '') {
            setInputValue(value);
        }
    };
    
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(toggleHiddenTime());
            setInputValue('');
        }
    };

    const handleTimeConfirm = async () => {

        const actionData = enabledEdit
            ? {
                ...actionToEdit,
                minuto: inputValue,
                id_partido: partidoId
            }
            : {
                idPartido: partidoId,
                isLocalTeam: localTeam,
                idJugador: playerSelected,
                nombreJugador: playerName,
                dorsal: dorsalPlayer,
                accion: actionPlayer,
                minuto: inputValue,
                detail: accionDetail,
                tipoExpulsion: actionPlayer === 'Roja' ? sanctionType : null
            };

        try {
            setLoading(true); // Iniciar loading
            const loadingToastId = toast.loading('Procesando...'); // Agregar el toast loading
    
            const url = enabledEdit ? `${URL}/user/editar-accion` : `${URL}/user/insertar-accion`;
            const response = await axios.post(url, actionData);
    
            socket.emit(enabledEdit ? 'editarAccion' : 'nuevaAccion', actionData);
        
            dispatch(setNewTime(inputValue));
            dispatch(toggleHiddenTime());
            dispatch(setDisabledActionEdit());
            dispatch(resetAssist());
            setInputValue('');
    
            toast.dismiss(loadingToastId); // Cerrar el loader
            toast.success(enabledEdit ? 'Acción editada con éxito' : 'Acción procesada con éxito');
        } catch (error) {
            console.error('Error al enviar la acción:', error);
            toast.dismiss(loadingToastId); // Cerrar el loader
            toast.error('Error al procesar la acción');
        } finally {
            setLoading(false); // Finalizar loading
        }
    };
    
    const isButtonDisabled = !inputValue.trim() || inputValue === originalMinute.toString() || loading;

    return (
        <>
            {!hiddenTime && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBackContainer>
                            <ActionBack onClick={handleBack}>
                                <HiArrowLeft onClick={() => {
                                    dispatch(setDisabledActionEdit());
                                }}/>
                                <p>Volver</p>
                            </ActionBack>
                            <IconClose>
                                <HiMiniXMark onClick={() => {
                                    dispatch(toggleHiddenTime());
                                    dispatch(setDisabledActionEdit());
                                }}/>
                            </IconClose>
                        </ActionBackContainer>
                        <ActionTitle>
                            <h3>Indique el minuto de la acción</h3>
                            <AlignmentDivider />
                        </ActionTitle>
                        <ActionsContainer>
                            <Input2 
                                placeholder={"ej: 00:00"}
                                value={inputValue}
                                onValueChange={handleInputChange}
                                numeric={true}
                            />
                        </ActionsContainer>
                        <ActionNext
                            disabled={isButtonDisabled} // Asegúrate de usar la propiedad 'disabled' correctamente
                            className={isButtonDisabled ? 'disabled' : ''} // Aplica la clase 'disabled' correctamente
                            onClick={handleTimeConfirm}
                        >
                            {loading ? 'Procesando...' : 'Confirmar'}
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
        </>
    );
};

export default ActionConfirmed;
