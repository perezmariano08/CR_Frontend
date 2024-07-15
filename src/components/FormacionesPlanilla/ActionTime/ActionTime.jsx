import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { setNewTime, toggleHiddenTime, toggleHiddenAction, toggleHiddenAsist, setActionToEdit, setEnabledActionEdit, setDisabledActionEdit } from '../../../redux/Planillero/planilleroSlice';
import { addActionToPlayer, editActionToPlayer } from '../../../redux/Matches/matchesSlice';

const ActionConfirmed = () => {
    const partidoId = useSelector((state) => state.planillero.timeMatch.idMatch);
    const dispatch = useDispatch();
    const hiddenTime = useSelector((state) => state.planillero.planillaTime.hidden);
    const navigationSource = useSelector((state) => state.planillero.planilla.navigationSource);
    const { newTime } = useSelector((state) => state.planillero.planillaTime);
    const accionDetail = useSelector((state) => state.planillero.asist.dataGol);
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete);
    const { localTeam, playerSelected, playerName, dorsalPlayer, actionPlayer } = useSelector((state) => state.planillero.planilla);
    const actionToEdit = useSelector((state) => state.planillero.actionEdit);
    const enabledEdit = useSelector((state) => state.planillero.actionEditEnabled);

    const handleBack = () => {
        if (navigationSource === 'Assisted') {
            dispatch(toggleHiddenAsist());
            dispatch(toggleHiddenTime());
        } else {
            dispatch(toggleHiddenAction());
            dispatch(toggleHiddenTime());
        }
    };

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (value) => {
        if (/^\d{0,2}$/.test(value) || value === '') {
            setInputValue(value);
        }
    };
    
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(toggleHiddenTime());
        }
    };

    const handleTimeConfirm = () => {
        const actionData = enabledEdit
            ? {
                id: actionToEdit.ID,
                idPartido: actionToEdit.idPartido,
                isLocalTeam: actionToEdit.idEquipo,
                idJugador: actionToEdit.idJugador,
                nombreJugador: actionToEdit.Nombre,
                dorsal: actionToEdit.dorsal,
                accion: actionToEdit.Accion,
                minuto: parseInt(inputValue),
                detail: accionDetail
            }
            : {
                id: Date.now(),
                idPartido: partidoId,
                isLocalTeam: localTeam,
                idJugador: playerSelected,
                nombreJugador: playerName,
                dorsal: dorsalPlayer,
                accion: actionPlayer,
                minuto: inputValue,
                detail: accionDetail
            };
    
        if (enabledEdit) {
            dispatch(editActionToPlayer({ partidoId, actionData }));
        } else {
            dispatch(addActionToPlayer({ partidoId, actionData }));
        }
        dispatch(setNewTime(inputValue));
        dispatch(toggleHiddenTime());
        dispatch(setDisabledActionEdit());
        setInputValue('');
    };
    

    return (
        <>
            {!hiddenTime && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBackContainer>
                            <ActionBack onClick={handleBack}>
                                <HiArrowLeft />
                                <p>Volver</p>
                            </ActionBack>
                            <IconClose>
                                <HiMiniXMark onClick={() => dispatch(toggleHiddenTime())} />
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
                            />
                        </ActionsContainer>
                        <ActionNext
                            disabled={!inputValue.trim()}
                            className={!inputValue.trim() ? 'disabled' : ''}
                            onClick={handleTimeConfirm}
                        >
                            Confirmar
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
        </>
    );
};

export default ActionConfirmed;
