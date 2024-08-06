import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ButtonContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { toggleHiddenModal, eliminarAccionesPorDorsal, handleBestPlayerOfTheMatch } from '../../../redux/Planillero/planilleroSlice';
import { addDescToMatch, deleteActionToPlayer, deleteTotalActionsToPlayer, manageDorsal, toggleStateMatch } from '../../../redux/Matches/matchesSlice';
import { Toaster, toast } from 'react-hot-toast';
import Axios from 'axios';
import { URL } from '../../../utils/utils';

const ModalConfirmation = () => {
    Axios.defaults.withCredentials = true;

    const dispatch = useDispatch();
    const hiddenModal = useSelector((state) => state.planillero.modal.hidden);
    const stateModal = useSelector((state) => state.planillero.modal.modalState);
    const deleteDorsal = useSelector((state) => state.planillero.modal.dorsalDelete);
    const actionToDelete = useSelector((state) => state.planillero.actionToDelete);
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const infoDelete = useSelector((state) => state.planillero.infoDelete);
    const descToMatch = useSelector((state) => state.planillero.timeMatch.desc);
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);
    const jugadorDestacado = useSelector((state) => state.planillero.timeMatch.jugador_destacado);
    const [bdEventual, setBdEventual] = useState([]);

    // Generación de objetos para la base de datos
    const contarGoles = (players) => {
        return players.reduce((acc, player) => {
            if (player.Actions) {
                player.Actions.forEach(action => {
                    if (action.Type === 'Gol') {
                        if (action.Detail.enContra === 'si') {
                            // Si el gol es en contra, sumar al otro equipo
                            acc.golesEnContra++;
                        } else {
                            // Gol normal
                            acc.golesNormal++;
                        }
                    }
                });
            }
            return acc;
        }, { golesNormal: 0, golesEnContra: 0 });
    };

    // Contamos los goles para el equipo local
    const golesLocal = contarGoles(match.Local.Player);
    const golesVisita = contarGoles(match.Visitante.Player);

    const bd_partido = {
        id_partido: idPartido,
        goles_local: golesLocal.golesNormal + golesVisita.golesEnContra, // Sumar goles normales del local + goles en contra del visitante
        goles_visita: golesVisita.golesNormal + golesLocal.golesEnContra, // Sumar goles normales del visitante + goles en contra del local
        descripcion: descToMatch,
        id_jugador_destacado: jugadorDestacado
    };

    const generarBdFormaciones = (team, idPartido) => {
        const jugadoresMap = new Map();
    
        // Initialize players with default stats
        team.Player.forEach(jugador => {
            if (jugador.Dorsal) {
                jugadoresMap.set(jugador.ID, {
                    id_partido: idPartido,
                    id_jugador: jugador.ID,
                    dorsal: parseInt(jugador.Dorsal),
                    goles: 0,
                    asistencias: 0,
                    amarillas: 0,
                    rojas: 0
                });
            }
        });
    
        // Process actions and update player stats
        team.Player.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(action => {
                    const jugadorData = jugadoresMap.get(jugador.ID);
                    if (jugadorData) {
                        switch (action.Type) {
                            case 'Gol':
                                jugadorData.goles += 1;
                                break;
                            case 'Amarilla':
                                jugadorData.amarillas += 1;
                                break;
                            case 'Roja':
                                jugadorData.rojas += 1;
                                break;
                            default:
                                break;
                        }
    
                        if (action.Detail.withAssist && action.Detail.idAssist) {
                            const asistenteID = parseInt(action.Detail.idAssist);
                            let asistente = jugadoresMap.get(asistenteID);
                            
                            if (asistente) {
                                asistente.asistencias += 1;
                            } else {
                                jugadoresMap.set(asistenteID, {
                                    id_partido: idPartido,
                                    id_jugador: asistenteID,
                                    dorsal: null,
                                    goles: 0,
                                    asistencias: 1,
                                    amarillas: 0,
                                    rojas: 0
                                });
                            }
                        }
                    }
                });
            }
        });
    
        return Array.from(jugadoresMap.values());
    };
    
    const bd_formacionesLocal = generarBdFormaciones(match.Local, idPartido);
    const bd_formacionesVisitante = generarBdFormaciones(match.Visitante, idPartido);
    const bd_formaciones = [...bd_formacionesLocal, ...bd_formacionesVisitante];

    const generarBdGoles = (team, idPartido) => {
        const goles = [];
        team.Player.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(action => {
                    if (action.Type === 'Gol') {
                        goles.push({
                            id_partido: idPartido,
                            id_jugador: jugador.ID,
                            minuto: parseInt(action.Time),
                            penal: action.Detail.penal ? 'S' : 'N',
                            en_contra: action.Detail.enContra ? 'S' : 'N'
                        });
                    }
                })
            }
        });
        return goles;
    };

    const bd_golesLocal = generarBdGoles(match.Local, idPartido);
    const bd_golesVisita = generarBdGoles(match.Visitante, idPartido);
    const bd_goles = [...bd_golesLocal, ...bd_golesVisita];

    const generarBdRojas = (team, partido) => {
        const rojas = [];
        team.Player.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(accion => {
                    if (accion.Type === 'Roja') {
                        rojas.push({
                        id_partido: idPartido,
                        id_jugador: jugador.ID,
                        minuto: parseInt(accion.Time),
                        descripcion: '',
                        motivo: accion.Sancion
                    });
                    }
                })
            }
        })
        return rojas;
    }

    const bd_rojasLocal = generarBdRojas(match.Local, idPartido);
    const bd_rojasVisita = generarBdRojas(match.Visitante, idPartido);
    const bd_rojas = [...bd_rojasLocal, ...bd_rojasVisita];

    const generarBdAmarillas = (team, idPartido) => {
        const amarillas = [];
        team.Player.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(accion => {
                    if (accion.Type === 'Amarilla') {
                        amarillas.push({
                            id_partido: idPartido,
                            id_jugador: jugador.ID,
                            minuto: parseInt(accion.Time)
                        });
                    }
                })
            }
        })
        return amarillas;
    }

    const bd_amarillasLocal = generarBdAmarillas(match.Local, idPartido);
    const bd_amarillasVisita = generarBdAmarillas(match.Visitante, idPartido);
    const bd_amarillas = [...bd_amarillasLocal, ...bd_amarillasVisita];

    const generarBdAsistencias = (team, idPartido) => {
        const asistencias = [];
        team.Player.forEach(jugador => {
            if (jugador.Actions) {
                jugador.Actions.forEach(accion => {
                    if (accion.Type === 'Gol' && accion.Detail.withAssist) {
                        asistencias.push({
                            id_partido: idPartido,
                            id_jugador: parseInt(accion.Detail.idAssist),
                            minuto: parseInt(accion.Time)
                        });
                    }
                })
            }
        })
        return asistencias
    }

    const bd_asistenciasLocal = generarBdAsistencias(match.Local, idPartido);
    const bd_asistenciasVisita = generarBdAsistencias(match.Visitante, idPartido);
    const bd_asistencias = [...bd_asistenciasLocal, ...bd_asistenciasVisita];

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
        traerPartidosEventuales();
    }, []);

    const generarBdJugadorEventual = (match, jugadoresExistentes) => {
        const jugadoresEventuales = [];
    
        // Create a Set for quick lookup of existing players' dni
        const dniExistentes = new Set(jugadoresExistentes.map(jugador => jugador.dni));
    
        match.Local.Player.forEach((player) => {
            if (player.eventual === 'S' && !dniExistentes.has(player.DNI)) {
                const [nombre, apellido] = player.Nombre.split(' ');
                const jugador = {
                    id_jugador: player.ID,
                    dni: player.DNI,
                    nombre: nombre,
                    apellido: apellido,
                    id_equipo: match.Local.id_equipo,
                    eventual: player.eventual,
                };
    
                if (player.sancionado === 'S') {
                    jugador.sancionado = 'S';
                } else {
                    jugador.sancionado = 'N';
                }
    
                jugadoresEventuales.push(jugador);
            }
        });
    
        match.Visitante.Player.forEach((player) => {
            if (player.eventual === 'S' && !dniExistentes.has(player.DNI)) {
                const [nombre, apellido] = player.Nombre.split(' ');
                const jugador = {
                    id_jugador: player.ID,
                    dni: player.DNI,
                    nombre: nombre,
                    apellido: apellido,
                    id_equipo: match.Visitante.id_equipo,
                    eventual: player.eventual,
                };
    
                if (player.sancionado === 'S') {
                    jugador.sancionado = 'S';
                } else {
                    jugador.sancionado = 'N';
                }
    
                jugadoresEventuales.push(jugador);
            }
        });
    
        return jugadoresEventuales;
    };

    const bd_jugadores_eventuales = generarBdJugadorEventual(match, bdEventual)
    
    // Envío a la base de datos
    const updateJugadores = async () => {
        if (bd_jugadores_eventuales.length > 0) {
            try {
                await Axios.put(`${URL}/user/update-jugadores`, bd_jugadores_eventuales, {
                    withCredentials: true
                });
            } catch (error) {
                toast.error('Error al registrar los jugadores.');
                console.error('Error al registrar los jugadores:', error);
            }
        }
    };
    
    const updateMatch = async () => {
        try {
            await Axios.put(`${URL}/user/update-partido`, {
                id_partido: bd_partido.id_partido,
                goles_local: bd_partido.goles_local,
                goles_visita: bd_partido.goles_visita,
                descripcion: bd_partido.descripcion,
                id_jugador_destacado: bd_partido.id_jugador_destacado,
                estado: 'F'
            });
        } catch (error) {
            toast.error('Error al actualizar el partido.');
            console.error('Error al actualizar el partido:', error);
        }
    };
    
    const insertFormaciones = async () => {
        if (bd_formaciones.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-formaciones`, bd_formaciones);
            } catch (error) {
                toast.error('Error al registrar las formaciones.');
                console.error('Error al registrar las formaciones:', error);
            }
        }
    };
    
    const insertGoles = async () => {
        if (bd_goles.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-goles`, bd_goles);
            } catch (error) {
                toast.error('Error al registrar los goles.');
                console.error('Error al registrar los goles:', error);
            }
        }
    };
    
    const insertRojas = async () => {
        if (bd_rojas.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-rojas`, bd_rojas);
            } catch (error) {
                toast.error('Error al registrar las rojas.');
                console.error('Error al registrar las rojas:', error);
            }
        }
    };
    
    const insertAmarillas = async () => {
        if (bd_amarillas.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-amarillas`, bd_amarillas);
            } catch (error) {
                toast.error('Error al registrar las Amarillas.');
                console.error('Error al registrar las Amarillas:', error);
            }
        }
    };
    
    const insertAsistencias = async () => {
        if (bd_asistencias.length > 0) {
            try {
                await Axios.post(`${URL}/user/crear-asistencias`, bd_asistencias);
            } catch (error) {
                toast.error('Error al registrar las Asistencias.');
                console.error('Error al registrar las Asistencias:', error);
            }
        }
    };

    const updateSancionados = async () => {
        try {
            await Axios.post(`${URL}/user/calcular-expulsiones`);
        } catch (error) {
            toast.error('Error al actualizar las sanciones.');
            console.error('Error al actualizar las sanciones:', error);
        }
    };

    const handleModalConfirm = async () => {
        switch(stateModal) {
            case 'action':
                dispatch(deleteActionToPlayer({ actionToDelete }));
                dispatch(toggleHiddenModal());
                toast.success('Acción eliminada', { duration: 4000 });
                break;
            case 'dorsal':
                dispatch(deleteTotalActionsToPlayer({
                    idPartido: infoDelete.idPartido,
                    idEquipo: infoDelete.idEquipo,
                    idJugador: infoDelete.idJugador
                }));
                dispatch(toggleHiddenModal());
                toast.success('Dorsal eliminado', { duration: 4000 });
                break;
            case 'matchFinish':
                dispatch(toggleStateMatch(idPartido));
                dispatch(toggleHiddenModal());
                toast.success('Partido Finalizado', { duration: 4000 });
                break;
            case 'matchPush':
                if (jugadorDestacado) {
                    await updateJugadores();
                    await updateMatch();
                    await insertFormaciones();
                    await insertGoles();
                    await insertRojas();
                    await insertAsistencias();
                    await insertAmarillas();
                    await updateSancionados();
                    dispatch(toggleStateMatch(idPartido));
                    dispatch(toggleHiddenModal());
                    //borrar jugador destacado
                    dispatch(handleBestPlayerOfTheMatch(null));
                    toast.success('Partido subido correctamente en la base de datos');
                } else {
                    toast.error('Se debe seleccionar el MVP antes de finalizar');
                    dispatch(toggleHiddenModal());
                }
                break;
            default:
                break;
        }
    };
    let modalTitle;
    switch (stateModal) {
        case 'action':
            modalTitle = '¿Estás seguro de que quieres eliminar la acción?';
            break;
        case 'dorsal':
            modalTitle = `¿Estás seguro de que quieres eliminar el dorsal ${deleteDorsal}? Las acciones de este jugador serán eliminadas.`;
            break;
        case 'matchFinish':
            modalTitle = '¿Estás seguro que quieres finalizar el partido?';
            break;
        case 'matchPush':
            modalTitle = '¿Estás seguro que quieres enviar el partido? No podrás tener ningún acceso a la información del partido';
            break;
        default:
            modalTitle = '';
            break;
    }

    const handleModalCancel = () => {
        dispatch(toggleHiddenModal());
    };

    return (
        <>
            {!hiddenModal && (
                <ActionConfirmedContainer>
                    <ActionConfirmedWrapper>
                        <ActionBack>
                            <HiArrowLeft onClick={handleModalCancel}/>
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                            {modalTitle}
                            <AlignmentDivider />
                        </ActionTitle>
                        <ButtonContainer>
                            <ActionNext onClick={handleModalConfirm}>
                                Confirmar
                            </ActionNext>
                            <ActionNext onClick={handleModalCancel} className="cancel">
                                Cancelar
                            </ActionNext>
                        </ButtonContainer>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
            <Toaster/>
        </>
    );
};

export default ModalConfirmation;
