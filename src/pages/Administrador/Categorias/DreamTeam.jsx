import React, { useEffect, useState } from 'react';
import userDefault from '../../../../public/user-default.png';
import {
    CanchaContainer,
    Linea,
    Posicion,
    JugadorPlaceholder,
    CruzAgregar,
    JugadorContainer,
    JugadorImagen,
    JugadorInfo,
    JugadorNombre,
    JugadoresContainer,
    JugadorEquipo,
    InfoTop,
    ExplicativoContainer,
    Explicativo
} from './DreamTeamStyles';
import {
    AlinacionTop,
    DreamTeamAlineacion,
    DreamTeamContainer,
    DreamTeamInfo,
    DreamTeamWrapper,
    FechaContainer,
    TextLeft
} from './DreamTeamStyles';
import Divider from '../../../components/Divider/Divider';
import useModalsCrud from '../../../hooks/useModalsCrud';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { TbPlayFootball } from 'react-icons/tb';
import Input from '../../../components/UI/Input/Input';
import { traerJugadoresDestacados, actualizarJugadoresDestacados, limpiarJugadoresDescatados, traerJugadoresPorCategoria, jugadoresDestacadosDream, getDreamTeamFecha, eliminarJugadorDt } from '../../../utils/dataFetchers';
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';
import Overlay from '../../../components/Overlay/Overlay';
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import { IoIosWarning } from "react-icons/io";
import toast from 'react-hot-toast'
import { DreamTeamCardWrapper, Fila, Jugador, LogoJugador, NombreJugador, SvgBackground } from '../../../components/DreamTeamCard/DreamTeamCardStyles';
import { useJugadores } from '../../../hooks/useJugadores';
import { fetchJugadoresDestacados } from '../../../redux/ServicesApi/jugadoresDestacadosSlice';

const DreamTeam = ({ id_categoria, jornada }) => {
    const token = localStorage.getItem('token');
    const { fotosJugadores } = useJugadores()
    const {
        isCreateModalOpen, openCreateModal, closeCreateModal
    } = useModalsCrud();

    const [jugadoresDestacados, setJugadoresDestacados] = useState([]);
    const [jdFiltrados, setJdFiltrados] = useState([]);

    const [alineacion, setAlineacion] = useState({
        arquero: null,
        defensores: Array(2).fill(null), // 2 defensores
        mediocampistas: Array(3).fill(null), // 3 mediocampistas
        delantero: null,
    });
    const [jugadores, setJugadores] = useState([]);
    const [filteredJugadores, setFilteredJugadores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const [selectedPosition, setSelectedPosition] = useState('');
    const [dreamTeam, setDreamTeam] = useState([]);

    useEffect(() => {
        const fetchDreamTeam = async () => {
            const dreamTeamData = await getDreamTeamFecha(id_categoria, jornada);

            // ⚠️ Solo actualiza si los datos realmente cambian
            if (JSON.stringify(dreamTeamData) !== JSON.stringify(dreamTeam)) {
                setDreamTeam(dreamTeamData);
            }
        };

        fetchDreamTeam();
    }, [id_categoria, jornada, dreamTeam]); // ✅ Se ejecuta cuando dreamTeam cambia, pero sin bucles infinitos    

    useEffect(() => {
        if (isCreateModalOpen) {
            const fetchJugadoresDestacados = async () => {
                const jugadores = await jugadoresDestacadosDream(id_categoria, jornada, token);
                if (jugadores) {
                    setJugadoresDestacados(jugadores);
                }
            };

            fetchJugadoresDestacados();
        }
    }, [isCreateModalOpen, jornada]);

    const handleOpenCreateModal = (position) => {
        setSelectedPosition(position);
        openCreateModal();
        fetchJugadores();
    };

    const closeModal = () => {
        closeCreateModal();
        setSearchTerm('');
        setFilteredJugadores([]);
        setJugadoresDestacados([]);
        setJdFiltrados([]);
    };

    // Función para obtener jugadores de la categoría
    const fetchJugadores = async () => {
        const data = await traerJugadoresPorCategoria(id_categoria, jornada);
        if (data) {
            setJugadores(data);
            setFilteredJugadores(data);
        }
    };

    // Normaliza el texto para la búsqueda
    const normalizeText = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    // Filtrar y ordenar jugadores según el término de búsqueda
    useEffect(() => {
        const normalizedSearch = normalizeText(searchTerm);

        const filtered = jugadores
            .filter(jugador =>
                normalizeText(`${jugador.nombre} ${jugador.apellido}`).includes(normalizedSearch)
            )
            .sort((a, b) => normalizeText(a.apellido).localeCompare(normalizeText(b.apellido)));

        const jdFiltered = jugadoresDestacados
            .filter(jugador =>
                normalizeText(`${jugador.nombre} ${jugador.apellido}`).includes(normalizedSearch)
            )
            .sort((a, b) => normalizeText(a.apellido).localeCompare(normalizeText(b.apellido)));

        setJdFiltrados(jdFiltered);
        setFilteredJugadores(filtered);
    }, [searchTerm, jugadores, jugadoresDestacados]);


    const seleccionarJugador = async (jugador, posicion) => {
        try {
            const data = {
                id_categoria: id_categoria,
                id_partido: jugador.id_partido,
                id_jugador: jugador.id_jugador,
                id_equipo: jugador.id_equipo,
                posicion: posicion,
                jornada: jornada
            };

            const loadingToastId = toast.loading('Agregando jugador...');
            const resultado = await actualizarJugadoresDestacados(data, token);

            if (resultado && resultado.status === 200) {

                toast.success('Jugador agregado con éxito');

                // ACTUALIZAR ESTADO LOCAL PARA REFLEJAR EL CAMBIO INMEDIATAMENTE
                setDreamTeam(prevTeam => [...prevTeam, { ...jugador, posicion }]);

                fetchJugadores();
                fetchJugadoresDestacados();
            } else {
                toast.error('Error al agregar el jugador');
            }

            toast.dismiss(loadingToastId);
            closeModal();
        } catch (error) {
            console.error('Error al seleccionar el jugador', error);
            toast.error('Error al agregar el jugador');
            toast.dismiss(loadingToastId);
        }
    };

    const eliminarJugador = async (jugador) => {
        if (!jugador) return toast.error('No se encontró el jugador');

        const loadingToastId = toast.loading('Eliminando jugador...');
        try {
            const response = await eliminarJugadorDt(jugador, token);
            if (response.status === 200) {
                toast.success('Jugador eliminado del dreamteam');
                setDreamTeam(prevTeam => prevTeam.filter(j => j.id_jugador !== jugador.id_jugador));
            } else {
                toast.error('Error al eliminar el jugador');
                console.error('Error al eliminar el jugador');
            }
        } catch (error) {
            console.error('Error al eliminar el jugador', error);
            toast.error('Error al eliminar el jugador');
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    const limpiarFormacion = async (event) => {
        event.preventDefault();
        const loadingToastId = toast.loading('Limpiando formación...');
        try {
            const response = await limpiarJugadoresDescatados(jornada, token);
            if (response.status = 200) {
                toast.success('Formacion limpiada con éxito')
                setDreamTeam([]);
            } else {
                toast.error('Error al limpiar la formacion')
            }
        } catch (error) {
            console.error('Error al limpiar la formación', error);
            toast.error('Error al limpiar la formación');
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    const formacion = [1, 1, 2, 2, 1];

    return (
        <>
            {
                !Number.isNaN(jornada) && jornada > 0 && id_categoria &&
                <DreamTeamContainer>
                    DreamTeam
                    <DreamTeamWrapper>
                        <DreamTeamAlineacion>
                            <AlinacionTop>
                                <TextLeft>
                                    <FechaContainer>Fecha {jornada}</FechaContainer>
                                    <p>Categoria Libre - Serie A</p>
                                </TextLeft>
                                <a href="#" onClick={(event) => limpiarFormacion(event)}>Limpiar formación</a>
                            </AlinacionTop>
                            <Divider color="var(--gray-300)" />

                            {/* <CanchaContainer>
                            <Linea>
                                <Posicion onClick={() => handleOpenCreateModal('delantero')}>
                                    {alineacion.delantero ? (
                                        <>
                                            <JugadorPlaceholder className='escudo'>
                                                <JugadorImagen src={`${URLImages}${escudosEquipos(alineacion.delantero.id_equipo)}`} alt="Jugador" />
                                            </JugadorPlaceholder>
                                            <CruzAgregar>-</CruzAgregar>
                                            <JugadorNombre>{alineacion.delantero.nombre} {alineacion.delantero.apellido}</JugadorNombre>
                                        </>
                                    ) : (
                                        <>
                                            <JugadorPlaceholder>
                                                <img src={userDefault} alt="Jugador" />
                                            </JugadorPlaceholder>
                                            <CruzAgregar>+</CruzAgregar>
                                        </>
                                    )}
                                </Posicion>
                            </Linea>

                            <Linea>
                                {alineacion.mediocampistas.map((mediocampista, index) => (
                                    <Posicion key={index} onClick={() => handleOpenCreateModal(`mediocampista${index+1}`)}>
                                        {mediocampista ? (
                                            <>
                                                <JugadorPlaceholder>
                                                    <JugadorImagen src={`${URLImages}${escudosEquipos(mediocampista.id_equipo)}`} alt="Jugador" />
                                                </JugadorPlaceholder>
                                                <CruzAgregar>-</CruzAgregar>
                                                <JugadorNombre>{mediocampista.nombre} {mediocampista.apellido}</JugadorNombre>
                                            </>
                                        ) : (
                                            <>
                                                <JugadorPlaceholder>
                                                    <img src={userDefault} alt="Jugador" />
                                                </JugadorPlaceholder>
                                                <CruzAgregar>+</CruzAgregar>
                                            </>
                                        )}
                                    </Posicion>
                                ))}
                            </Linea>

                            <Linea>
                                {alineacion.defensores.map((defensor, index) => (
                                    <Posicion key={index} onClick={() => handleOpenCreateModal(`defensor${index+1}`)}>
                                        {defensor ? (
                                            <>
                                                <JugadorPlaceholder>
                                                    <JugadorImagen src={`${URLImages}${escudosEquipos(defensor.id_equipo)}`} alt="Jugador" />
                                                </JugadorPlaceholder>
                                                <CruzAgregar>-</CruzAgregar>
                                                <JugadorNombre>{defensor.nombre} {defensor.apellido}</JugadorNombre>
                                            </>
                                        ) : (
                                            <>
                                                <JugadorPlaceholder>
                                                    <img src={userDefault} alt="Jugador" />
                                                </JugadorPlaceholder>
                                                <CruzAgregar>+</CruzAgregar>
                                            </>
                                        )}
                                    </Posicion>
                                ))}
                            </Linea>

                            <Linea>
                                <Posicion onClick={() => handleOpenCreateModal('arquero')}>
                                    {alineacion.arquero ? (
                                        <>
                                            <JugadorPlaceholder>
                                                <JugadorImagen src={`${URLImages}${escudosEquipos(alineacion.arquero.id_equipo)}`} alt="Jugador" />
                                            </JugadorPlaceholder>
                                            <CruzAgregar>-</CruzAgregar>
                                            <JugadorNombre>{alineacion.arquero.nombre} {alineacion.arquero.apellido}</JugadorNombre>
                                        </>
                                    ) : (
                                        <>
                                            <JugadorPlaceholder>
                                                <img src={userDefault} alt="Jugador" />
                                            </JugadorPlaceholder>
                                            <CruzAgregar>+</CruzAgregar>
                                        </>
                                    )}
                                </Posicion>
                            </Linea>
                        </CanchaContainer> */}

                            <DreamTeamCardWrapper>
                                {formacion.map((cantidad, filaIndex) => {
                                    return (
                                        <Fila key={filaIndex}>
                                            {Array.from({ length: cantidad }).map((_, jugadorIndex) => {
                                                // Calcular el índice único, empezando desde 7 hasta 1
                                                const totalJugadores = formacion.reduce((acc, num) => acc + num, 0);
                                                const posicionIndex = totalJugadores - (formacion.slice(0, filaIndex).reduce((acc, num) => acc + num, 0) + jugadorIndex);

                                                // Buscar si hay un jugador en esta posición
                                                const jugador = dreamTeam?.find(j => j.posicion === String(posicionIndex));

                                                return (
                                                    <Jugador key={jugadorIndex}>
                                                        <LogoJugador>
                                                            {jugador ? (
                                                                <>
                                                                    <img
                                                                        className='logo-jugador-admin'
                                                                        src={`${URLImages}/${fotosJugadores(jugador.id_jugador)}`}
                                                                        alt='Jugador'
                                                                    />
                                                                    <span className='agregar-jugador eliminar' onClick={() => eliminarJugador(jugador)}>
                                                                        -
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <img
                                                                        className='logo-jugador-admin'
                                                                        src={`${URLImages}/${fotosJugadores(0)}`}
                                                                        alt='Jugador'
                                                                    />
                                                                    <span className='agregar-jugador' onClick={() => handleOpenCreateModal(posicionIndex)}>
                                                                        +
                                                                    </span>
                                                                </>
                                                            )}
                                                        </LogoJugador>
                                                        {jugador && <NombreJugador className='dt-admin'>{jugador.nombre} {jugador.apellido}</NombreJugador>}
                                                    </Jugador>
                                                );
                                            })}
                                        </Fila>
                                    );
                                })}

                                <SvgBackground>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 316 174">
                                        <g id="Group_4486" data-name="Group 4486" transform="translate(84.168)">
                                            <path
                                                id="Path_2174"
                                                d="M57 0h5.907v50.136a5.92 5.92 0 0 0 5.907 5.9H192.85a5.92 5.92 0 0 0 5.907-5.9V0h5.907v50.136a11.84 11.84 0 0 1-11.813 11.8H68.813A11.84 11.84 0 0 1 57 50.136z"
                                                data-name="Path 2174"
                                                transform="translate(-57)"
                                            ></path>
                                        </g>
                                        <path
                                            id="Path_2175"
                                            d="M11.813 150.407h90.813a76.778 76.778 0 0 0 110.748 0h90.813A11.839 11.839 0 0 0 316 138.61V0h-5.906v138.61a5.92 5.92 0 0 1-5.907 5.9H11.813a5.92 5.92 0 0 1-5.907-5.9V0H0v138.61a11.84 11.84 0 0 0 11.813 11.797zm193 0a70.761 70.761 0 0 1-93.619 0z"
                                            data-name="Path 2175"
                                        ></path>
                                    </svg>
                                </SvgBackground>
                            </DreamTeamCardWrapper>


                        </DreamTeamAlineacion>

                        <DreamTeamInfo>
                            <InfoTop>
                                <h2>¡Armá el <span>dreamteam</span> de la fecha!</h2>
                                <Divider color="var(--gray-300)" />
                            </InfoTop>
                            <ExplicativoContainer>
                                <Explicativo>
                                    <span>1</span> <p>Selecciona el jugador que quieres agregar</p>
                                </Explicativo>
                                <Explicativo>
                                    <span>2</span> <p>Una vez abierto el modal, tendras primero los jugadores destacados por los planilleros, y debajo, los jugadores que participaron en la ultima fecha</p>
                                </Explicativo>
                                <Explicativo>
                                    <span>3</span> <p>Elige a tu criterio el jugador en la posicion adecuada</p>
                                </Explicativo>
                                <Explicativo>
                                    <span>4</span> <p>Puedes cambiar el jugador seleccionado haciendo click en el mismo</p>
                                </Explicativo>
                                <Explicativo>
                                    <span>5</span> <p>¡Listo! ahora puedes armar el dreamteam de la fecha</p>
                                </Explicativo>
                                <Explicativo>
                                    <span><IoIosWarning /></span> <p>El boton limpiar formacion elimina por completo el dreamteam</p>
                                </Explicativo>
                            </ExplicativoContainer>
                        </DreamTeamInfo>
                    </DreamTeamWrapper>
                </DreamTeamContainer >
            }
            {
                isCreateModalOpen && (
                    <>
                        <ModalCreate
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            title={`Agregar jugador`}
                            onClickClose={closeModal}
                            form={
                                <>
                                    <ModalFormInputContainer>
                                        <Input
                                            name='jugador'
                                            type='text'
                                            placeholder="Buscar jugador"
                                            icon={<TbPlayFootball className='icon-input' />}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Divider color="var(--gray-300)" />
                                        Jugadores destacados
                                        <JugadoresContainer>
                                            {jdFiltrados.length > 0 ? (
                                                jdFiltrados.map(jugador => (
                                                    <JugadorContainer
                                                        key={jugador.id_jugador}
                                                        onClick={() => seleccionarJugador(jugador, selectedPosition)}
                                                    >
                                                        <JugadorImagen src={`${URLImages}${escudosEquipos(jugador.id_equipo)}`} />
                                                        <JugadorInfo>
                                                            <JugadorNombre>{jugador.nombre} {jugador.apellido}</JugadorNombre>
                                                            <JugadorEquipo>{nombresEquipos(jugador.id_equipo)}</JugadorEquipo>
                                                        </JugadorInfo>
                                                    </JugadorContainer>
                                                ))
                                            ) : (
                                                <p>No se encontraron jugadores destacados para la fecha seleccionada</p>
                                            )}
                                        </JugadoresContainer>
                                        Jugadores de la ultima fecha
                                        <JugadoresContainer>
                                            {/* Mostrar mensaje si no hay jugadores filtrados */}
                                            {filteredJugadores.length > 0 ? (
                                                filteredJugadores.map(jugador => (
                                                    <JugadorContainer
                                                        key={jugador.id_jugador}
                                                        onClick={() => seleccionarJugador(jugador, selectedPosition)}
                                                    >
                                                        <JugadorImagen src={`${URLImages}${escudosEquipos(jugador.id_equipo)}`} />
                                                        <JugadorInfo>
                                                            <JugadorNombre>{jugador.nombre} {jugador.apellido}</JugadorNombre>
                                                            <JugadorEquipo>{nombresEquipos(jugador.id_equipo)}</JugadorEquipo>
                                                        </JugadorInfo>
                                                    </JugadorContainer>
                                                ))
                                            ) : (
                                                <p>No se encontraron jugadores para la búsqueda.</p>
                                            )}
                                        </JugadoresContainer>
                                    </ModalFormInputContainer>
                                </>
                            }
                        />
                        <Overlay onClick={closeModal} />
                    </>
                )
            }
        </>
    );
};

export default DreamTeam;
