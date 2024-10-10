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
import { Toaster, toast, LoaderIcon } from 'react-hot-toast';
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { URLImages } from '../../utils/utils';
import useNameAndShieldTeams from '../../hooks/useNameAndShieldTeam';
import { eliminarJugadorDestacado, getFormaciones, insertarJugadorDestacado, traerJugadoresDestacados, traerPlantelesPartido } from '../../utils/dataFetchers';
import { useWebSocket } from '../../Auth/WebSocketContext';
import { fetchPartidos } from '../../redux/ServicesApi/partidosSlice';
import { usePlanilla } from '../../hooks/usePlanilla';

const FormacionesPlanilla = ({ idPartido, formacionesPartido }) => {
    const dispatch = useDispatch();
    const [activeButton, setActiveButton] = useState('local');
    const initialState = useSelector((state) => state.match) || [];
    const [initialized, setInitialized] = useState(false);
    const [selectedPlayerIdAction, setSelectedPlayerIdAction] = useState(''); 
    const [playerDorsal, setPlayerDorsal] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState(''); 
    const [loading, setLoading] = useState(false);

    //*BASE DE DATOS
    const socket = useWebSocket();
    const [jugadoresPartido, setJugadoresPartido] = useState();
    const [jugadoresDestacados, setJugadoresDestacados] = useState([]);

    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find((partido) => partido.id_partido === idPartido);
    const matchState = useSelector((state) => state.match);
    const matchCorrecto = matchState.find((match) => match.ID === idPartido);
    const currentTeam = activeButton === 'local' ? matchCorrecto.Local : matchCorrecto.Visitante;
    
    const { setJugadoresDestacadosBd } = usePlanilla(idPartido)

    //custom hook
    const { getNombreEquipo, getEscudoEquipo } = useNameAndShieldTeams([partido.id_equipoLocal, partido.id_equipoVisita]);

    // Traer los jugadores destacados desde la base de datos al cargar el componente
    // Modificar el useEffect que trae los planteles y jugadores destacados
    useEffect(() => {
        const fetchData = async () => {
            if (partido) {
                try {
                    const data = await traerPlantelesPartido(idPartido);
                    const jugadoresConFormacion = data.map(player => ({
                        ...player,
                        dorsal: formacionesPartido?.find(f => f.id_jugador === player.id_jugador)?.dorsal || '',
                    }));
                    setJugadoresPartido(jugadoresConFormacion);
                } catch (error) {
                    console.error('Error en la petición:', error);
                }
            }
    };

    fetchData(); // Llamar a la función de obtención de datos
}, [partido, formacionesPartido, idPartido]);

    // Traer jugadores destacados al cargar el componente
    useEffect(() => {
        const fetchJugadoresDestacados = async () => {
            try {
                const data = await traerJugadoresDestacados(partido.id_categoria, partido.jornada);
                setJugadoresDestacados(data);
            } catch (error) {
                console.error('Error al traer jugadores destacados:', error);
            }
        };

        if (partido) {
            fetchJugadoresDestacados();
        }
    }, [partido]);

    // Escuchar eventos de WebSocket
    useEffect(() => {
        const handlePlayerStarred = ({ idJugador }) => {
            // Actualizar la lista de jugadores destacados al recibir un evento
            setJugadoresDestacados(prev => [...prev, idJugador]);
        };

        socket.on('jugadorDestacado', handlePlayerStarred);

        return () => {
            socket.off('jugadorDestacado', handlePlayerStarred);
        };
    }, [socket]);


    //Actualizar estado del partido
    useEffect(() => {
        const actualizarEstadoPartido = () => {
            dispatch(fetchPartidos());
        }
        socket.on('estadoPartidoActualizado', actualizarEstadoPartido)

        return () => {
            socket.off('estadoPartidoActualizado', actualizarEstadoPartido)
        }

    }, [socket])

    // Escuchar los eventos de asignación y eliminación de dorsal
    useEffect(() => {
        const handleDorsalAsignado = ({ idJugador, dorsal }) => {
            setLoading(true);
            setJugadoresPartido((prevState) => 
                prevState.map((player) => 
                    player.id_jugador === idJugador ? { ...player, dorsal } : player
                )
            );
            setLoading(false);
        };
    
        const handleDorsalEliminado = ({ idJugador }) => {
            setJugadoresPartido((prevState) => 
                prevState.map((player) => 
                    player.id_jugador === idJugador ? { ...player, dorsal: '' } : player
                )
            );
        };
    
        const handlePlayerExpelled = ({ idJugador }) => {
            setJugadoresPartido((prevState) => 
                prevState.map((player) => {
                    // Verifica que el jugador no esté realizando otra acción
                    if (player.id_jugador === idJugador) {
                        return { ...player, sancionado: 'S' }; 
                    }
                    return player;
                })
            );
        };
        
        const handleExpulsionRemoved = ({ idJugador }) => {
            setJugadoresPartido((prevState) => 
                prevState.map((player) => 
                    player.id_jugador === idJugador && player.sancionado === 'S' // Verifica que el jugador esté sancionado
                        ? { ...player, sancionado: 'N' } // Eliminar la sanción
                        : player
                )
            );
        };
        
        // Escuchar los eventos de WebSocket
        socket.on('dorsalAsignado', handleDorsalAsignado);
        socket.on('dorsalEliminado', handleDorsalEliminado);
        socket.on('expulsión', handlePlayerExpelled);
        socket.on('eliminarExpulsión', handleExpulsionRemoved); // Agregar el manejador para eliminar la expulsión
    
        return () => {
            // Limpiar los eventos cuando el componente se desmonte
            socket.off('dorsalAsignado', handleDorsalAsignado);
            socket.off('dorsalEliminado', handleDorsalEliminado);
            socket.off('expulsión', handlePlayerExpelled);
            socket.off('eliminarExpulsión', handleExpulsionRemoved); // Limpiar el evento de eliminar expulsión
        };
    }, [socket]);
    

    // Modificar el useEffect que trae los planteles
    useEffect(() => {
        traerPlantelesPartido(idPartido)
        .then((data) => {
            // Combinar jugadoresPartido con formacionesPartido
            const jugadoresConFormacion = data.map(player => {
                const formacionJugador = formacionesPartido?.find(f => f.id_jugador === player.id_jugador);
                return {
                    ...player,
                    dorsal: formacionJugador?.dorsal || '',
                };
            });
            setJugadoresPartido(jugadoresConFormacion);
        })
        .catch((error) => console.error('Error en la petición', error));
    }, [idPartido, formacionesPartido]);

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
        //Mandar a redux el id del equipo seleccionado
        const selectedTeam = buttonType === 'local' ? partido.id_equipoLocal : partido.id_equipoVisita;
        if (selectedTeam) {
            dispatch(handleTeamPlayer(selectedTeam));
        }
    };

    //Manejador de las acciones del partido
    const handleNext = (playerID, playerDorsal, namePlayer, idEquipo) => {
        if (partido.estado === 'P' || partido.estado === 'F') {
            if (partido.estado === 'F') {
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
        if (partido.estado !== 'F') {
            // if (player.eventual === 'S') {
            //     //!REVISAR POR VALORES DE PLAYER <- EVENTUAL
            //     const {dni, dorsal, nombre_jugador} = player;
            //     const [nombre, apellido] = nombre_jugador.split(' ').map(part => part.trim());

            //     dispatch(setInfoPlayerEvent({dni, dorsal, nombre, apellido}));
            //     dispatch(setEnabledStateInfoPlayerEvent());
            //     handleModalPlayerEventual();
            //     return;
            // }
    
            setSelectedPlayerId(player.id_jugador);
            dispatch(setPlayerSelected(player.id_jugador));
            dispatch(setNamePlayerSelected(player.nombre_jugador));
            dispatch(setdorsalPlayer(player.dorsal));
            
            dispatch(toggleHiddenDorsal());
        } else {
            toast.error('No puedes editar con el partido cargado');
        }
    };
    
    const DeleteDorsalPlayer = (idPartido, idEquipo, idJugador, dorsal) => {
        if (partido.estado !== 'F') {
            dispatch(setInfoDelete({ idPartido, idEquipo, idJugador }));
            dispatch(toggleHiddenModal());
            dispatch(setCurrentStateModal('dorsal'));
            dispatch(setCurrentDorsalDelete(dorsal));
        } else {
            toast.error('El partido ya ha sido cargado en la base de datos');
        }
    };

    const handleModalPlayerEventual = () => {
        if (partido.estado !== 'F') {
            dispatch(toggleHiddenPlayerEvent());
        } else {
            toast.error('El partido ya ha sido cargado en la base de datos');
        }
    };

    // En la función handleStar
    const handleStar = async (player) => {
        if (partido.estado === 'P' || partido.estado === 'F') {
            toast.error('No puedes asignar MVP en este estado del partido');
            return;
        }

        const alreadySelected = jugadoresDestacados.some(jugador => jugador.id_jugador === player.id_jugador);

        try {
            if (alreadySelected) {
                await eliminarJugadorDestacado(partido.id_categoria, partido.id_partido, player.id_jugador);
                setJugadoresDestacados(prev => prev.filter(jugador => jugador.id_jugador !== player.id_jugador));
                toast.success('Jugador destacado eliminado correctamente');
            } else {
                await insertarJugadorDestacado(partido.id_categoria, partido.id_partido, player);
                setJugadoresDestacados(prev => [...prev, player]);
                toast.success('Jugador destacado insertado correctamente');
            }
            setJugadoresDestacadosBd(jugadoresDestacados); // Actualizar el hook de estado
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    useEffect(() => {
        //Mandar a redux el id del equipo seleccionado apenas se inicia el componente
        const selectedTeam = partido.id_equipoLocal;
        if (!initialized && selectedTeam) {
            setActiveButton('local');
            dispatch(handleTeamPlayer(selectedTeam));
            setInitialized(true);
        }
    }, [initialState, initialized, dispatch]);

    // Al final de tu componente FormacionesPlanilla
    const sortedJugadoresPartido = jugadoresPartido?.sort((a, b) => {
        // Ordena los jugadores según el campo eventual
        if (a.eventual === 'S' && b.eventual !== 'S') return 1; // a va al final
        if (a.eventual !== 'S' && b.eventual === 'S') return -1; // b va al final
        return 0; // Si ambos son eventuales o no, manten el orden
    });

    return (
        <FormacionesPlanillaWrapper>
            <FormacionesPlanillaHeader>
                <img src={`${URLImages}${getEscudoEquipo(partido.id_equipoLocal)}`} alt={`${getNombreEquipo(partido.id_equipoLocal)}`} />
                <h3>Formaciones</h3>
                <img src={`${URLImages}${getEscudoEquipo(partido.id_equipoVisita)}`} alt={`${getNombreEquipo(partido.id_equipoVisita)}`} />
            </FormacionesPlanillaHeader>
            <FormacionesPlanillaTitle>
                <PlanillaButtons
                    className={`local ${activeButton === 'local' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('local')}
                >
                    {getNombreEquipo(partido.id_equipoLocal)}
                </PlanillaButtons>
                
                <PlanillaButtons
                    className={`visitante ${activeButton === 'visitante' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('visitante')}
                >
                    {getNombreEquipo(partido.id_equipoVisita)}
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
                {jugadoresPartido && sortedJugadoresPartido
                    .filter(player => player.id_equipo === (activeButton === 'local' ? partido.id_equipoLocal : partido.id_equipoVisita))
                    .map(player => {
                        return (
                            <tr 
                                key={player.id_jugador} 
                                className={`${player.eventual === 'S' ? 'playerEventual' : ''} ${player.sancionado === 'S' ? 'expulsado' : ''}`}
                            >
                                <div className='info-player'>
                                    <td
                                        className={`dorsal ${(!player.dorsal || player.sancionado === 'S') && 'disabled'}`}
                                        onClick={() => {
                                            if (player.dorsal && player.sancionado !== 'S') {
                                                handleNext(player.id_jugador, player.dorsal, player.nombre_jugador, currentTeam.id_equipo);
                                            }
                                        }}
                                    >
                                        {loading ? <LoaderIcon/> : player.dorsal || ''}
                                    </td>
                                    <td className='text dni'>{player.dni}</td>
                                    <td className='text nombre'>{player.nombre_jugador}</td>
                                </div>
                                <td className='tdActions'>
                                    <HiMiniPencil
                                        className='edit'
                                        onClick={() => handleEditDorsal(player)}
                                    />
                                    {jugadoresDestacados.some((p) => p.id_jugador === player.id_jugador) ? (
                                        <IoIosStar 
                                            className={player.dorsal ? 'star' : 'disabled'}
                                            onClick={() => handleStar(player)} 
                                        />
                                    ) : (
                                        <IoIosStarOutline 
                                            className={player.dorsal ? 'star' : 'disabled'}
                                            onClick={() => handleStar(player)} 
                                        />
                                    )}
                                    <HiOutlineXCircle
                                        className={`delete ${!player.dorsal ? 'disabled' : ''}`}
                                        onClick={() => DeleteDorsalPlayer(idPartido, currentTeam.id_equipo, player.id_jugador, player.dorsal)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
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
