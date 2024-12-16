import React, { useEffect, useState } from 'react';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, AssistOptContainer, IconClose, OptionGolContainer, OptionGolWrapper } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Select2 from '../../UI/Select/Select2';
import { useDispatch, useSelector } from 'react-redux';
import { setAction, toggleModal } from '../../../redux/Planillero/planilleroSlice';

const ActionDetailGol = ({ formaciones }) => {
    const dispatch = useDispatch();

    const modal = useSelector((state) => state.planillero.modal);
    const jugador = useSelector((state) => state.planillero.jugador);
    const action = useSelector((state) => state.planillero.action);
    
    const jugadoresMiEquipo = formaciones?.filter(f => +f.id_equipo === +jugador?.id_equipo && f.sancionado === 'N' && f.dorsal);

    //handlers modal
    const closeAndClearModal = () => {
        dispatch(toggleModal());
        dispatch(setAction({ type: null, detail: null }));
    }

    const handleBackModal = () => {
        dispatch(toggleModal());
        dispatch(toggleModal('ActionType'));
    }

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeAndClearModal();
        }
    };

    const [option, setOption] = useState('no_asistencia');

    const handleOptionChange = (e) => {
        setOption(e.target.value);
    };
    
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handlePlayerSelect = (id) => {
        setSelectedPlayer(id);
        setOption(id);
    };

    const handleNext = () => {
        if (option === 'asistencia') return toast.error('Debe seleccionar un jugador para avanzar');
        if (!option) return toast.error('Debe seleccionar una opcion para avanzar');

        dispatch(setAction({ detail: option }))
        dispatch(toggleModal('ActionTime'));
    }

    return (
        <>
        {modal === 'ActionDetailGol' && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack onClick={handleBackModal}>
                            <HiArrowLeft/>
                            <p>Volver</p>
                    </ActionBack>
                    <IconClose>
                        <HiMiniXMark onClick={() => dispatch(toggleModal())}/>
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
                                        value="penal"
                                        checked={option === "penal"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="penal">Si</label>
                                </AssistOptContainer>
                            </OptionGolContainer>

                            <OptionGolContainer>
                                <h4>¿En contra?</h4>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="en_contra"
                                        value="en_contra"
                                        checked={option === "en_contra"}
                                        onChange={handleOptionChange}
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
                                value="asistencia"
                                checked={option === "asistencia" || option ===  selectedPlayer}
                                onChange={handleOptionChange}
                            />
                            <label htmlFor="asistencia">Si</label>
                        </AssistOptContainer>
                        <AssistOptContainer>
                            <input 
                                type="radio"
                                name="asistencia"
                                value="no_asistencia"
                                checked={option === "no_asistencia"}
                                onChange={handleOptionChange}
                            />
                            <label htmlFor="asistencia">No</label>    
                        </AssistOptContainer>
                        {(option === "asistencia" || option === selectedPlayer) && (
                            <Select2 
                                data={jugadoresMiEquipo}
                                placeHolder={"Seleccione un jugador"}
                                onSelect={handlePlayerSelect}
                            />
                        )}
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

export default ActionDetailGol;
