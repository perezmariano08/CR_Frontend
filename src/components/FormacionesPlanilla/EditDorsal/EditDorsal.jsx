import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, ErrorTextContainer, TextContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi2";
import { HiMiniExclamationTriangle } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { toggleHiddenDorsal } from '../../../redux/Planillero/planilleroSlice';
import { useWebSocket } from '../../../Auth/WebSocketContext';
import axios from 'axios';
import { URL } from '../../../utils/utils';

const EditDorsal = ({ formaciones, setBdFormaciones }) => {
    const dispatch = useDispatch();
    const socket = useWebSocket();

    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const idEquipoSeleccionado = useSelector((state) => state.planillero.playerEvent.idPlayerTeam);
    const hiddenDorsal = useSelector((state) => state.planillero.dorsal.hidden);
    const playerSelected = useSelector((state) => state.planillero.dorsal.playerSelected);
    const playerNameSelected = useSelector((state) => state.planillero.dorsal.playerSelectedName);
    const dorsalPlayer = useSelector((state) => state.planillero.planilla.dorsalPlayer)

    const [dorsalValue, setDorsalValue] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Estado para manejar el loading

    useEffect(() => {
        // Si se recibe un dorsal desde el state, lo asignamos
        if (dorsalPlayer) {
            setDorsalValue(dorsalPlayer);
        } else {
            setDorsalValue(''); // Si no, lo dejamos vacío
        }
    }, [dorsalPlayer]);

    const toggleEditDorsal = () => {
        dispatch(toggleHiddenDorsal());
        setDorsalValue('');
    };

    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    const isDorsalInUse = (playerId, numero) => {
        const dorsal = parseInt(numero);
        if (!dorsal) return false;
    
        return formaciones.some(otherPlayer => 
            otherPlayer.dorsal === dorsal && 
            otherPlayer.id_jugador !== playerId && 
            otherPlayer.id_equipo === idEquipoSeleccionado
        );
    };

    const handleConfirm = async () => {
        if (playerSelected !== null) {
            if (isDorsalInUse(playerSelected, dorsalValue)) {
                setError(true);
                toast.error('Dorsal existente, por favor ingrese otro');
                setDorsalValue('');
            } else {
                try {
                    // Actualizar localmente las formaciones inmediatamente
                    setBdFormaciones(prevFormaciones =>
                        prevFormaciones.map(player =>
                            player.id_jugador === playerSelected
                                ? { ...player, dorsal: dorsalValue }
                                : player
                        )
                    );
    
                    setLoading(true); // Activar el loading
                    const loadingToastId = toast.loading('Procesando...'); // Mostrar el loading toast
    
                    // Enviar la petición al servidor
                    const response = await axios.post(`${URL}/user/firma-jugador`, { idPartido, idJugador: playerSelected, dorsal: dorsalValue });
    
                    // Emitir el cambio de dorsal por WebSocket
                    socket.emit('dorsalAsignado', { idPartido, idJugador: playerSelected, dorsal: dorsalValue });
    
                    toast.dismiss(loadingToastId); // Cerrar el loading
                    toast.success('Dorsal agregado con éxito');
                    dispatch(toggleHiddenDorsal());
                    setDorsalValue('');
                } catch (error) {
                    console.error('Error al guardar el dorsal en la base de datos:', error);
                    toast.error('Error al guardar el dorsal, intente nuevamente');
                } finally {
                    setLoading(false); // Desactivar el loading
                }
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
                            <h3>Asignar dorsal al jugador <span style={{ color: 'var(--green)', fontWeight: '600' }}>{playerNameSelected}</span></h3>
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
                                numeric={true}
                            />
                        </ActionsContainer>
                        <ActionNext
                            className={!dorsalValue || (typeof dorsalValue === 'string' && !dorsalValue.trim()) || loading ? 'disabled' : ''}
                            onClick={handleConfirm}
                            disabled={loading} // Desactivar el botón si está en loading
                        >
                            {loading ? 'Procesando...' : 'Confirmar'} {/* Cambiar el texto del botón */}
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
            <Toaster />
        </>
    );
};

export default EditDorsal;
