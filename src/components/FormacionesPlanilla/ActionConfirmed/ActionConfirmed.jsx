import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionOptionContainer, ActionTitle, ActionsContainer, IconClose } from './ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";

import { setActionPlayer, setNavigationSource, setPlayerSelectedAction, toggleHiddenAction } from '../../../redux/Planillero/planilleroSlice';
import { toggleHiddenTime, toggleHiddenAsist } from '../../../redux/Planillero/planilleroSlice';

const ActionConfirmed = () => {
    //Toggle
    const dispatch = useDispatch();
    const hiddenActions = useSelector((state) => state.planillero.planilla.hidden);

    //Cerrar componente clickeando en el overlay
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(toggleHiddenAction());
        }
    };

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    //Avisar que selecciono el planillero
    const handleNext = () => {
        switch (selectedOption) {
            case "Gol":
                dispatch(setNavigationSource('Assisted'));
                dispatch(toggleHiddenAsist());
                dispatch(setActionPlayer("Gol"))
                break;
            case "Amarilla":
                dispatch(setNavigationSource('Amarilla'));
                dispatch(toggleHiddenTime());
                dispatch(setActionPlayer("Amarilla"))
                break;
            case "Roja":
                dispatch(setNavigationSource('Roja'));
                dispatch(toggleHiddenTime());
                dispatch(setActionPlayer("Roja"))
                break;
            default:
                break;
        }
        dispatch(toggleHiddenAction());
    };
    
    return (
        <>
        {!hiddenActions && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack>
                            <HiArrowLeft onClick={() => dispatch(toggleHiddenAction())}/>
                            <p>Volver</p>
                    </ActionBack>
                    <IconClose>
                        <HiMiniXMark 
                        onClick={() => dispatch(toggleHiddenAction())}/>
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
                    </ActionsContainer>
                    <ActionNext 
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className={selectedOption ? '' : 'disabled'}
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
