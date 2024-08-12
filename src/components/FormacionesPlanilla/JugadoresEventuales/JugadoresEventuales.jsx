import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setDisabledStateInfoPlayerEvent, toggleHiddenPlayerEvent } from '../../../redux/Planillero/planilleroSlice';
import { addEventualPlayer } from '../../../redux/Matches/matchesSlice';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose, TitleInputContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { Toaster, toast } from 'react-hot-toast';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';

const JugadoresEventuales = () => {
    const dispatch = useDispatch();
    const hiddenPlayer = useSelector((state) => state.planillero.playerEvent.hidden);
    const idCurrentTeam = useSelector((state) => state.planillero.playerEvent.idPlayerTeam);
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const matchState = useSelector((state) => state.match);
    const dataJugadorEventual = useSelector((state) => state.planillero.playerEventData);
    const jugadores = useSelector((state) => state.jugadores.data)
    const isEnabledEdit = useSelector((state) => state.planillero.playerEventData.state);
    const matchCorrecto = matchState.find((match) => match.ID === idPartido);
    const equipoCorrecto = matchCorrecto?.Local.id_equipo === idCurrentTeam ? matchCorrecto.Local : matchCorrecto.Visitante;

    const [dorsalValue, setDorsalValue] = useState('');
    const [dniValue, setDniValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [surNameValue, setSurNameValue] = useState('');
    const [maxQuantityPlayers, setMaxQuantityPlayers] = useState(true);
    const [bdEventual, setBdEventual] = useState([]);

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

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleInputName = (value) => {
        if (/^[a-zA-Z]*$/.test(value) || value === '') {
            setNameValue(capitalizeFirstLetter(value));
        }
    };

    const handleInputSurName = (value) => {
        if (/^[a-zA-Z]*$/.test(value) || value === '') {
            setSurNameValue(capitalizeFirstLetter(value));
        }
    };

    const isAnyValueEmpty = () => {
        return !dorsalValue?.trim() || !dniValue?.trim() || !nameValue?.trim() || !surNameValue?.trim();
    };
    
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

    const searchDorsal = (dorsal, dni, eventual) => {        
        if (!equipoCorrecto) return false;

        const players = isEnabledEdit
            ? equipoCorrecto.Player.filter(player => {
                return !eventual || player.Dorsal !== eventual.dorsal || player.DNI !== eventual.dni;
            })
            : equipoCorrecto.Player;

        const foundByDorsal = players.some(player => player.Dorsal === dorsal);
        const foundByDNI = players.some(player => player.DNI === dni);
        const foundByDNIForTeams = jugadores.some(player => player.dni === dni && player.eventual === 'N')

        if (foundByDorsal && foundByDNI) {
            return '1';
        } else if (foundByDorsal) {
            return '2';
        } else if (foundByDNI || foundByDNIForTeams) {
            return '3';
        } else {
            return false;
        }
    };

    const checkMaxPlayersQuantity = () => {
        if (equipoCorrecto) {
            const eventualPlayersCounts = equipoCorrecto.Player.filter(player => player.eventual === 'S').length;
            setMaxQuantityPlayers(eventualPlayersCounts < 3);
        }
    };

    const traerPartidosEventuales = async () => {
        try {
            const response = await Axios.get(`${URL}/user/get-partidos-eventuales`);
            const data = response.data;
            setBdEventual(data);
        } catch (error) {
            console.error('Error en la petición', error);
        }
    };

    useEffect(() => {
        dispatch(fetchJugadores());
    }, []);
    
    useEffect(() => {
        traerPartidosEventuales();
    }, []);
    
    const verificarJugador = (dni) => {
        // Verificar si el DNI ya existe en jugadores regulares (no eventuales) del equipo actual
        const jugadorExistenteRegular = jugadores.find(
            (jugador) => jugador.DNI === dni && jugador.eventual === 'N'
        );
    
        if (jugadorExistenteRegular) {
            toast.error('El jugador ya existe en jugadores regulares (no eventuales) del equipo actual');
            return false;
        }
    
        // Verificar si el DNI ya ha sido agregado como eventual en el equipo contrario en el mismo partido
        const equipoContrario = matchCorrecto.Local.id_equipo === idCurrentTeam
            ? matchCorrecto.Visitante
            : matchCorrecto.Local;
    
        const jugadorExistenteEnOtroEquipo = equipoContrario.Player.find(
            (jugador) => jugador.DNI === dni && jugador.eventual === 'S'
        );
    
        if (jugadorExistenteEnOtroEquipo) {
            toast.error('El jugador eventual ya está registrado en el equipo rival');
            return false;
        }
    
        // Verificar si el jugador tiene menos de 3 partidos eventuales jugados en la temporada actual
        const jugadorEventualEnTemporada = bdEventual.filter((j) => 
            j.dni === dni && j.id_equipo === idCurrentTeam
        );
        
        if (jugadorEventualEnTemporada.length >= 3) {
            toast.error('El jugador ya jugo sus 3 partidos correspondientes como eventual');
            return false;
        }

        if (jugadorEventualEnTemporada.length = 2) {
            toast('Ultimo partido como eventual para este jugador', {
                icon: `⚠️`,
                duration: 4000,
            });
        }
    
        return true;
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
                    const jugadorApto = verificarJugador(dniValue);
                    if (!jugadorApto) {
                        setDorsalValue('');
                        setDniValue('');
                        setNameValue('');
                        setSurNameValue('');
                        break;
                    }
    
                    let jugadorExistente = bdEventual.find(jugador => jugador.dni === dniValue);
                    let newPlayer;
    
                    if (jugadorExistente) {
                        newPlayer = {
                            ID: jugadorExistente.id_jugador,
                            Nombre: `${jugadorExistente.nombre} ${jugadorExistente.apellido}`,
                            DNI: jugadorExistente.dni,
                            Dorsal: dorsalValue,
                            status: true,
                            eventual: 'S',
                        };
                    } else {
                        newPlayer = {
                            ID: parseInt((Math.random() * 10000).toFixed(0)),
                            Nombre: `${nameValue} ${surNameValue}`,
                            DNI: dniValue,
                            Dorsal: dorsalValue,
                            status: true,
                            eventual: 'S',
                        };
                    }
                    dispatch(addEventualPlayer({ idPartido: idPartido, teamId: idCurrentTeam, player: newPlayer }));
                    dispatch(setDisabledStateInfoPlayerEvent());
                    dispatch(toggleHiddenPlayerEvent());
                    toast.success(isEnabledEdit ? 'Jugador eventual actualizado' : 'Jugador eventual creado');
    
                    // Limpiamos inputs
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
                                    placeholder={'Ingrese el Dorsal'}
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>DNI</p>
                                <Input2
                                    value={dniValue}
                                    onValueChange={handleInputChangeDni}
                                    placeholder={'Ingrese el DNI'}
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>Nombre</p>
                                <Input2
                                    value={nameValue}
                                    onValueChange={handleInputName}
                                    placeholder={'Ingrese el Nombre'}
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>Apellido</p>
                                <Input2
                                    value={surNameValue}
                                    onValueChange={handleInputSurName}
                                    placeholder={'Ingrese el Apellido'}
                                />
                            </TitleInputContainer>
                        </ActionsContainer>
                        <ActionNext onClick={handleNext}>
                            {isEnabledEdit ? 'Actualizar' : 'Añadir'}
                        </ActionNext>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
        </>
    )
}

export default JugadoresEventuales;
