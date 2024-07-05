import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';

import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, ErrorTextContainer, TextContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi2";
import { HiMiniExclamationTriangle } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';

import { toggleHiddenDorsal } from '../../../redux/Planillero/planilleroSlice'
import { manageDorsal} from '../../../redux/Matches/matchesSlice';

const EditDorsal = () => {

    //Open Close
    const dispatch = useDispatch();
    const hiddenDorsal = useSelector((state) => state.planillero.dorsal.hidden);
    
    const toggleEditDorsal = () => {
        dispatch(toggleHiddenDorsal())
        setDorsalValue('')
    }
    
    //Estado para manejar numero
    const playerSelected = useSelector((state) => state.planillero.dorsal.playerSelected);
    const [dorsalValue, setDorsalValue] = useState('');

    //Nombre del jugador seleccionado
    const playerNameSelected = useSelector((state) => state.planillero.dorsal.playerSelectedName);
    
    //Logica validar solo numeros
    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    //Repeticion de dorsal
    const [error, setError] = useState(null);
    const initialState = useSelector((state) => state.match)
    const isDorsalInUse = (playerId, dorsal) => {
        const team = initialState.find(team => team.Player.some(player => player.ID === playerId));
        return team.Player.some(player => player.Dorsal === dorsal);
    };

    //Mandar al store del partido el numero y el id del jugador seleccionado
    const handleConfirm = () => {
        if (playerSelected !== null) {
                if (isDorsalInUse(playerSelected, dorsalValue)) {
                    setError(true)
                    toast.error('Dorsal existente, ingrese otro')
                    setDorsalValue('');
                } else {
                    dispatch(manageDorsal({ playerId: playerSelected, dorsal: dorsalValue, assign: true  }))
                    dispatch(toggleHiddenDorsal());
                    setDorsalValue('');
                }
        }
    };

    //Cerrar componente clickeando en el overlay
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            toggleEditDorsal();
        }
    };

    //Mostrar error textual cuando se repite dorsal
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
                            <HiArrowLeft onClick={toggleEditDorsal}/>
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                            <h3>Asignar dorsal al jugador {playerNameSelected}</h3>
                            <AlignmentDivider/>
                        </ActionTitle>
                        <ActionsContainer>
                            <TextContainer>
                                <h4>Dorsal</h4>
                                {
                                    error && (
                                    <ErrorTextContainer>
                                    <HiMiniExclamationTriangle/>
                                        <p>Dorsal existente. Por favor, ingrese otro.</p>
                                    </ErrorTextContainer>
                                    )
                                }
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
            <Toaster/>
        </>
    );
}

export default EditDorsal;
