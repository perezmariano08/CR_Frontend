import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setDisabledStateInfoPlayerEvent, setInfoPlayerEvent, toggleHiddenPlayerEvent } from '../../../redux/Planillero/planilleroSlice';
import { addEventualPlayer } from '../../../redux/Matches/matchesSlice';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose, TitleInputContainer } from '../ActionConfirmed/ActionConfirmedStyles'
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles'
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { Toaster, toast } from 'react-hot-toast';

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

    const [dorsalValue, setDorsalValue] = useState('');
    const [dniValue, setDniValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [surNameValue, setSurNameValue] = useState('');
    const [maxQuantityPlayers, setMaxQuantityPlayers] = useState(true);

    useEffect(() => {
        if (dataJugadorEventual && isEnabledEdit) {
            setDorsalValue(dataJugadorEventual.dorsal);
            setDniValue(dataJugadorEventual.dni);
            setNameValue(dataJugadorEventual.nombre);
            setSurNameValue(dataJugadorEventual.apellido);
        }
    }, [dataJugadorEventual]);

    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    const handleInputChangeDni = (value) => {
        if (/^\d{0,8}$/.test(value) || value === '') {
            setDniValue(value);
        }
    };

    const handleInputName = (value) => {
        if (/^[a-zA-Z]*$/.test(value) || value === '') {
            setNameValue(value);
        }
    };

    const handleInputSurName = (value) => {
        if (/^[a-zA-Z]*$/.test(value) || value === '') {
            setSurNameValue(value);
        }
    };

    const isAnyValueEmpty = () => {
        return !dorsalValue?.trim() || !dniValue?.trim() || !nameValue?.trim() || !surNameValue?.trim();
    };
    
    const searchDorsal = (dorsal, dni, eventual) => {
        if (!equipoCorrecto) return false;
    
        const players = isEnabledEdit
            ? equipoCorrecto.Player.filter(player => {
                return !eventual || player.Dorsal !== eventual.dorsal || player.DNI !== eventual.dni;
            })
            : equipoCorrecto.Player;
    
        const foundByDorsal = players.some(player => player.Dorsal === dorsal);
        const foundByDNI = players.some(player => player.DNI === dni);
    
        if (foundByDorsal && foundByDNI) {
            return '1';
        } else if (foundByDorsal) {
            return '2';
        } else if (foundByDNI) {
            return '3';
        } else {
            return false;
        }
    };
    
    const checkMaxPlayersQuantity = () => {
        if (equipoCorrecto) {
            const eventualPlayersCounts = equipoCorrecto.Player.filter(player => player.eventual).length;
            setMaxQuantityPlayers(eventualPlayersCounts < 3);
        }
    };

    const handleNext = () => {

        if (isAnyValueEmpty()) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        const repeatType = searchDorsal(dorsalValue, dniValue, dataJugadorEventual);

        if (maxQuantityPlayers) {
            switch (repeatType) {
                case false:
                    const newPlayer = {
                        ID: parseInt((Math.random() * 10000).toFixed(0)),
                        Nombre: `${nameValue}, ${surNameValue}`,
                        DNI: dniValue,
                        Dorsal: dorsalValue,
                        status: true,
                        eventual: true,
                    };

                    dispatch(addEventualPlayer({ teamId: idCurrentTeam, player: newPlayer }));
                    dispatch(setDisabledStateInfoPlayerEvent());
                    dispatch(toggleHiddenPlayerEvent());
                    toast.success(isEnabledEdit ? 'Jugador eventual actualizado' : 'Jugador eventual creado');

                    //Limpiamos inputs
                    setDorsalValue('');
                    setDniValue('');
                    setNameValue('');
                    setSurNameValue('');
                    break;
                case '1':
                    toast.error('DNI y Dorsal ya existentes');
                    break;
                case '2':
                    toast.error('Dorsal existente');
                    break;
                case '3':
                    toast.error('DNI existente');
                    break;
                default:
                    break;
            }
        } else {
            toast.error('Alcanzaste el limite de jugadores eventuales');
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
        dispatch(toggleHiddenPlayerEvent())
    }

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
                                <p>Dorsal</p>
                                <Input2
                                    value={dorsalValue}
                                    onValueChange={handleInputChange}
                                    placeholder={'Indique dorsal'} />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>DNI</p>
                                <Input2
                                    value={dniValue}
                                    onValueChange={handleInputChangeDni}
                                    placeholder={'Indique DNI'} />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>Nombre</p>
                                <Input2
                                    value={nameValue}
                                    onValueChange={handleInputName}
                                    placeholder={'Indique nombre'} />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>Apellido</p>
                                <Input2
                                    value={surNameValue}
                                    onValueChange={handleInputSurName}
                                    placeholder={'Indique apellido'} />
                            </TitleInputContainer>
                        </ActionsContainer>
                        <ActionNext
                            onClick={handleNext}
                            className={!isAnyValueEmpty() ? '' : 'disabled'}>
                            {
                                isEnabledEdit ? 'Actualizar' : 'Crear'
                            }
                        </ActionNext>
                    </ActionConfirmedWrapper>
                    <Toaster />
                </ActionConfirmedContainer>
            )}
        </>
    );
}

export default JugadoresEventuales;
