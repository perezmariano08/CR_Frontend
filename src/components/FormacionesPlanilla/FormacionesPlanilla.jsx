import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormacionesPlanillaHeader, FormacionesPlanillaTitle, FormacionesPlanillaWrapper, PlanillaButtons, PlayerEventContainer, StarIcon, StarOutlineIcon, TablePlanillaWrapper } from './FormacionesPlanillaStyles';
import { AlignmentDivider } from '../Stats/Alignment/AlignmentStyles';
import { HiMiniPencil, HiOutlineXCircle } from "react-icons/hi2";
import { Toaster, toast, LoaderIcon } from 'react-hot-toast';
import { URLImages } from '../../utils/utils';
import { useEquipos } from '../../hooks/useEquipos';
import { setIdEquipo, setJugador, setModalType, toggleModal } from '../../redux/Planillero/planilleroSlice';
import { eliminarJugadorDestacado, insertarJugadorDestacado } from '../../utils/dataFetchers';

const FormacionesPlanilla = ({ partido, formacionesPartido, setFormaciones, fetchJugadoresDestacados }) => {
    const dispatch = useDispatch();
    const [loadingPlayerId, setLoadingPlayerId] = useState(null);
    const token = localStorage.getItem('token');

    //custom hook
    const { nombresEquipos, escudosEquipos } = useEquipos()

    //navegacion entre equipos
    const [navActive, setNavActive] = useState(partido.id_equipoLocal);

    const handleNavActive = (id_equipo) => {
        dispatch(setIdEquipo(id_equipo));
        setNavActive(id_equipo)
    }

    useEffect(() => {
        dispatch(setIdEquipo(partido.id_equipoLocal));
    }, [dispatch, partido.id_equipoLocal]);

    const handleNext = (player) => {

        if (partido.estado === 'P' || partido.estado === 'F') {
            if (partido.estado === 'F') {
                toast.error('El partido ya ha sido cargado en la base de datos');
            } else {
                toast.error('Debe comenzar el partido para realizar acciones');
            }
            return;
        }

        if (player.sancionado === 'S') toast.error('Un jugador sancionado no puede realizar una acción')
        if (!player.dorsal) toast.error('Un jugador sin dorsal no puede realizar una acción, por favor, asignar un dorsal al jugador')

        dispatch(setJugador(player));
        dispatch(toggleModal('ActionType'));
    };

    const handleDorsal = (player) => {
        if (partido.estado === 'F') return toast.error('No se puede editar con el partido cargado');

        dispatch(setJugador(player))
        dispatch(toggleModal('EditDorsal'))
    };

    const handleStar = async (player) => {
        if (partido.estado === 'F') return toast.error('No se puede editar con el partido cargado');
        if (partido.estado === 'P') return toast.error('Debes comenzar el partido para ejecutar esta acción');

        setLoadingPlayerId(player.id_jugador);

        // Actualizar el estado local de las formaciones
        setFormaciones((prevFormaciones) => 
            prevFormaciones.map((formacion) =>
                formacion.id_jugador === player.id_jugador
                    ? { ...formacion, destacado: player.destacado === 'S' ? 'N' : 'S' }
                    : formacion
            )
        );

        try {
            let mensaje
            if (player.destacado === 'S') {
                await eliminarJugadorDestacado(partido.id_categoria, partido.id_partido, player.id_jugador, token);
                mensaje = 'Jugador destacado eliminado'
            } else {
                await insertarJugadorDestacado(partido.id_categoria, partido.id_partido, player.id_equipo, player.id_jugador, token);
                mensaje = 'Jugador destacado agregado'
            }
            setLoadingPlayerId(null);
            toast.success(mensaje);
            await fetchJugadoresDestacados();

        } catch (error) {
            console.error(error);
            toast.error('Error al ejecutar la acción');
        } finally {
            setLoadingPlayerId(null);
        }
    }

    const deleteDorsalAndActionsPlayer = (player) => {

        if (partido.estado === 'F') return toast.error('No se puede editar con el partido cargado');

        dispatch(setJugador(player));
        dispatch(toggleModal('modalConfirmation'));
        dispatch(setModalType('deleteDorsal'));
    }

    const handleModalEventual = () => {
        dispatch(toggleModal('jugadorEventual'))
    }

    return (
        <FormacionesPlanillaWrapper>
            <FormacionesPlanillaHeader>
                <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={`${nombresEquipos(partido.id_equipoLocal)}`} />
                <h3>Formaciones</h3>
                <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={`${nombresEquipos(partido.id_equipoVisita)}`} />
            </FormacionesPlanillaHeader>
            <FormacionesPlanillaTitle>
                <PlanillaButtons
                    className={`local ${+navActive === +partido.id_equipoLocal ? 'active' : ''}`}
                    onClick={() => handleNavActive(partido.id_equipoLocal)}
                >
                    {nombresEquipos(partido.id_equipoLocal)}
                </PlanillaButtons>

                <PlanillaButtons
                    className={`visitante ${+navActive === +partido.id_equipoVisita ? 'active' : ''}`}
                    onClick={() => handleNavActive(partido.id_equipoVisita)}
                >
                    {nombresEquipos(partido.id_equipoVisita)}
                </PlanillaButtons>
            </FormacionesPlanillaTitle>
            <AlignmentDivider />
            <TablePlanillaWrapper>
                <thead>
                    <tr className='head'>
                        <th className='dorsal'>#</th>
                        <th className='dni'>DNI</th>
                        <th className='nombre'>Nombre</th>
                        <th className='editar'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {formacionesPartido
                        ?.filter(jugador => jugador.id_equipo === navActive)
                        .map(player => {
                            return (
                                <tr
                                    key={player.id_jugador}
                                    className={`${player.eventual === 'S' ? 'playerEventual' : ''} ${player.sancionado === 'S' ? 'expulsado' : ''}`}
                                >
                                    <td className={`dorsal ${(!player.dorsal || player.sancionado === 'S') && 'disabled'}`}
                                        onClick={() => { handleNext(player) }}>
                                        {!player.id_jugador ? <LoaderIcon /> : player.dorsal || ''}
                                    </td>
                                    <td className='text dni'>{player.dni}</td>
                                    <td className='text nombre'>{player.nombre} {player.apellido}</td>
                                    <td className='tdActions'>
                                        <HiMiniPencil className='edit' onClick={() => handleDorsal(player)} />
                                        {player.destacado === 'N' ? (
                                            <StarOutlineIcon
                                                className={player.dorsal ? 'star' : 'disabled'}
                                                $loading={loadingPlayerId === player.id_jugador}
                                                onClick={() => handleStar(player)}
                                            />
                                        ) : (
                                            <StarIcon
                                                className={player.dorsal ? 'star' : 'disabled'}
                                                $loading={loadingPlayerId === player.id_jugador}
                                                onClick={() => handleStar(player)}
                                            />
                                        )}
                                        <HiOutlineXCircle className={`delete ${!player.dorsal ? 'disabled' : ''}`} onClick={() => deleteDorsalAndActionsPlayer(player)} />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>

            </TablePlanillaWrapper>
            <PlayerEventContainer>
                <p onClick={handleModalEventual}>Añadir jugadores eventuales</p>
            </PlayerEventContainer>
            <Toaster />
        </FormacionesPlanillaWrapper>
    );
};

export default FormacionesPlanilla;
