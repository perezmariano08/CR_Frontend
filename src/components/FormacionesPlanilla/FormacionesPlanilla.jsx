import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormacionesPlanillaTitle, FormacionesPlanillaWrapper, PlanillaButtons, PlayerEventContainer, TablePlanillaWrapper } from './FormacionesPlanillaStyles';
import { AlignmentDivider } from '../Stats/Alignment/AlignmentStyles';
import EscudoCelta from '/Escudos/celta-de-vino.png';
import EscudoPuraQuimica from '/Escudos/pura-quimica.png';
import { HiMiniPencil, HiOutlineXCircle } from "react-icons/hi2";

import { setNamePlayer, setPlayerSelected, setPlayerSelectedAction, setdorsalPlayer, toggleHiddenAction, toggleHiddenDorsal, setIsLocalTeam, setNamePlayerSelected, toggleHiddenModal, setCurrentStateModal, setCurrentDorsalDelete, setCurrentIdDorsalDelete, setCurrentCurrentTeamPlayerDelete, handleTeamPlayer, toggleHiddenPlayerEvent } from '../../redux/Planillero/planilleroSlice';
import { Toaster, toast } from 'react-hot-toast';

const FormacionesPlanilla = () => {
    const dispatch = useDispatch();
    const [activeButton, setActiveButton] = useState('local');
    const initialState = useSelector((state) => state.match) || [];
    const [initialized, setInitialized] = useState(false);

    //Logica para cargar por defecto el id del equipo local
    useEffect(() => {
        // Verificar si initialState tiene algún equipo local
        const selectedTeam = initialState.find(team => team.Local === true);
        if (!initialized && selectedTeam) {
            // Establecer el equipo local solo en la primera renderización
            setActiveButton('local');
            dispatch(handleTeamPlayer(selectedTeam.ID));
            setInitialized(true);
        }
    }, [initialState, initialized, dispatch]);

    //Mandar id del jugador donde se quiere agregar
    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
        const selectedTeam = initialState.find(team => team.Local === (buttonType === 'local'));
        if (selectedTeam) {
        dispatch(handleTeamPlayer(selectedTeam.ID))
        }
    };

    //Logica toggle local-visita
    const matchState = useSelector((state) => state.match);
    const currentTeam = activeButton === 'local' ? matchState.find(team => team.Local === true) : matchState.find(team => team.Local === false);

    // Enviar ID del jugador seleccionado , Dorsal, Nombre y definir localia
    const [selectedPlayerIdAction, setSelectedPlayerIdAction] = useState(''); 
    const [playerDorsal, setPlayerDorsal] = useState('')
    const [playerName, setPlayerName] = useState('')

    const handleNext = (playerID, playerDorsal, namePlayer) => {
        setSelectedPlayerIdAction(playerID)
        dispatch(setPlayerSelectedAction(playerID))

        setPlayerDorsal(playerDorsal)
        dispatch(setdorsalPlayer(playerDorsal))

        setPlayerName(namePlayer)
        dispatch(setNamePlayer(namePlayer))

        // Definir si el equipo es local o visitante
        dispatch(setIsLocalTeam(activeButton === 'local'));

        dispatch(toggleHiddenAction());
    }

    //Seleccionar jugador mediante click en edit
    const [selectedPlayerId, setSelectedPlayerId] = useState(''); 

    // Función para manejar el clic en el lápiz y abrir el componente EditDorsal
    const handleEditDorsal = (playerId, playerName) => {
        setSelectedPlayerId(playerId);
        dispatch(setPlayerSelected(playerId))
        dispatch(setNamePlayerSelected(playerName))
        dispatch(toggleHiddenDorsal());
    };

    //Verificar que el estado del partido sea el correcto para hacer accion
    const stateMatch = useSelector((state) => state.planillero.timeMatch.matchState)
    
    //Eliminar dorsal del jugador seleccionado
    const DeleteDorsalPlayer = (dorsal, id, team) => {
        dispatch(toggleHiddenModal())
        dispatch(setCurrentStateModal('dorsal'))
        dispatch(setCurrentDorsalDelete(dorsal))
        dispatch(setCurrentIdDorsalDelete(id))
        dispatch(setCurrentCurrentTeamPlayerDelete(team))
    }

    //Toggle modal de player eventual
    const handleModalPlayerEventual = () => {
        dispatch(toggleHiddenPlayerEvent())
    }

    return (
        <FormacionesPlanillaWrapper>
            <FormacionesPlanillaTitle>
                <PlanillaButtons
                    className={`local ${activeButton === 'local' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('local')}
                >
                    Local
                </PlanillaButtons>
                <img src={EscudoCelta} alt="" />
                <h3>Formaciones</h3>
                <img src={EscudoPuraQuimica} alt="" />
                <PlanillaButtons
                    className={`visitante ${activeButton === 'visitante' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('visitante')}
                >
                    Visitante
                </PlanillaButtons>
            </FormacionesPlanillaTitle>
            <AlignmentDivider />
            <TablePlanillaWrapper>
                <thead>
                    <tr className='head'>
                        <th>Dorsal</th>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTeam && currentTeam.Player.map(player => (
                            <tr key={player.ID} className={player.eventual ? 'playerEventual' : ''}>
                                <td
                                    className={`dorsal ${!player.Dorsal && 'disabled'}`}
                                    onClick={ () => {
                                            if (stateMatch !== 'isStarted') {
                                            toast.error('Debe comenzar el partido para realizar acciones')
                                            return;
                                        }
                                            if (player.Dorsal) {
                                            handleNext(player.ID, player.Dorsal, player.Nombre)
                                        }}
                                    }
                                >
                                    {player.Dorsal}
                                </td>
                                <td className='text'>{player.DNI}</td>
                                <td className='text'>{player.Nombre}</td>
                                <td className='tdActions'>
                                    <HiMiniPencil
                                        className='edit'
                                        onClick={() => handleEditDorsal(player.ID, player.Nombre)}
                                    />
                                    <HiOutlineXCircle
                                        className={`delete ${!player.Dorsal ? 'disabled' : ''}`}
                                        onClick={() => DeleteDorsalPlayer(player.Dorsal, player.ID, currentTeam.Local)}
                                    />
                                </td>
                            </tr>
                    ))}
                </tbody>
            </TablePlanillaWrapper>
            <PlayerEventContainer>
                        <p
                        onClick={handleModalPlayerEventual}
                        >Añadir jugadores eventuales</p>
                    </PlayerEventContainer>
            <Toaster/>
        </FormacionesPlanillaWrapper>
    );
};

export default FormacionesPlanilla;
