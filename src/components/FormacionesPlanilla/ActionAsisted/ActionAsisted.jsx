import React, { useEffect, useState } from 'react';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, AssistOptContainer, IconClose, OptionGolContainer, OptionGolWrapper } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Select2 from '../../UI/Select/Select2';

import { useDispatch, useSelector } from 'react-redux';
import { setActionToEdit, setNewAssist, toggleHiddenAction, toggleHiddenAsist, toggleHiddenTime } from '../../../redux/Planillero/planilleroSlice';

const ActionAsisted = () => {
    const dispatch = useDispatch();
    const hiddenAsist = useSelector((state) => state.planillero.asist.hidden);
    const actionToEdit = useSelector((state) => state.planillero.actionEdit);
    const enabledEdit = useSelector((state) => state.planillero.actionEditEnabled);

    //Enviar local team true o false al select para la filtracion
    const planillaData = useSelector((state) => state.planillero.planilla.localTeam)
    const playerActionId = useSelector((state) => state.planillero.planilla.playerSelected);
    
    const [penalSeleccionado, setPenalSeleccionado] = useState(null);
    const [enContraSeleccionado, setEnContraSeleccionado] = useState(null);
    const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState('');

    const handlePenalChange = (event) => {
        if (event.target.checked) {
            setPenalSeleccionado('si');
            setEnContraSeleccionado(null);
            setAsistenciaSeleccionada(null);
            setSelectedPlayer('');
        }
    };
    
    const handleEnContraChange = (event) => {
        if (event.target.checked) {
            setEnContraSeleccionado('si');
            setPenalSeleccionado(null);
            setAsistenciaSeleccionada(null);
            setSelectedPlayer('');
        }
    };
    
    const handleAsistenciaChange = (event) => {
        if (event.target.checked) {
            setAsistenciaSeleccionada(event.target.value);
            setPenalSeleccionado(null);
            setEnContraSeleccionado(null);
        }
    };
    
    const isButtonEnabled = () => {
        if (asistenciaSeleccionada === "si" && selectedPlayer !== '') {
            return true;
        }
        if (penalSeleccionado === "si" || enContraSeleccionado === "si" || asistenciaSeleccionada === 'no' ) {
            return true;
        }
        return false;
    };
    
    useEffect(() => {
        if (enabledEdit) {
            if (actionToEdit.Detail?.penal) {
                setPenalSeleccionado('si');
                setEnContraSeleccionado(null);
                setAsistenciaSeleccionada(null);
                setSelectedPlayer('');
            } else if (actionToEdit.Detail?.enContra) {
                setPenalSeleccionado(null);
                setEnContraSeleccionado('si');
                setAsistenciaSeleccionada(null);
                setSelectedPlayer('');
            } else if (actionToEdit.Detail?.withAssist !== undefined) {
                setPenalSeleccionado(null);
                setEnContraSeleccionado(null);
                setAsistenciaSeleccionada(actionToEdit.Detail.withAssist ? 'si' : 'no');
                setSelectedPlayer(actionToEdit.Detail.withAssist ? actionToEdit.Detail.idAssist : '');
            } else {
                setPenalSeleccionado(null);
                setEnContraSeleccionado(null);
                setAsistenciaSeleccionada(null);
                setSelectedPlayer('');
            }
        }
    }, [actionToEdit]);

    const handleNext = () => {
        const updatedDetail = {
            penal: penalSeleccionado,
            enContra: enContraSeleccionado,
            withAssist: asistenciaSeleccionada === "si",
            idAssist: asistenciaSeleccionada === "si" ? selectedPlayer : null,
        };
        
        if (enabledEdit) {
            const updatedAction = { ...actionToEdit, Detail: updatedDetail };
            dispatch(setActionToEdit(updatedAction));
        }

        dispatch(setNewAssist(updatedDetail));

        dispatch(toggleHiddenAsist());
        dispatch(toggleHiddenTime());

        setPenalSeleccionado(null);
        setEnContraSeleccionado(null);
        setAsistenciaSeleccionada(null);
        setSelectedPlayer('');
    };

    const handleBack = () => {
        dispatch(toggleHiddenAsist());
        dispatch(toggleHiddenAction());
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(toggleHiddenAsist());
        }
    };

    return (
        <>
        {!hiddenAsist && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack onClick={handleBack}>
                            <HiArrowLeft />
                            <p>Volver</p>
                    </ActionBack>
                    <IconClose>
                        <HiMiniXMark onClick={() => dispatch(toggleHiddenAsist())}/>
                    </IconClose>
                    </ActionBackContainer>

                    <ActionTitle>
                        <h3>Indique la opción del Gol</h3>
                        <AlignmentDivider/>
                    </ActionTitle>

                    <ActionsContainer>
                        <OptionGolWrapper>
                            <OptionGolContainer>
                                <h4>¿Penal?</h4>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="penal"
                                        value="si"
                                        checked={penalSeleccionado === "si"}
                                        onChange={handlePenalChange}
                                    />
                                    <label htmlFor="penal">Si</label>
                                </AssistOptContainer>
                            </OptionGolContainer>

                            <OptionGolContainer>
                                <h4>¿En contra?</h4>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="enContra"
                                        value="si"
                                        checked={enContraSeleccionado === "si"}
                                        onChange={handleEnContraChange}
                                    />
                                    <label htmlFor="enContra">Si</label>
                                </AssistOptContainer>
                            </OptionGolContainer>
                        </OptionGolWrapper>

                        <h4>¿Asistencia?</h4>
                        <AssistOptContainer>
                            <input 
                                type="radio"
                                name="asistencia"
                                value="si"
                                checked={asistenciaSeleccionada === "si"}
                                onChange={handleAsistenciaChange}
                            />
                            <label htmlFor="asistencia">Si</label>
                        </AssistOptContainer>
                        <AssistOptContainer>
                            <input 
                                type="radio"
                                name="asistencia"
                                value="no"
                                checked={asistenciaSeleccionada === "no"}
                                onChange={handleAsistenciaChange}
                            />
                            <label htmlFor="asistencia">No</label>    
                        </AssistOptContainer>
                        {asistenciaSeleccionada === "si" && (
                            <Select2 
                                idTeam={planillaData}
                                currentActionPlayerId={playerActionId}
                                onSelect={(playerId) => setSelectedPlayer(playerId)}
                            />
                        )}
                    </ActionsContainer>
                    <ActionNext 
                    onClick={handleNext}
                    className={!isButtonEnabled() ? 'disabled' : ''}
                    >Siguiente
                    </ActionNext>
                </ActionConfirmedWrapper>
            </ActionConfirmedContainer>
        )}
        </>
    );
}

export default ActionAsisted;
