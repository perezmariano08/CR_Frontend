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
    JugadorEquipo
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
import { traerJugadoresDestacados, actualizarJugadoresDestacados, limpiarJugadoresDescatados, traerJugadoresPorCategoria } from '../../../utils/dataFetchers';
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';
import Overlay from '../../../components/Overlay/Overlay';
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import toast from 'react-hot-toast'

const DreamTeam = ({ id_categoria, jornada }) => {
    const { 
        isCreateModalOpen, openCreateModal, closeCreateModal 
    } = useModalsCrud();

    const [jugadoresDestacados, setJugadoresDestacados] = useState([]);
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

    useEffect(() => {
        if (isCreateModalOpen) {
            const fetchJugadoresDestacados = async () => {
                const jugadores = await traerJugadoresDestacados(id_categoria, jornada);
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
        setSearchTerm(''); // Limpiar el input al cerrar el modal
        setFilteredJugadores([]); // Limpiar la lista filtrada
    };

    // Función para obtener jugadores de la categoría
    const fetchJugadores = async () => {
        const data = await traerJugadoresPorCategoria(id_categoria, jornada);
        if (data) {
            setJugadores(data);
            setFilteredJugadores(data);
        }
    };

    // Filtrar jugadores según el término de búsqueda
    useEffect(() => {
        const filtered = jugadores.filter(jugador => 
            `${jugador.nombre} ${jugador.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJugadores(filtered);
    }, [searchTerm, jugadores]);

    const seleccionarJugador = async (jugador, posicion) => {
        try {
            const data = {
                id_partido: jugador.id_partido,
                id_jugador: jugador.id_jugador,
                id_equipo: jugador.id_equipo,
                posicion: posicion,
                jornada: jornada
            };
    
            const loadingToastId = toast.loading('Agregando jugador...');
            const resultado = await actualizarJugadoresDestacados(data);
            
            // Verifica el resultado antes de actualizar la alineación
            if (resultado && resultado.message === 'Jugador destacado actualizado correctamente') {
                setAlineacion(prevAlineacion => {
                    const nuevaAlineacion = { ...prevAlineacion };
                    if (posicion === 'arquero') {
                        nuevaAlineacion.arquero = jugador;
                    } else if (posicion.startsWith('defensor')) {
                        const index = parseInt(posicion.replace('defensor', ''), 10);
                        nuevaAlineacion.defensores[index] = jugador;
                    } else if (posicion.startsWith('mediocampista')) {
                        const index = parseInt(posicion.replace('mediocampista', ''), 10);
                        nuevaAlineacion.mediocampistas[index] = jugador;
                    } else if (posicion === 'delantero') {
                        nuevaAlineacion.delantero = jugador;
                    }
                    return nuevaAlineacion;
                });
                toast.success('Jugador agregado con éxito');
            } else {
                toast.error('Error al agregar el jugador');
            }
            
            toast.dismiss(loadingToastId);
            closeCreateModal();
        } catch (error) {
            console.error('Error al seleccionar el jugador', error);
            toast.error('Error al agregar el jugador');
            toast.dismiss(loadingToastId);
        }
    };
    
    const limpiarFormacion = async (event) => {
        event.preventDefault();
        const loadingToastId = toast.loading('Limpiando formación...');
        try {
            const response = await limpiarJugadoresDescatados(jornada);
            if (response.status = 200) {
                setAlineacion({
                    arquero: null,
                    defensores: Array(2).fill(null),
                    mediocampistas: Array(3).fill(null),
                    delantero: null,
                });
                toast.success('Formacion limpiada con éxito')
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

    return (
        <>
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

                        {/* Cancha con Alineación */}
                        <CanchaContainer>
                            {/* Delantero */}
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

                            {/* Mediocampistas */}
                            <Linea>
                                {alineacion.mediocampistas.map((mediocampista, index) => (
                                    <Posicion key={index} onClick={() => handleOpenCreateModal(`mediocampista${index}`)}>
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

                            {/* Defensores */}
                            <Linea>
                                {alineacion.defensores.map((defensor, index) => (
                                    <Posicion key={index} onClick={() => handleOpenCreateModal(`defensor${index}`)}>
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

                            {/* Arquero */}
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
                        </CanchaContainer>
                    </DreamTeamAlineacion>

                    <DreamTeamInfo>
                        hola
                    </DreamTeamInfo>
                </DreamTeamWrapper>
            </DreamTeamContainer>

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
                                            icon={<TbPlayFootball className='icon-input'/>}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Divider color="var(--gray-300)" />
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
                                        Jugadores destacados
                                        <JugadoresContainer>
                                            {jugadoresDestacados.length > 0 && (
                                                jugadoresDestacados.map(jugador => (
                                                    <JugadorContainer 
                                                        key={jugador.id_jugador}
                                                        onClick={() => seleccionarJugador(jugador, selectedPosition)}
                                                    >
                                                        <JugadorImagen src={`${URLImages}${escudosEquipos(jugador.id_equipo)}`}  />
                                                        <JugadorInfo>
                                                            <JugadorNombre>{jugador.nombre} {jugador.apellido}</JugadorNombre>
                                                            <JugadorEquipo>{nombresEquipos(jugador.id_equipo)}</JugadorEquipo>
                                                        </JugadorInfo>
                                                    </JugadorContainer>
                                                ))
                                            )}
                                        </JugadoresContainer>
                                    </ModalFormInputContainer>
                                </>
                            }
                        />
                    </>
                )
            }
        </>
    );
};

export default DreamTeam;
