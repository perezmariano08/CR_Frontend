import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, ErrorTextContainer, TextContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { closeModal } from '../../../redux/Planillero/planilleroSlice';
import { checkPartidosEventual, firmaJugador, getEdicion } from '../../../utils/dataFetchers';
import { useWebSocket } from '../../../Auth/WebSocketContext';
import useFetch from '../../../hooks/useFetch';

const EditDorsal = ({ id_partido, formaciones, id_edicion }) => {

    const dispatch = useDispatch();
    const socket = useWebSocket();

    const modal = useSelector((state) => state.planillero.modal);
    const jugador = useSelector((state) => state.planillero.jugador);
    const isEdit = jugador?.dorsal !== null;

    const [dorsalValue, setDorsalValue] = useState(isEdit ? jugador?.dorsal : '');
    const [partidosJugados, setPartidosJugados] = useState(0);

    const { data: fetchEdicion, loading: loadingEdicion, error: errorEdicion } = useFetch(getEdicion, id_edicion);
    const edicion = fetchEdicion?.[0];

    useEffect(() => {
        setDorsalValue(jugador?.dorsal || '');
    }, [jugador?.dorsal]);
    
    //handlers modal
    const handleCloseModal = () => {
        setDorsalValue('');
        dispatch(closeModal());
    }

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            handleCloseModal();
            setDorsalValue('');
        }
    };

    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    const [loading, setLoading] = useState(false);
    
    const dorsalInUse = formaciones?.filter((f) => f.id_equipo === jugador?.id_equipo && f.dorsal !== null);
    const isNotEditDorsalPlayer = jugador?.dorsal === dorsalValue;

    const handleConfirm = async () => {
        if (isNotEditDorsalPlayer) {
            dispatch(closeModal());
            return;
        }

        if (partidosJugados >= edicion.partidos_eventuales) {
            toast.error('No puedes asignar el dorsal porque el jugador llegó a la cantidad máxima de partidos eventuales permitidos');
            return;
        }

        try {
            setLoading(true);
            //verificar que el dorsal no este en uso
            const isDorsalInUse = dorsalInUse.some((f) => +f.dorsal === +dorsalValue);
            if (isDorsalInUse) {
                toast.error('Dorsal existente, por favor ingrese otro');
                setDorsalValue('');
                return;
            } 
    
            //emitir el dorsal a la base
            firmaJugador(id_partido, jugador.id_jugador, dorsalValue)
    
            //emitir websocket
            socket.emit('dorsalAsignado', { id_partido, id_jugador: jugador.id_jugador, dorsal: dorsalValue });
    

            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar el dorsal en la base de datos:', error);
            toast.error('Error al guardar el dorsal, intente nuevamente');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const checkPartidos = async () => {
            const data = await checkPartidosEventual(id_partido, jugador.dni);
            setPartidosJugados(data.partidos_jugados);
        }
        checkPartidos();
    }, []);
    
    return (
        <>
            {modal === 'EditDorsal' && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBack>
                            <HiArrowLeft onClick={handleCloseModal} />
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                        <h3>
                            {!isEdit ? 'Asignar dorsal al jugador ' : 'Editar dorsal al jugador '}
                            <span style={{ color: 'var(--green)', fontWeight: '600' }}>
                                {jugador.nombre} {jugador.apellido}
                            </span>
                        </h3>

                            <AlignmentDivider />
                        </ActionTitle>
                        <ActionsContainer>
                            {
                                jugador.eventual === 'S' && (
                                    <ErrorTextContainer>
                                        <h3>Partidos jugados como eventual: <span>{partidosJugados} / {edicion?.partidos_eventuales} </span></h3>
                                    </ErrorTextContainer>
                                )
                            }
                            <TextContainer>
                                <h4>Dorsal</h4>
                            </TextContainer>
                            <Input2
                                placeholder={"ej: 10"}
                                value={dorsalValue}
                                onValueChange={handleInputChange}
                                numeric={true}
                            />
                        </ActionsContainer>
                        <ActionNext
                            className={!dorsalValue || loading ? 'disabled' : ''}
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Confirmar'}
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
            <Toaster />
        </>
    );
};

export default EditDorsal;
