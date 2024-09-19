import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setDisabledStateInfoPlayerEvent, toggleHiddenPlayerEvent } from '../../../redux/Planillero/planilleroSlice';
import { addEventualPlayer } from '../../../redux/Matches/matchesSlice';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose, SelectEventual, TitleInputContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { toast, LoaderIcon } from 'react-hot-toast';
import userJugadorEventualStates from '../../../hooks/userJugadorEventualStates';
import useJugadorEventual from '../../../hooks/useJugadorEventual';

const JugadoresEventuales = () => {
    const dispatch = useDispatch();
    const hiddenPlayer = useSelector((state) => state.planillero.playerEvent.hidden);
    const idCurrentTeam = useSelector((state) => state.planillero.playerEvent.idPlayerTeam);
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const matchState = useSelector((state) => state.match);
    const dataJugadorEventual = useSelector((state) => state.planillero.playerEventData);
    const isEnabledEdit = useSelector((state) => state.planillero.playerEventData.state);
    const matchCorrecto = matchState.find((match) => match.ID === idPartido);
    const equipoCorrecto = matchCorrecto?.Local.id_equipo === idCurrentTeam ? matchCorrecto.Local : matchCorrecto.Visitante;

    const [loading, setLoading] = useState();
    const [loadingDni, setLoadingDni] = useState(false);
    const [foundPlayer, setFoundPlayer] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [originalDni, setOriginalDni] = useState('');

    const {
        dorsalValue,
        setDorsalValue,
        dniValue,
        setDniValue,
        nameValue,
        setNameValue,
        surNameValue,
        setSurNameValue,
        handleInputChange,
        handleInputChangeDni,
        handleInputName,
        handleInputSurName,
        isAnyValueEmpty,
        validateFields,
        capitalizeFirstLetter
    } = userJugadorEventualStates();
    
    const {
        generateId,
        searchDorsal,
        checkMaxPlayersQuantity,
        verificarJugador,
        jugadoresEventualesEquipo,
        maxQuantityPlayers,
        bdEventual,
        checkPlayerExists,
    } = useJugadorEventual();

    useEffect(() => {
        if (dataJugadorEventual && isEnabledEdit) {
            setDorsalValue(dataJugadorEventual.dorsal);
            setDniValue(dataJugadorEventual.dni);
            setNameValue(dataJugadorEventual.nombre);
            setSurNameValue(dataJugadorEventual.apellido);
        } else {
            setDorsalValue('');
            setDniValue('');
            setNameValue('');
            setSurNameValue('');
        }
    }, [dataJugadorEventual]);
    
    const handleNext = async () => {
        setLoading(true);
    
        if (isAnyValueEmpty()) {
            toast.error('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }
    
        const trimmedDorsal = dorsalValue.trim();
        const trimmedDni = dniValue.trim();
        const trimmedName = capitalizeFirstLetter(nameValue.trim());
        const trimmedSurName = capitalizeFirstLetter(surNameValue.trim());
    
        // Validate the fields
        if (!validateFields()) {
            setLoading(false);
            return;
        }
    
        const repeatType = await searchDorsal(trimmedDorsal, trimmedDni, dataJugadorEventual);
        const isEditing = isEnabledEdit;
    
        if (maxQuantityPlayers || isEditing) {
            switch (repeatType) {
                case false:
                    const jugadorApto = await verificarJugador(trimmedDni);
                    
                    if (!jugadorApto) {
                        setDorsalValue('');
                        setDniValue('');
                        setNameValue('');
                        setSurNameValue('');
                        setLoading(false);
                        return;
                    }
                    
                    //! Corroborar ambos casos!! 
                    let eventualExistente = bdEventual.find(jugador => jugador.dni === trimmedDni)
                    let regularExistente = foundPlayer.found && !foundPlayer.matchCategory ? foundPlayer.jugador : null

                    if (eventualExistente?.sancionado === 'S' || regularExistente?.sancionado === 'S')  {
                        setLoading(false);
                        return toast.error('El jugador esta sancionado')
                    }
                    
                    let jugadorExistente = eventualExistente ? eventualExistente : regularExistente;
                    let newPlayer;
                    
                    if (jugadorExistente) {
                        newPlayer = {
                            ID: jugadorExistente.id_jugador,
                            Nombre: `${jugadorExistente.nombre} ${jugadorExistente.apellido}`,
                            DNI: trimmedDni,
                            Dorsal: trimmedDorsal,
                            status: true,
                            eventual: 'S',
                        };
                    } else {
                        newPlayer = {
                            ID: generateId(),
                            Nombre: `${trimmedName} ${trimmedSurName}`,
                            DNI: trimmedDni,
                            Dorsal: trimmedDorsal,
                            status: true,
                            eventual: 'S',
                        };
                    }
                    
                    dispatch(addEventualPlayer({ idPartido: idPartido, teamId: idCurrentTeam, player: newPlayer }));
                    dispatch(setDisabledStateInfoPlayerEvent());
                    dispatch(toggleHiddenPlayerEvent());
                    toast.success(isEnabledEdit ? 'Jugador eventual actualizado' : 'Jugador eventual creado');
                    setLoading(false);
    
                    // Limpiamos inputs
                    setDorsalValue('');
                    setDniValue('');
                    setNameValue('');
                    setSurNameValue('');
                    break;
                case '1':
                    setLoading(false);
                    toast.error('DNI y Dorsal ya existentes');
                    break;
                case '2':
                    setLoading(false);
                    toast.error('Dorsal existente');
                    break;
                case '3':
                    setLoading(false);
                    toast.error('DNI existente');
                    break;
                default:
                    break;
            }
        } else {
            toast.error('Alcanzaste el límite de jugadores eventuales');
            setDorsalValue('');
            setDniValue('');
            setNameValue('');
            setSurNameValue('');
        }
    };
    
    useEffect(() => {
        checkMaxPlayersQuantity();
    }, [equipoCorrecto]);

    const closeModal = () => {
        dispatch(setDisabledStateInfoPlayerEvent());
        dispatch(toggleHiddenPlayerEvent());
    };
    
    // Función que maneja la selección de un jugador en el Select
    const handlePlayerSelect = (event) => {
        const selectedPlayerId = event.target.value;
        setSelectedPlayer(selectedPlayerId); // Guardamos la selección del jugador
        const selectedPlayer = jugadoresEventualesEquipo.find(player => player.id_jugador == selectedPlayerId);
        
        if (selectedPlayer) {
            setNameValue(selectedPlayer.nombre || '');
            setSurNameValue(selectedPlayer.apellido || '');
            setDniValue(selectedPlayer.dni || '');
            setDorsalValue(selectedPlayer.dorsal || '');
            setIsDisabled(true); // Bloqueamos los campos de nombre y apellido
        } else {
            setDorsalValue('');
            setDniValue('');
            setNameValue('');
            setSurNameValue('');
            setIsDisabled(false); // Desbloqueamos si no hay selección
        }
    };

    const handleDniBlur = async () => {
        if (dniValue.trim()) {
            setLoadingDni(true);
            try {
                const playerExists = await checkPlayerExists(dniValue.trim(), parseInt(equipoCorrecto.id_equipo));
                
                if (playerExists.found) {
                    setIsDisabled(true);
                    if (playerExists.matchCategory) {
                        setFoundPlayer(playerExists);
                        setNameValue(playerExists.jugador.nombre);
                        setSurNameValue(playerExists.jugador.apellido);
                        toast.error('El jugador ya existe en esta categoría');
                    } else {
                        setFoundPlayer(playerExists);
                        setNameValue(playerExists.jugador.nombre);
                        setSurNameValue(playerExists.jugador.apellido);
                    }
                } else {
                    setIsDisabled(false);
                    setFoundPlayer({});
                }
            } catch (error) {
                console.error('Error checking player:', error);
            }
            setLoadingDni(false);
        }
    };

    // Función que maneja el cambio de DNI
    const handleDniChange = (value) => {
        handleInputChangeDni(value);
        setIsDisabled(false); // Desbloquear campos de nombre y apellido si se modifica el DNI
        setFoundPlayer({});
        setSelectedPlayer(''); // Volvemos a la posición inicial del Select
    };

    return (
        <>
            {!hiddenPlayer && (
                <ActionConfirmedContainer>
                    <ActionConfirmedWrapper>
                        <ActionBackContainer>
                            <ActionBack>
                                <HiArrowLeft onClick={closeModal} />
                                <p>Volver</p>
                            </ActionBack>
                            <IconClose>
                                <HiMiniXMark onClick={closeModal} />
                            </IconClose>
                        </ActionBackContainer>
                        <ActionTitle>
                            <h3>Añadir jugadores eventuales</h3>
                            <AlignmentDivider />
                        </ActionTitle>
                        <ActionsContainer className='large'>
                            <TitleInputContainer>
                                <p>J.E existentes</p>
                                <SelectEventual onChange={handlePlayerSelect}>
                                    <option value="">Seleccione un jugador</option>
                                    {jugadoresEventualesEquipo.map(player => (
                                        <option key={player.id_jugador} value={player.id_jugador}>
                                            {`${player.nombre} ${player.apellido}`}
                                        </option>
                                    ))}
                                </SelectEventual>
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>Dorsal</p>
                                <Input2
                                    value={dorsalValue}
                                    onValueChange={handleInputChange}
                                    placeholder={'Ingrese el Dorsal'}
                                    numeric={true}
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>DNI</p>
                                <Input2
                                    value={dniValue}
                                    onValueChange={handleDniChange}
                                    placeholder={'Ingrese el DNI'}
                                    onBlur={handleDniBlur}
                                    numeric={true}
                                    loading={loadingDni}
                                    error={foundPlayer.matchCategory} // Condición de error cuando exista un problema con el jugador
                                    success={!foundPlayer.matchCategory} // Condición de éxito si no hay problema con el jugador
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                            <p>Nombre</p>
                            <Input2
                                label="Nombre"
                                value={nameValue}
                                onValueChange={handleInputName}
                                placeholder={'Ingrese el nombre'}
                                disabled={isDisabled}
                                // success={foundPlayer ? !foundPlayer.matchCategory : ''}
                            />
                        </TitleInputContainer>
                        <TitleInputContainer>
                            <p>Apellido</p>
                            <Input2
                                label="Apellido"
                                value={surNameValue}
                                onValueChange={handleInputSurName}
                                placeholder={'Ingrese el apellido'}
                                disabled={isDisabled}
                                // success={foundPlayer ? !foundPlayer.matchCategory : ''}
                            />
                        </TitleInputContainer>
                        </ActionsContainer>
                        <ActionNext
                            onClick={handleNext}
                            className={foundPlayer.matchCategory || loading ? 'disabled' : '' || loadingDni ? 'disabled' : ''}
                        >
                            {loading ? <LoaderIcon /> : 'Siguiente'}
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
        </>
    )
}

export default JugadoresEventuales;