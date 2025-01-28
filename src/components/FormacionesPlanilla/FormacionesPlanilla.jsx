import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormacionesPlanillaHeader, FormacionesPlanillaTitle, FormacionesPlanillaWrapper, PlanillaButtons, PlayerEventContainer, TablePlanillaWrapper } from './FormacionesPlanillaStyles';
import { AlignmentDivider } from '../Stats/Alignment/AlignmentStyles';
import { HiMiniPencil, HiOutlineXCircle } from "react-icons/hi2";
import { Toaster, toast, LoaderIcon } from 'react-hot-toast';
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { URLImages } from '../../utils/utils';
import { useEquipos } from '../../hooks/useEquipos';
import { setIdEquipo, setJugador, setModalType, toggleModal } from '../../redux/Planillero/planilleroSlice';
import { eliminarJugadorDestacado, insertarJugadorDestacado } from '../../utils/dataFetchers';

const FormacionesPlanilla = ({ partido, formacionesPartido, socket_loading }) => {
    const dispatch = useDispatch();
    // const id_equipo = useSelector((state) => state.planillero.id_equipo);
    const token = localStorage.getItem('token');
    //custom hook
    const { nombresEquipos, escudosEquipos } = useEquipos()

    //navegacion entre equipos
    const [navActive, setNavActive] = useState(partido.id_equipoLocal);

    const handleNavActive = (id_equipo) => {
        dispatch(setIdEquipo(id_equipo));
        setNavActive(id_equipo)
    }

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

        try {
            if (player.destacado === 'S') {
                const res = await eliminarJugadorDestacado(partido.id_categoria, partido.id_partido, player.id_jugador, token);
                toast.success('Acción ejecutada con éxito');
                return;
            }
            const res = await insertarJugadorDestacado(partido.id_categoria, partido.id_partido, player.id_equipo, player.id_jugador, token);
            toast.success('Acción ejecutada con éxito');

        } catch (error) {
            console.error(error);
            toast.error('Error al ejecutar la acción');
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
                        <div className='info-player'>
                            <th className='dorsal'>#</th>
                            <th className='dni'>DNI</th>
                            <th className='nombre'>Nombre</th>
                        </div>
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
                                <div className='info-player'>
                                    <td
                                        className={`dorsal ${(!player.dorsal || player.sancionado === 'S') && 'disabled'}`}
                                        onClick={() => {handleNext(player)}}
                                    >
                                        {socket_loading[player.id_jugador] ? <LoaderIcon/> : player.dorsal || ''}
                                    </td>
                                    <td className='text dni'>{player.dni}</td>
                                    <td className='text nombre'>{player.nombre} {player.apellido}</td>
                                </div>
                                <td className='tdActions'>
                                    <HiMiniPencil
                                        className='edit'
                                        onClick={() => handleDorsal(player)}
                                    />
                                    {
                                        player.destacado === 'N' ? (
                                            <IoIosStarOutline 
                                                className={player.dorsal ? 'star' : 'disabled'}
                                                onClick={() => handleStar(player)} 
                                            />
                                        ) : (
                                            <IoIosStar 
                                            className={player.dorsal ? 'star' : 'disabled'}
                                            onClick={() => handleStar(player)} 
                                        />
                                        )
                                    }

                                    <HiOutlineXCircle
                                        className={`delete ${!player.dorsal ? 'disabled' : ''}`}
                                        onClick={() => deleteDorsalAndActionsPlayer(player)}
                                    />
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
