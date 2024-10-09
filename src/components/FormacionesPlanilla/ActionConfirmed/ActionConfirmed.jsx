import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionOptionContainer, ActionTitle, ActionsContainer, IconClose } from './ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Select2 from '../../UI/Select/Select2';
import { setActionPlayer, setActionToEdit, setNavigationSource, toggleHiddenAction, toggleHiddenTime, toggleHiddenAsist, setTipoExpulsion, setEnabledActionEdit, setDisabledActionEdit } from '../../../redux/Planillero/planilleroSlice';

const ActionConfirmed = () => {
    const dispatch = useDispatch();
    const hiddenActions = useSelector((state) => state.planillero.planilla.hidden);
    const actionToEdit = useSelector((state) => state.planillero.actionEdit);
    const enabledEdit = useSelector((state) => state.planillero.actionEditEnabled);

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(toggleHiddenAction());
            dispatch(setDisabledActionEdit());
        }
    };

    const [selectedOption, setSelectedOption] = useState(actionToEdit?.Accion || null);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const setEditAccion = (option) => {
        const updatedAction = { ...actionToEdit, Accion: option };
        if (option === 'Roja') {
            dispatch(setActionToEdit(updatedAction));
            return
        } else if (option !== 'Gol') {
            delete updatedAction.Detail;
        }
        dispatch(setActionToEdit(updatedAction));
    }

    const handleNext = () => {
        switch (selectedOption) {
            case "Gol":
                dispatch(setNavigationSource('Assisted'));
                dispatch(toggleHiddenAsist());
                dispatch(setActionPlayer("Gol"));
                break;
            case "Amarilla":
                dispatch(setNavigationSource('Amarilla'));
                dispatch(toggleHiddenTime());
                dispatch(setActionPlayer("Amarilla"));
                break;
            case "Roja":
                dispatch(setNavigationSource('Roja'));
                dispatch(toggleHiddenTime());
                dispatch(setActionPlayer("Roja"));
                dispatch(setTipoExpulsion(tipoSancion));
                break;
            default:
                break;
        }
        if(enabledEdit){
            setEditAccion(selectedOption)
        }
        dispatch(toggleHiddenAction());
    };

    const [tipoSancion, setTipoSancion] = useState(null)
    
    const handleSelect = (value) => {
        if (selectedOption === "Roja") {
            setTipoSancion(value);
        } else {
            setTipoSancion(null)
        }
    };

    return (
        <>
        {!hiddenActions && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack>
                        <HiArrowLeft onClick={() => {
                                dispatch(toggleHiddenAction());
                                dispatch(setDisabledActionEdit()); // Agregar aquí
                            }}/>
                            <p>Volver</p>
                        </ActionBack>
                        <IconClose>
                        <HiMiniXMark onClick={() => {
                                dispatch(toggleHiddenAction());
                                dispatch(setDisabledActionEdit()); // Agregar aquí
                            }}/>
                        </IconClose>
                    </ActionBackContainer>

                    <ActionTitle>
                        <h3>Seleccione una acción</h3> 
                        <AlignmentDivider/>
                    </ActionTitle>

                    <ActionsContainer>
                        <ActionOptionContainer>
                            <input 
                                type="radio" 
                                name="actionOption"
                                id="golOption"
                                value="Gol"
                                onChange={() => handleOptionChange("Gol")}
                                checked={selectedOption === "Gol"}
                            />
                            <p>Gol</p>
                        </ActionOptionContainer>
                        <ActionOptionContainer>
                            <input 
                                type="radio" 
                                name="actionOption"
                                id="amarillaOption"
                                value="Amarilla"
                                onChange={() => handleOptionChange("Amarilla")}
                                checked={selectedOption === "Amarilla"}
                            />
                            <p>Amarilla</p>
                        </ActionOptionContainer>
                        <ActionOptionContainer>
                            <input 
                                type="radio" 
                                name="actionOption"
                                id="rojaOption"
                                value="Roja"
                                onChange={() => handleOptionChange("Roja")}
                                checked={selectedOption === "Roja"}
                            />
                            <p>Roja</p>
                        </ActionOptionContainer>
                        {selectedOption === "Roja" && (
                            <>
                                Indique el tipo
                                <Select2 
                                onSelect={handleSelect}
                                action={selectedOption}/>
                            </>

                        )}
                    </ActionsContainer>
                    <ActionNext
                        onClick={handleNext}
                        disabled={!selectedOption || (selectedOption === 'Roja' && !tipoSancion)}
                        className={!selectedOption || (selectedOption === 'Roja' && !tipoSancion) ? 'disabled' : ''}
                    >
                        Siguiente
                    </ActionNext>
                </ActionConfirmedWrapper>
            </ActionConfirmedContainer> 
        )}
        </>
    );
}

export default ActionConfirmed;
