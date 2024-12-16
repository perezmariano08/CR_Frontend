import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionOptionContainer, ActionTitle, ActionsContainer, IconClose } from './ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Select2 from '../../UI/Select/Select2';
import { closeModal, setAction, toggleModal } from '../../../redux/Planillero/planilleroSlice';

const ActionType = () => {
    const dispatch = useDispatch();

    const modal = useSelector((state) => state.planillero.modal);

    const [typeAction, setTypeAction] = useState('gol');
    
    const handleOptionChange = (e) => {
        setTypeAction(e.target.value);
    };

    //handlers modal
    const handleCloseModal = () => {
        dispatch(closeModal());
    }

    const handleCloseAndClearModal = () => {
        dispatch(closeModal());
        dispatch(setAction({ type: null, detail: null }));
    }

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            handleCloseAndClearModal();
        }
    };

    const handleNext = () => {

        if (typeAction === 'gol') {
            dispatch(setAction({ type: typeAction }))
            handleCloseModal();
            dispatch(toggleModal('ActionDetailGol'));
            return;
        }

        if (typeAction === 'roja') {
            dispatch(setAction({ type: typeAction }));
            handleCloseModal();
            dispatch(toggleModal('ActionDetailRoja'));
            return;
        }

        if (typeAction === 'amarilla') {
            dispatch(setAction({ type: typeAction }));
            handleCloseModal();
            dispatch(toggleModal('ActionTime'));
            return;
        }

    }

    return (
        <>
        {modal === 'ActionType' && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack onClick={handleCloseModal}>
                        <HiArrowLeft/>
                            <p>Volver</p>
                        </ActionBack>
                        <IconClose>
                        <HiMiniXMark onClick={handleCloseAndClearModal}/>
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
                                value="gol"
                                onChange={handleOptionChange}
                                checked={typeAction === "gol"}
                            />
                            <p>Gol</p>
                        </ActionOptionContainer>
                        <ActionOptionContainer>
                            <input 
                                type="radio" 
                                name="actionOption"
                                id="amarillaOption"
                                value="amarilla"
                                onChange={handleOptionChange}
                                checked={typeAction === "amarilla"}
                            />
                            <p>Amarilla</p>
                        </ActionOptionContainer>
                        <ActionOptionContainer>
                            <input 
                                type="radio" 
                                name="actionOption"
                                id="rojaOption"
                                value="roja"
                                onChange={handleOptionChange}
                                checked={typeAction === "roja"}
                            />
                            <p>Roja</p>
                        </ActionOptionContainer>
                    </ActionsContainer>
                    <ActionNext
                        onClick={handleNext}
                    >
                        Siguiente
                    </ActionNext>
                </ActionConfirmedWrapper>
            </ActionConfirmedContainer> 
        )}
        </>
    );
}

export default ActionType;
