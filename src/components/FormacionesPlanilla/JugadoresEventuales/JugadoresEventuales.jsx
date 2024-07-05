import React, { useEffect, useState } from 'react'
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, IconClose, TitleInputContainer } from '../ActionConfirmed/ActionConfirmedStyles'
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles'
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { toggleHiddenPlayerEvent } from '../../../redux/Planillero/planilleroSlice';
import { addEventualPlayer, manageDorsal } from '../../../redux/Matches/matchesSlice';

const JugadoresEventuales = () => {

    const dispatch = useDispatch();
    const hiddenPlayer = useSelector((state) => state.planillero.playerEvent.hidden)
    const idCurrentTeam = useSelector((state) => state.planillero.playerEvent.idPlayerTeam)

    const [dorsalValue, setDorsalValue] = useState('');
    const [dniValue, setDniValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [surNameValue, setSurNameValue] = useState('');
    const [maxQuantityPlayers, setMaxQuantityPlayers] = useState(true);

    //Logica validar solo numeros DORSAL
    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    //Logica validar solo numeros DNI
    const handleInputChangeDni = (value) => {
        if (/^\d{0,8}$/.test(value) || value === '') {
            setDniValue(value);
        }
    };

    //Logica validar solo letras
    const handleInputName = (value) => {
        if (/^[a-zA-Z]*$/.test(value) || value === '') {
            setNameValue(value);
        }
    };

    //Logica validar solo letras
    const handleInputSurName = (value) => {
        if (/^[a-zA-Z]*$/.test(value) || value === '') {
            setSurNameValue(value);
        }
    };

    //Habilitar boton
    const isAnyValueEmpty = () => {
        return !dorsalValue.trim() || !dniValue.trim() || !nameValue.trim() || !surNameValue.trim();
    };

    //Repeticion del dorsal
    const initialState = useSelector((state) => state.match)
    const searchDorsal = (dorsal, dni) => {
        const currentTeam = initialState.find(team => team.ID === idCurrentTeam);
        if (!currentTeam) {
            return false;
        }
        
        const foundByDorsal = currentTeam.Player.some(player => player.Dorsal === dorsal);
        const foundByDNI = currentTeam.Player.some(player => player.DNI === dni);
    
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
    
//Verificar limite de jugadores eventuales
const checkMaxPlayersQuantity = () => {
    const currentTeam = initialState.find(team => team.ID === idCurrentTeam);
    if (currentTeam) {
        const eventualPlayersCounts = currentTeam.Player.filter(player => player.eventual).length;
        if (eventualPlayersCounts < 3) {
            setMaxQuantityPlayers(true) 
        } else {
            setMaxQuantityPlayers(false);
        }
    }
}

// Enviar info al redux
const handleNext = () => {
    if (isAnyValueEmpty()) {
        toast.error('Todos los campos son obligatorios');
        return;
    }

    const repeatType = searchDorsal(dorsalValue, dniValue);

    if (maxQuantityPlayers) {
            switch (repeatType) {
        case false:
            const newPlayer = {
                ID: (Math.random() * 10000).toFixed(0), // Generar id único (temporal)
                Nombre: `${nameValue}, ${surNameValue}`,
                DNI: dniValue,
                Dorsal: dorsalValue,
                status: true,
                eventual: true,
                Action: {
                    Type: '',
                    Time: '',
                }
            };

            dispatch(addEventualPlayer({ teamId: idCurrentTeam, player: newPlayer }));
            toast.success('Jugador eventual añadido');
            dispatch(toggleHiddenPlayerEvent())
            // Reset campos
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
        toast.error('Alcanzaste el limite de jugadores eventuales')
        setDorsalValue('');
        setDniValue('');
        setNameValue('');
        setSurNameValue('');
    }
    };

    // Verificar el límite de jugadores eventuales al renderizar
    useEffect(() => {
        checkMaxPlayersQuantity();
    }, [idCurrentTeam, initialState]);

return (
    <>
        {!hiddenPlayer && (
            <ActionConfirmedContainer>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack>
                            <HiArrowLeft onClick={() => dispatch(toggleHiddenPlayerEvent())}/>
                            <p>Volver</p>
                        </ActionBack>
                        <IconClose>
                            <HiMiniXMark  onClick={() => dispatch(toggleHiddenPlayerEvent())}/>
                        </IconClose>
                    </ActionBackContainer>
                    <ActionTitle>
                        <h3>Añadir jugadores eventuales</h3>
                        <AlignmentDivider/>
                    </ActionTitle>
                    <ActionsContainer className='large'>
                        <TitleInputContainer>
                            <p>Dorsal</p>
                            <Input2 
                            value={dorsalValue}
                            onValueChange={handleInputChange}
                            placeholder={'Indique dorsal'}/>
                        </TitleInputContainer>
                        <TitleInputContainer>
                            <p>DNI</p>
                            <Input2 
                            value={dniValue}
                            onValueChange={handleInputChangeDni}
                            placeholder={'Indique DNI'}/>
                        </TitleInputContainer>
                        <TitleInputContainer>
                            <p>Nombre</p>
                            <Input2 
                            value={nameValue}
                            onValueChange={handleInputName}
                            placeholder={'Indique nombre'}/>
                        </TitleInputContainer>
                        <TitleInputContainer>
                            <p>Apellido</p>
                            <Input2 
                            value={surNameValue}
                            onValueChange={handleInputSurName}
                            placeholder={'Indique apellido'}/>
                        </TitleInputContainer>
                    </ActionsContainer>
                    <ActionNext 
                    onClick={handleNext}
                    className={!isAnyValueEmpty() ? '' : 'disabled'}>
                        Añadir
                    </ActionNext>
                </ActionConfirmedWrapper>
                <Toaster/>
        </ActionConfirmedContainer>
        )
        }
    </>
)}

export default JugadoresEventuales