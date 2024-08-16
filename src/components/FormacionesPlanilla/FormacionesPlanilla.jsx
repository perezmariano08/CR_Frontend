import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormacionesPlanillaHeader, FormacionesPlanillaTitle, FormacionesPlanillaWrapper, PlanillaButtons, PlayerEventContainer, TablePlanillaWrapper } from './FormacionesPlanillaStyles';
import { AlignmentDivider } from '../Stats/Alignment/AlignmentStyles';
import { HiMiniPencil, HiOutlineXCircle } from "react-icons/hi2";
import {
    setNamePlayer, setPlayerSelected, setPlayerSelectedAction, setdorsalPlayer,
    toggleHiddenAction, toggleHiddenDorsal, setIsLocalTeam, setNamePlayerSelected,
    toggleHiddenModal, setCurrentStateModal, setCurrentDorsalDelete, setCurrentIdDorsalDelete,
    setCurrentCurrentTeamPlayerDelete, handleTeamPlayer, toggleHiddenPlayerEvent,
    setEnabledActionEdit,
    setInfoDelete,
    setInfoPlayerEvent,
    setEnabledStateInfoPlayerEvent,
    handleBestPlayerOfTheMatch
} from '../../redux/Planillero/planilleroSlice';
import { Toaster, toast } from 'react-hot-toast';
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { URLImages } from '../../utils/utils';

const FormacionesPlanilla = ({ idPartido, formaciones }) => {
    const dispatch = useDispatch();
    const [activeButton, setActiveButton] = useState('local');
    const initialState = useSelector((state) => state.match) || [];
    const [initialized, setInitialized] = useState(false);
    const [selectedPlayerIdAction, setSelectedPlayerIdAction] = useState(''); 
    const [playerDorsal, setPlayerDorsal] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState(''); 

    const selectedStar = useSelector((state) => state.planillero.timeMatch.jugador_destacado)
    // Consumo del slice que a su vez consume la base de datos
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === idPartido);
    const matchState = useSelector((state) => state.match);
    const matchCorrecto = matchState.find((match) => match.ID === idPartido);
    const currentTeam = activeButton === 'local' ? matchCorrecto.Local : matchCorrecto.Visitante;

    //Cargar escudos y nombres de los equipos
    const equipos = useSelector((state) => state.equipos.data);
    const escudosEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.img : null;
    };
    
    const nombreEquipos = (idEquipo) => {
        const equipo = equipos.find((equipo) => equipo.id_equipo === idEquipo);
        return equipo ? equipo.nombre : null;
    };

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
        const selectedTeam = buttonType === 'local' ? matchCorrecto.Local : matchCorrecto.Visitante;
        if (selectedTeam) {
            dispatch(handleTeamPlayer(selectedTeam.id_equipo));
        }
    };
    
    //Manejador de las acciones del partido
    const handleNext = (playerID, playerDorsal, namePlayer, idEquipo) => {
        if (matchCorrecto.matchState === null || matchCorrecto.matchState === 'matchPush') {
            if (matchCorrecto.matchState === 'matchPush') {
                toast.error('El partido ya ha sido cargado en la base de datos');
            } else {
                toast.error('Debe comenzar el partido para realizar acciones');
            }
            return;
        }
        setSelectedPlayerIdAction(playerID);
        dispatch(setPlayerSelectedAction(playerID));

        setPlayerDorsal(playerDorsal);
        dispatch(setdorsalPlayer(playerDorsal));

        setPlayerName(namePlayer);
        dispatch(setNamePlayer(namePlayer));

        dispatch(setIsLocalTeam(idEquipo));
        dispatch(toggleHiddenAction());
    };

    //Edicion del dorsal
    const handleEditDorsal = (player) => {
        if (matchCorrecto.matchState !== 'matchPush') {
            if (player.eventual === 'S') {
                const {DNI, Dorsal, Nombre} = player;
                const [nombre, apellido] = Nombre.split(' ').map(part => part.trim());
                dispatch(setInfoPlayerEvent({DNI, Dorsal, nombre, apellido}));
                dispatch(setEnabledStateInfoPlayerEvent());
                handleModalPlayerEventual();
                return;
            }
    
            setSelectedPlayerId(player.ID);
            dispatch(setPlayerSelected(player.ID));
            dispatch(setNamePlayerSelected(player.Nombre));
            dispatch(toggleHiddenDorsal());
        } else {
            toast.error('El partido ya ha sido cargado en la base de datos');
        }
    };
    
    const DeleteDorsalPlayer = (idPartido, idEquipo, idJugador, dorsal) => {
        if (matchCorrecto.matchState !== 'matchPush') {
            dispatch(setInfoDelete({ idPartido, idEquipo, idJugador }));
            dispatch(toggleHiddenModal());
            dispatch(setCurrentStateModal('dorsal'));
            dispatch(setCurrentDorsalDelete(dorsal));
        } else {
            toast.error('El partido ya ha sido cargado en la base de datos');
        }

    };

    const handleModalPlayerEventual = () => {
        if (matchCorrecto.matchState !== 'matchPush') {
            dispatch(toggleHiddenPlayerEvent());
        } else {
            toast.error('El partido ya ha sido cargado en la base de datos');
        }
    };

    const handleStar = (player) => {
        if (matchCorrecto.matchState === null || matchCorrecto.matchState === 'matchPush') {
            if (matchCorrecto.matchState === null) {
                toast.error('Debe comenzar el partido para asignar el MVP')
            } else {
                toast.error('El partido ya fue cargado en la base de datos')
            }
            return
        }
        const newSelectedStar = selectedStar === player.ID ? null : player.ID;
        dispatch(handleBestPlayerOfTheMatch(newSelectedStar));
    };

    useEffect(() => {
        const selectedTeam = matchCorrecto.Local;
        if (!initialized && selectedTeam) {
            setActiveButton('local');
            dispatch(handleTeamPlayer(selectedTeam.id_equipo));
            setInitialized(true);
        }
    }, [initialState, initialized, dispatch]);

    return (
        <FormacionesPlanillaWrapper>
            <FormacionesPlanillaHeader>
                <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={`${nombreEquipos(partido.id_equipoLocal)}`} />
                <h3>Formaciones</h3>
                <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={`${nombreEquipos(partido.id_equipoVisita)}`} />
            </FormacionesPlanillaHeader>
            <FormacionesPlanillaTitle>
                <PlanillaButtons
                    className={`local ${activeButton === 'local' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('local')}
                >
                    {nombreEquipos(partido.id_equipoLocal)}
                </PlanillaButtons>
                
                <PlanillaButtons
                    className={`visitante ${activeButton === 'visitante' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('visitante')}
                >
                    {nombreEquipos(partido.id_equipoVisita)}
                </PlanillaButtons>
            </FormacionesPlanillaTitle>
            <AlignmentDivider />
            <TablePlanillaWrapper>
                <thead>
                    <tr className='head'>
                        <div className='info-player'>
                            <th className='dorsal'>#</th>
                            <th className='dni'>DNI</th>
                            <th className='nombre'>Nombre</th>
                        </div>
                        <th className='editar'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTeam && currentTeam.Player.map(player => (
                        <tr 
                            key={player.ID} 
                            className={`${player.eventual === 'S' ? 'playerEventual' : ''} ${player.sancionado === 'S' ? 'expulsado' : ''}`}
                        >
                            <div className='info-player'>
                                <td
                                className={`dorsal ${(!player.Dorsal || player.sancionado === 'S' ) && 'disabled'}`}
                                onClick={() => {
                                        if (player.Dorsal && player.sancionado !== 'S') {
                                            handleNext(player.ID, player.Dorsal, player.Nombre, currentTeam.id_equipo);
                                        }
                                }}
                            >
                                {player.Dorsal}
                            </td>
                            <td className='text dni'>{player.DNI}</td>
                            <td className='text nombre'>{player.Nombre}</td>
                            </div>
                            <td className='tdActions'>
                                <HiMiniPencil
                                    className='edit'
                                    onClick={() => handleEditDorsal(player)}
                                />
                                {
                                    selectedStar === player.ID ? (
                                        <IoIosStar className={player.Dorsal ? 'star' : 'disabled'} 
                                        onClick={() => handleStar(player)} />
                                    ) : (
                                        <IoIosStarOutline className={player.Dorsal ? 'star' : 'disabled'} 
                                        onClick={() => handleStar(player)} />
                                    )
                                }
                                <HiOutlineXCircle
                                    className={`delete ${(!player.Dorsal) ? 'disabled' : ''}`}
                                    onClick={() => DeleteDorsalPlayer(idPartido, currentTeam.id_equipo, player.ID, player.Dorsal)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </TablePlanillaWrapper>
            <PlayerEventContainer>
                <p onClick={handleModalPlayerEventual}>Añadir jugadores eventuales</p>
            </PlayerEventContainer>
            <Toaster />
        </FormacionesPlanillaWrapper>
    );
};

export default FormacionesPlanilla;
