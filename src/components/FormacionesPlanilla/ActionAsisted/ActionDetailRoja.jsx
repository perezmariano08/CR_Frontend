import React, { useEffect, useState } from 'react';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, AssistOptContainer, IconClose, OptionGolContainer, OptionGolWrapper } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Select2 from '../../UI/Select/Select2';
import { useDispatch, useSelector } from 'react-redux';
import { setAction, toggleModal } from '../../../redux/Planillero/planilleroSlice';
import { PiSoccerBallFill } from "react-icons/pi";
import Select from '../../Select/Select';

const ActionDetailRoja = () => {
    const dispatch = useDispatch();

    const modal = useSelector((state) => state.planillero.modal);

    //handlers modal
    const closeAndClearModal = () => {
        dispatch(toggleModal());
        dispatch(setAction({ type: null, detail: null }));
    }

    const handleBackModal = () => {
        dispatch(toggleModal('ActionType'));
    }

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeAndClearModal();
        }
    };

    const [option, setOption] = useState('Accion de juego');

    const handleOptionChange = (e) => {
        setOption(e.target.value);
    };

    const handleNext = () => {
        if (!option) return toast.error('Debe seleccionar una opcion para avanzar');

        dispatch(setAction({ detail: option }))
        dispatch(toggleModal('ActionTime'));
    }

    const data = [
        { id: 'accion-juego', nombre: 'Accion de juego' },
        { id: 'agresion-verbal', nombre: 'Agresion verbal' },
        { id: 'agresion-fisica', nombre: 'Agresion fisica' },
        { id: 'otro', nombre: 'Otro' },
    ]

    return (
        <>
        {modal === 'ActionDetailRoja' && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack onClick={handleBackModal}>
                            <HiArrowLeft/>
                            <p>Volver</p>
                    </ActionBack>
                    <IconClose>
                        <HiMiniXMark onClick={closeAndClearModal}/>
                    </IconClose>
                    </ActionBackContainer>

                    <ActionTitle>
                        <h3>Indique el detalle de la roja</h3>
                        <AlignmentDivider/>
                    </ActionTitle>

                    <ActionsContainer>
                        <h4>Seleccione una opción</h4>
                        <Select
                        value={option}
                        data={data}
                        placeholder={"Seleccione una opción"}
                        icon={<PiSoccerBallFill className='icon-select' />}
                        onChange={handleOptionChange}
                        />
                    </ActionsContainer>
                    <ActionNext 
                    onClick={handleNext}
                    className={!option || option === 'asistencia' ? 'disabled' : ''}
                    >Siguiente
                    </ActionNext>
                </ActionConfirmedWrapper>
            </ActionConfirmedContainer>
        )}
        </>
    );
}

export default ActionDetailRoja;
