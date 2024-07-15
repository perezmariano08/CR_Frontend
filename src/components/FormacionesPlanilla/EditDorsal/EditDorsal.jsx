import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, ErrorTextContainer, TextContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi2";
import { HiMiniExclamationTriangle } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { toggleHiddenDorsal } from '../../../redux/Planillero/planilleroSlice';
import { manageDorsal } from '../../../redux/Matches/matchesSlice';

const EditDorsal = () => {
    const dispatch = useDispatch();
    
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const idEquipoSeleccionado = useSelector((state) => state.planillero.playerEvent.idPlayerTeam);
    const matchState = useSelector((state) => state.match);
    const matchCorrecto = matchState.find((match) => match.ID === idPartido);
    const equipoCorrecto = matchCorrecto ? (matchCorrecto.Local.id_equipo === idEquipoSeleccionado ? matchCorrecto.Local : matchCorrecto.Visitante) : null;

    const hiddenDorsal = useSelector((state) => state.planillero.dorsal.hidden);
    const playerSelected = useSelector((state) => state.planillero.dorsal.playerSelected);
    const playerNameSelected = useSelector((state) => state.planillero.dorsal.playerSelectedName);

    const [dorsalValue, setDorsalValue] = useState('');
    const [error, setError] = useState(null);

    const toggleEditDorsal = () => {
        dispatch(toggleHiddenDorsal());
        setDorsalValue('');
    };

    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    const isDorsalInUse = (playerId, dorsal) => {
        if (!equipoCorrecto) return false;
        return equipoCorrecto.Player.some(otherPlayer => otherPlayer.Dorsal === dorsal && otherPlayer.ID !== playerId);
    };

    const handleConfirm = () => {
        if (playerSelected !== null) {
            if (isDorsalInUse(playerSelected, dorsalValue)) {
                setError(true);
                toast.error('Dorsal existente, ingrese otro');
                setDorsalValue('');
            } else {
                dispatch(manageDorsal({ playerId: playerSelected, dorsal: dorsalValue, assign: true }));
                dispatch(toggleHiddenDorsal());
                setDorsalValue('');
            }
        }
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            toggleEditDorsal();
        }
    };

    useEffect(() => {
        if (hiddenDorsal) {
            setError(null);
        }
    }, [hiddenDorsal]);

    return (
        <>
            {!hiddenDorsal && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBack>
                            <HiArrowLeft onClick={toggleEditDorsal} />
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                            <h3>Asignar dorsal al jugador {playerNameSelected}</h3>
                            <AlignmentDivider />
                        </ActionTitle>
                        <ActionsContainer>
                            <TextContainer>
                                <h4>Dorsal</h4>
                                {error && (
                                    <ErrorTextContainer>
                                        <HiMiniExclamationTriangle />
                                        <p>Dorsal existente. Por favor, ingrese otro.</p>
                                    </ErrorTextContainer>
                                )}
                            </TextContainer>
                            <Input2
                                placeholder={"ej: 10"}
                                value={dorsalValue}
                                onValueChange={handleInputChange}
                            />
                        </ActionsContainer>
                        <ActionNext
                            className={!dorsalValue.trim() ? 'disabled' : ''}
                            onClick={handleConfirm}>
                            Confirmar
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
            <Toaster />
        </>
    );
};

export default EditDorsal;
