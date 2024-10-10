import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getFormaciones, getIndicencias, traerJugadoresDestacados, verificarJugadores } from '../utils/dataFetchers.js';
import { setCurrentStateModal, setDescOfTheMatch, toggleHiddenModal, toggleHiddenModalSuspender, toggleIdMatch } from '../redux/Planillero/planilleroSlice.js';
import { fetchPartidos } from '../redux/ServicesApi/partidosSlice.js';
import { alignmentTeamToFinish } from '../pages/Planillero/Planilla/helpers.js';
import { toggleStateMatch } from '../redux/Matches/matchesSlice.js';
import { URL } from '../utils/utils.js';
import axios from 'axios';
import { useWebSocket } from '../Auth/WebSocketContext.jsx';

export const usePlanilla = (partidoId) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.match);
    const match = useSelector((state) => state.partidos.data);
    const [partido, setPartido] = useState(null);
    const [matchCorrecto, setMatchCorrecto] = useState(null);
    const [canStartMatch, setCanStartMatch] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [bdFormaciones, setBdFormaciones] = useState(null);
    const [bdIncidencias, setBdIncidencias] = useState(null);
    const [jugadoresDescatadosBd, setJugadoresDestacadosBd] = useState();
    const [estadoPartido, setEstadoPartido] = useState();

    const socket = useWebSocket();

    // Actualiza el estado del partido
    useEffect(() => {
        if (matchCorrecto) {
            setEstadoPartido(matchCorrecto.estado);
        }
    }, [matchCorrecto]);

    useEffect(() => {
        dispatch(toggleIdMatch(partidoId));
    }, [dispatch, partidoId]);

    useEffect(() => {
        dispatch(fetchPartidos());
    }, [dispatch]);

    //!Encontrar partido
    useEffect(() => {
        if (partidos.length > 0 && match.length > 0) {
            const foundPartido = partidos.find(p => p.ID === partidoId);
            setPartido(foundPartido);
    
            const foundMatch = match.find(p => p.id_partido === partidoId);
            setMatchCorrecto(foundMatch);
        }
    }, [partidos, match, partidoId]);

    //!Encontrar partido
    useEffect(() => {
            const foundMatch = match.find(p => p.id_partido === partidoId);
            setMatchCorrecto(foundMatch);
    }, [match, partidoId]);

    useEffect(() => {
        const actualizarMatchCorrecto = (informacion) => {
            const [id_partido, id_jugador] = informacion; // Destructurar los datos
            dispatch(fetchPartidos());
            if (matchCorrecto.id_partido === id_partido) {
                // Aquí deberías buscar el nuevo match actualizado en tus datos
                const updatedMatch = match.find(p => p.id_partido === id_partido);
                if (updatedMatch) {
                    setMatchCorrecto(updatedMatch); // Establece el nuevo estado
                }
            }
        };
        
        socket.on('mvpActualizado', actualizarMatchCorrecto);
        
        return () => {
            socket.off('mvpActualizado', actualizarMatchCorrecto);
        };
    }, [socket, matchCorrecto, dispatch]);

    //Actualizar incidencias y formaciones
    useEffect(() => {
        if (partidoId) {
            getFormaciones(partidoId)
                .then((data) => {
                    setBdFormaciones(data);
                    // dispatch(setFormaciones(data));
                })
                .catch((error) => console.error('Error en la petición', error));

                getIndicencias(partidoId)
                .then((data) => {
                    // Ordenar las incidencias por minuto
                    const incidenciasOrdenadas = data.sort((a, b) => a.minuto - b.minuto);
                    setBdIncidencias(incidenciasOrdenadas);
                })
                .catch((error) => console.error('Error en la petición', error));
        }

        const handleEstadoPartidoActualizado = (data) => {
            if (data.idPartido === partidoId) {
                setEstadoPartido(data.nuevoEstado)
            }
        }

        socket.on('estadoPartidoActualizado', handleEstadoPartidoActualizado)

        return () => {
            socket.off('estadoPartidoActualizado', handleEstadoPartidoActualizado);
        }
        
    }, [partidoId]); //! CORROBORA CAMBIANDO EL ESTADO


    // WebSocket handlers for live updates of goals and other incidents
    useEffect(() => {
        const handleDorsalAsignado = async () => {
            try {
                const formaciones = await getFormaciones(partidoId);
                setBdFormaciones(formaciones);
    
                const incidencias = await getIndicencias(partidoId);

                setBdIncidencias(sortIncidencias(incidencias)); // Ordenar las incidencias
            } catch (error) {
                console.error('Error en la petición de formaciones/incidencias en dorsalAsignado', error);
            }
        };
    
        const handleDorsalEliminado = async () => {
            try {
                const formaciones = await getFormaciones(partidoId);

                setBdFormaciones(formaciones);
    
                const incidencias = await getIndicencias(partidoId);

                setBdIncidencias(sortIncidencias(incidencias)); // Ordenar las incidencias
            } catch (error) {
                console.error('Error en la petición de formaciones/incidencias en dorsalEliminado', error);
            }
        };
    
        const handleNewIncidence = async (incidence) => {

            if (!incidence || typeof incidence !== 'object' || !incidence.id_partido) {
                console.warn('Incidencia vacía o undefined recibida.');
                return;
            }
    
            const incidenciaUnificada = incidence;

            // Asegúrate de que la incidencia unificada tenga datos válidos
            setBdIncidencias((prevIncidencias) => sortIncidencias([...prevIncidencias, incidenciaUnificada])); // Ordenar al agregar
    
            const formaciones = await getFormaciones(partidoId);
            setBdFormaciones(formaciones);
        };
    
        const handleIncidenciaEliminada = async (incidence) => {
            if (incidence.id_accion) {
                setBdIncidencias((prevIncidencias) => {
                    const nuevasIncidencias = prevIncidencias.filter((incidencia) => incidencia.id_accion !== incidence.id_accion);
                    return sortIncidencias(nuevasIncidencias); // Ordenar al eliminar
                });
                const formaciones = await getFormaciones(partidoId);
                setBdFormaciones(formaciones);
            } else {
                console.error('ID de incidencia a eliminar es undefined o no válido.');
            }
        };
    
        const handleAccionEditada = async (editedIncidence) => {
            try {
                if (editedIncidence.id_accion) {
                    setBdIncidencias((prevIncidencias) => {
                        const incidenciasActualizadas = prevIncidencias.map((incidencia) =>
                            incidencia.id_accion === editedIncidence.id_accion ? editedIncidence : incidencia
                        );
                        return sortIncidencias(incidenciasActualizadas); // Ordenar al editar
                    });
    
                    const formaciones = await getFormaciones(partidoId);
                    setBdFormaciones(formaciones);
                } else {
                    console.error('ID de incidencia editada es undefined o no válido.');
                }
            } catch (error) {
                console.error('Error al editar la acción:', error);
            }
        };
    
        const handleJugadorEventual = async () => {
            try {
                const formaciones = await getFormaciones(partidoId);
                setBdFormaciones(formaciones);
            } catch (error) {
                console.error('Error en la petición de formaciones en jugadorEventual', error);
            }
        };
    
        // Función para ordenar las incidencias por minuto
        const sortIncidencias = (incidencias) => {
            return incidencias.sort((a, b) => {
                return a.minuto - b.minuto; // Asegúrate de que 'minuto' sea el campo que deseas usar
            });
        };
    
        // Escuchar los eventos de socket
        socket.on('dorsalAsignado', handleDorsalAsignado);
        socket.on('editarAccion', handleAccionEditada);
        socket.on('dorsalEliminado', handleDorsalEliminado);
        socket.on('nuevaAccion', handleNewIncidence);
        socket.on('eliminarAccion', handleIncidenciaEliminada);
        socket.on('jugadorEventualCreado', handleJugadorEventual);
    
        // Limpieza de los sockets en el desmontaje del componente
        return () => {
            socket.off('dorsalAsignado', handleDorsalAsignado);
            socket.off('dorsalEliminado', handleDorsalEliminado);
            socket.off('nuevaAccion', handleNewIncidence);
            socket.off('eliminarAccion', handleIncidenciaEliminada);
            socket.off('jugadorEventualCreado', handleJugadorEventual);
            socket.off('editarAccion', handleAccionEditada);
        };
    }, [socket, partidoId]);
    
    const handleChange = (event) => {
        setDescripcion(event.target.value);
    };

    const handleStartMatch = async () => {
        const loadingToast = toast.loading('Actualizando el estado del partido...');
    
        const resultadoVerificacion = await verificarJugadores(partidoId);
    
        if (resultadoVerificacion.sePuedeComenzar) {
            if (partido.estado === 'C') {
                dispatch(toggleHiddenModal());
                dispatch(setCurrentStateModal('matchFinish'));
                // Cerrar loader
                toast.dismiss(loadingToast);
            } else {
                // Comenzar el partido
                axios.post(`${URL}/user/actualizar-estado-partido`, { idPartido: partidoId })
                    .then(response => {
                        // Estado actualizado correctamente
                        toast.success('Estado del partido actualizado con éxito', {
                            id: loadingToast // Cierra el loader y muestra el mensaje de éxito
                        });
                        socket.emit('estadoPartidoActualizado', { idPartido: partidoId, nuevoEstado: response.data.nuevoEstado });
                    })
                    .catch(error => {
                        console.error('Error al actualizar el estado del partido:', error);
                        // Mostrar mensaje de error y cerrar loader
                        toast.error('Error al actualizar el estado del partido', {
                            id: loadingToast // Cierra el loader y muestra el error
                        });
                    });
            }
        } else {
            // Mostrar mensaje de error de verificación y cerrar loader
            toast.error('Debe haber un mínimo de 5 jugadores por equipo registrados para comenzar', {
                id: loadingToast // Cierra el loader
            });
        }
    };
    
    const suspenderPartido = () => {        
        dispatch(toggleHiddenModalSuspender());
        dispatch(setCurrentStateModal('suspenderPartido'));
    };

    const pushInfoMatch = () => {
        dispatch(toggleHiddenModal());
        dispatch(setDescOfTheMatch(descripcion));
        dispatch(setCurrentStateModal('matchPush'));
    };

    const handleToastStartMatch = () => {
        if (canStartMatch) {
            toast.success('Partido comenzado', {
                duration: 4000,
            });
        }
    };

    useEffect(() => {
        const handleJugadorInsertado = async (data) => {
            const idPartido = data;

            const destacados = await traerJugadoresDestacados(matchCorrecto.id_categoria, matchCorrecto.jornada);

            const jugadoresFiltrados = destacados.filter((j) => j.id_partido == idPartido);

            setJugadoresDestacadosBd((prevDestacados = []) => {
                const jugadoresActualizados = prevDestacados.filter(j => 
                    !jugadoresFiltrados.some(n => n.id_jugador === j.id_jugador)
                );
    
                const nuevoEstado = [...jugadoresActualizados, ...jugadoresFiltrados];
    
                if (nuevoEstado.length !== prevDestacados.length || 
                    !nuevoEstado.every((j, index) => j.id_jugador === prevDestacados[index]?.id_jugador)) {
                    return nuevoEstado;
                }
    
                return prevDestacados; // Retorna el estado anterior si no hay cambios
            });
        };
    
        socket.on('jugadoresDestacadosActualizados', handleJugadorInsertado);
    
        return () => {
            socket.off('jugadoresDestacadosActualizados', handleJugadorInsertado);
        };
    }, [socket, partido]);
    
    
    const formacionesConNombreApellido = partido && bdFormaciones ? alignmentTeamToFinish(partido, bdFormaciones) : null;
    
    const jugadoresDestacados = jugadoresDescatadosBd?.map((j) => ({
        ...j,
        nombre_completo: `${j.nombre} ${j.apellido}`
    }));
        
    return {
        partido,
        matchCorrecto,
        canStartMatch,
        descripcion,
        bdFormaciones,
        setBdFormaciones,
        bdIncidencias,
        handleChange,
        handleStartMatch,
        pushInfoMatch,
        handleToastStartMatch,
        formacionesConNombreApellido,
        jugadoresDestacados,
        setJugadoresDestacadosBd,
        suspenderPartido,
        estadoPartido
    };
};
