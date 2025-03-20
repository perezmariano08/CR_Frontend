import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import Table from '../../../components/Table/Table';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { HandlerFechasContainer, HandlerFechasWrapper, InputRadioContainer, InputRadioWrapper, ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import Axios from 'axios';
import { formatedDate, URL, URLImages } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../../../components/Select/Select';
import { fetchExpulsados } from '../../../redux/ServicesApi/expulsadosSlice';
import { dataExpulsadosColumn } from '../../../Data/Expulsados/DataExpulsados';
import { EquipoBodyTemplate } from '../../../components/Table/TableStyles';
import { BiMessageDetail, BiSolidEdit } from 'react-icons/bi';
import { IoIosArrowUp, IoIosArrowDown  } from "react-icons/io";
import { TablaExpulsadosWrapper } from './ExpulsadosStyles';
import useModalsCrud from '../../../hooks/useModalsCrud';
import useForm from '../../../hooks/useForm';
import { useCrud } from '../../../hooks/useCrud';
import { BsCalendar2Event } from 'react-icons/bs';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';
import { useEquipos } from '../../../hooks/useEquipos';
import Input from '../../../components/UI/Input/Input';

const Expulsados = () => {
    //Hooks
    const { 
        isCreateModalOpen, openCreateModal, closeCreateModal, 
        isDeleteModalOpen, openDeleteModal, closeDeleteModal,
        isDescripcionModalOpen, openDescripcionModal, closeDescripcionModal,
        isUpdateModalOpen, openUpdateModal, closeUpdateModal,
    } = useModalsCrud();
    const { nombresEquipos } = useEquipos();
    // Manejo del form
    const [formState, handleChange, resetForm, setFormState] = useForm({ 
        id_partido: '',
        id_jugador: '',
        id_equipo: '',
        id_categoria: '',
        minuto: '',
        descipcion: '',
        motivo: '',
        estado: '',
        fechas: '',
        fechas_restantes: '',
        multa: '',
        id_expulsion: ''
    })

    const dispatch = useDispatch();
    const equiposList = useSelector((state) => state.equipos.data);
    const expulsadosList = useSelector((state) => state.expulsados.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const categorias = useSelector((state) => state.categorias.data);
    const categoriasEdicion = categorias.filter((c) => c.id_edicion == formState.id_edicion) 
    const temporadas = useSelector((state) => state.temporadas.data);
    const equiposCategoria = temporadas.filter((t) => t.id_categoria == formState.id_categoria)
    const planteles = useSelector((state) => state.planteles.data);
    const jugadoresEquipo = planteles.filter((p) => p.id_equipo == formState.id_equipo) 
    const partidos = useSelector((state) => state.partidos.data);
    const token = localStorage.getItem('token')

    const [isSaving, setIsSaving] = useState(false);
    const [originalState, setOriginalState] = useState(null);
    const [infoPartidoExpulsion, setInfoPartidoExpulsion] = useState(null);
    const { actualizar, isUpdating } = useCrud(
        `${URL}/admin/update-expulsion`, fetchExpulsados, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const [searchTerm, setSearchTerm] = useState('');

    const filteredExpulsados = expulsadosList.filter((expulsado) =>
        expulsado.jugador.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEdicionChange = (e) => {
        const { name, value } = e.target;
        // Reseteamos categoría, equipo y jugador cuando se cambia la edición
        setFormState({
            ...formState,
            [name]: value,
            id_categoria: '',  // Reset categoría
            id_equipo: '',     // Reset equipo
            id_jugador: ''     // Reset jugador
        });
    };

    const handleCategoriaChange = (e) => {
        const { name, value } = e.target;

        // Reseteamos equipo y jugador cuando se cambia la categoría
        setFormState({
            ...formState,
            [name]: value,
            id_equipo: '',     
            id_jugador: '' 
        });
    };

    const handleEquipoChange = (e) => {
        const { name, value } = e.target;

        // Reseteamos el jugador cuando se cambia el equipo
        setFormState({
            ...formState,
            [name]: value,
            id_jugador: ''     // Reset jugador
        });
    };

    const abrirDescripcion = (expulsado) => {
        const partidoExpulsion = (({ id_partido, id_equipoLocal, id_equipoVisita, dia, jornada, planillero, cancha }) => 
            ({ id_partido, id_equipoLocal, id_equipoVisita, dia, jornada, planillero, cancha }))(partidos.find((p) => p.id_partido === expulsado.id_partido) || {});

        const fechaConvertida = formatedDate(partidoExpulsion.dia);
        const equipoLocal = nombresEquipos(partidoExpulsion.id_equipoLocal);
        const equipoVisita = nombresEquipos(partidoExpulsion.id_equipoVisita);

        const descripcionHTML = `
            <p><strong>Día:</strong> ${fechaConvertida || 'No disponible'}</p>
            <p><strong>${equipoLocal || 'No disponible'} vs ${equipoVisita || 'No disponible'}</p>
            <p><strong>Jornada:</strong> ${partidoExpulsion.jornada || 'No disponible'}</p>
            <p><strong>Planillero:</strong> ${partidoExpulsion.planillero || 'No disponible'}</p>
            <p><strong>Cancha:</strong> ${partidoExpulsion.cancha || 'No disponible'}</p>
        `;
    
        setInfoPartidoExpulsion(descripcionHTML);
        openDescripcionModal();
    };

    const expulsados = filteredExpulsados.map((expulsado) => {
        // Buscar el equipo correspondiente en equiposList
        const equipo = equiposList.find(e => e.id_equipo === expulsado.id_equipo);
    
        // Si se encuentra el equipo, asignar el nombre y la imagen
        const nombreEquipo = equipo ? equipo.nombre : 'Equipo no encontrado';
        const imagenEquipo = equipo.img ? `${URLImages}/${equipo.img}` : `${URLImages}/uploads/Equipos/team-default.png`;
    
        return {
            ...expulsado,
            acciones: (
                <div style={{display: "flex", gap: "10px"}}>
                    <Button bg={"danger"} onClick={() => eliminarExpulsion(expulsado.id_expulsion)}>
                        <IoTrashOutline />
                    </Button>
                    <Button bg={"import"} onClick={() => editarSuspension(expulsado.id_expulsion)}>
                        <BiSolidEdit />
                    </Button>
                    <Button bg={"export"} onClick={() => abrirDescripcion(expulsado)}>
                        <BiMessageDetail />
                    </Button>
                </div>
            ),
            id_equipo: (
                <EquipoBodyTemplate>
                    <img src={imagenEquipo} alt={nombreEquipo} />
                    <span>{nombreEquipo}</span>
                </EquipoBodyTemplate>
            ),
            fechas: (
                <>
                    {
                        `${expulsado.fechas - expulsado.fechas_restantes} / ${expulsado.fechas}`
                    }
                </>
            ),
            multa: (
                <>
                    {
                        expulsado.multa === 'S' ? (
                            `SI`
                        ) : (
                            `NO`
                        )
                    }
                </>
            ),
        };
    });
    
    const agregarDato = async () => {
        const { id_edicion, id_categoria, id_equipo, id_jugador } = formState;
    
        if (id_edicion !== '' && id_categoria !== '' && id_equipo !== '' && id_jugador !== '') {
            setIsSaving(true);
            try {
                const response = await Axios.post(`${URL}/admin/crear-expulsion`, {
                    id_edicion,
                    id_categoria,
                    id_equipo,
                    id_jugador
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success(response.mensaje);
                resetForm();
                closeCreateModal();
                dispatch(fetchExpulsados());
                setIsSaving(false);
            } catch (error) {
                console.log(error);
                if (error.response && error.response.data) {
                    toast.error(error.response.data);
                } else {
                    toast.error('Error al crear la expulsion');
                }
            } finally {
                setIsSaving(false);
            }
        } else {
            setIsSaving(false);
        }
    };
    
    const eliminarExpulsion = (id_expulsion) => {
        const expulsionAEliminar = expulsadosList.find((e) => e.id_expulsion === id_expulsion)
        if (expulsionAEliminar) {
            setFormState({
                id_expulsion: expulsionAEliminar.id_expulsion,
                id_jugador: expulsionAEliminar.id_jugador,
                id_categoria: expulsionAEliminar.id_categoria
            });
            openDeleteModal()
        }
        openDeleteModal()
    }

    const deleteExpulsion = async () => {
        const { id_expulsion, id_categoria, id_jugador } = formState;
        if (id_expulsion && id_categoria && id_jugador) {
            try {
                setIsSaving(true);
                await Axios.delete(`${URL}/admin/borrar-expulsion`, {
                    data: { id_expulsion, id_categoria, id_jugador },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success('Expulsión eliminada');
                resetForm();
                dispatch(fetchExpulsados());
                closeDeleteModal(); 
            } catch (error) {
                console.log(error);
                if (error.response && error.response.data) {
                    toast.error(error.response.data);
                } else {
                    toast.error('Error al eliminar la expulsión');
                }
                
            } finally {
                setIsSaving(false);
            }
        } else {
            toast.error('Faltan datos para eliminar la expulsión');
        }
    };
    
    const editarSuspension = (id_expulsion) => {
        const expulsionAEditar = expulsadosList.find((e) => e.id_expulsion === id_expulsion);
        if (expulsionAEditar) {
            setFormState({
                id_expulsion: expulsionAEditar.id_expulsion,
                fechas: expulsionAEditar.fechas,
                fechas_restantes: expulsionAEditar.fechas_restantes,
                multa: expulsionAEditar.multa
            });
            setOriginalState({
                fechas: expulsionAEditar.fechas,
                fechas_restantes: expulsionAEditar.fechas_restantes,
                multa: expulsionAEditar.multa
            });
            openUpdateModal();
        }
    };

    const isFormChanged = () => {
        return (
            formState.fechas !== originalState.fechas ||
            formState.fechas_restantes !== originalState.fechas_restantes ||
            formState.multa !== originalState.multa
        );
    };

    const actualizarDato = async () => {
        const data = { 
            id_expulsion: formState.id_expulsion,
            fechas: formState.fechas,
            fechas_restantes: formState.fechas_restantes,
            multa: formState.multa
        };
        await actualizar(data);
        closeUpdateModal();
    };

    const aumentarValor = (campo) => {
        if (campo === 'fechas') {
            // Aumentar fechas
            setFormState(prevState => ({
                ...prevState,
                fechas: prevState.fechas + 1,
                fechas_restantes: Math.min(prevState.fechas + 1, prevState.fechas_restantes)
            }));
        } else if (campo === 'fechas_restantes') {
            // Aumentar fechas_restantes solo si no es mayor que fechas
            if (formState.fechas_restantes < formState.fechas) {
                setFormState(prevState => ({
                    ...prevState,
                    fechas_restantes: prevState.fechas_restantes + 1
                }));
            }
        }
    };
    
    const disminuirValor = (campo) => {
        if (campo === 'fechas') {
            // Disminuir fechas solo si es mayor que 1
            if (formState.fechas > 1) {
                setFormState(prevState => {
                    const newFechas = prevState.fechas - 1;
                    return {
                        ...prevState,
                        fechas: newFechas,
                        fechas_restantes: Math.min(newFechas, prevState.fechas_restantes) // Asegurarse de que fechas_restantes no sea mayor
                    };
                });
            }
        } else if (campo === 'fechas_restantes') {
            // Disminuir fechas_restantes solo si es mayor que 0
            if (formState.fechas_restantes > 0) {
                setFormState(prevState => ({
                    ...prevState,
                    fechas_restantes: prevState.fechas_restantes - 1
                }));
            }
        }
    };
    
    useEffect(() => {
        dispatch(fetchExpulsados());
        dispatch(fetchEdiciones());
        dispatch(fetchEquipos());
        dispatch(fetchJugadores());
        dispatch(fetchCategorias());
        dispatch(fetchTemporadas());
    }, []);

    useEffect(() => {
        dispatch(fetchPlanteles({ id_equipo: formState.id_equipo, id_categoria: formState.id_categoria }));
    }, [formState.id_equipo, formState.id_categoria]);

    return (
        <Content>
            <Button bg={'success'} onClick={openCreateModal}>
                <FiPlus />
                Agregar expulsión
            </Button>
            <Input 
                placeholder="Buscar jugador..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            <TablaExpulsadosWrapper>
                <h2>Suspensiones activas</h2>
                {
                    expulsados.filter((e) => e.fechas_restantes > 0).length > 0 ? (
                        <Table 
                            data={expulsados.filter((e) => e.fechas_restantes > 0)} 
                            dataColumns={dataExpulsadosColumn} 
                            paginator={false}
                            selection={false}
                            sortable={false}
                        />
                    ) : (
                        <p>No hay suspensiones vigentes</p>
                    )
                }
            </TablaExpulsadosWrapper>
            <TablaExpulsadosWrapper>
                <h2>Suspensiones cumplidas</h2>
                {
                    expulsados.filter((e) => e.fechas_restantes === 0).length > 0 ? (
                        <Table 
                            data={expulsados.filter((e) => e.fechas_restantes === 0)} 
                            dataColumns={dataExpulsadosColumn} 
                            selection={false}
                            sortable={false}
                        />
                    ) : (
                        <p>No hay suspensiones cumplidas</p>
                    )
                }
            </TablaExpulsadosWrapper>
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear expulsión`}
                        onClickClose={closeCreateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={agregarDato} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                        </>
                                    ) : (
                                        <>
                                            <IoCheckmark />
                                            Guardar
                                        </>
                                    )}
                                </Button>
                            </>
                        }
                        form={
                            <>
                                <ModalFormInputContainer>
                                    Edición
                                    <Select 
                                        name={'id_edicion'}
                                        data={ediciones}
                                        placeholder={'Seleccionar edicion'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_edicion"}
                                        column='nombre_temporada'
                                        value={formState.id_edicion}
                                        onChange={handleEdicionChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Categoria
                                    <Select 
                                        name={'id_categoria'}
                                        data={categoriasEdicion}
                                        placeholder={'Seleccionar categoria'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_categoria"}
                                        column='nombre'
                                        value={formState.id_categoria}
                                        onChange={handleCategoriaChange}
                                        disabled={!formState.id_edicion}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Equipo
                                    <Select 
                                        name={'id_equipo'}
                                        data={equiposCategoria}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        column='nombre_equipo'
                                        value={formState.id_equipo}
                                        onChange={handleEquipoChange}
                                        disabled={!formState.id_categoria}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Jugador
                                    <Select 
                                        name={'id_jugador'}
                                        data={planteles}
                                        placeholder={'Seleccionar jugador'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_jugador"}
                                        column='jugador'
                                        value={formState.id_jugador}
                                        onChange={handleChange}
                                        disabled={!formState.id_equipo}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeCreateModal} />
                </>
            }
            {
                isDeleteModalOpen && <>
                    <ModalDelete initial={{ opacity: 0 }}
                        animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        // message={`${articuloPlural} ${plural}`}
                        text={"¿Estas seguro que deseas eliminar esta expulsión?"}
                        onClickClose={closeDeleteModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeDeleteModal}>
                                    <IoClose />
                                    No
                                </Button>
                                <Button color={"success"} onClick={deleteExpulsion} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                        </>
                                    ) : (
                                        <>
                                            <IoCheckmark />
                                            Si
                                        </>
                                    )}
                                </Button>
                            </>
                        }
                    />
                    <Overlay onClick={closeDeleteModal} />
                </>
            }
            {
                isUpdateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Editar suspensión`}
                        onClickClose={closeUpdateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeUpdateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={actualizarDato} disabled={isUpdating || !isFormChanged()}>
                                    {isUpdating ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Actualizando
                                        </>
                                    ) : (
                                        <>
                                            <IoCheckmark />
                                            Actualizar
                                        </>
                                    )}
                                </Button>
                            </>
                        }
                        form={
                            <>
                                <ModalFormInputContainer>
                                Fechas de suspensión
                                <HandlerFechasWrapper>
                                    <Input 
                                        name='fechas'
                                        placeholder="Ejemplo: 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.fechas}
                                        readOnly // O puedes quitar esto si prefieres permitir edición directa
                                    />
                                    <HandlerFechasContainer>
                                        <button type="button"  onClick={() => aumentarValor('fechas')}>
                                            <IoIosArrowUp/>
                                        </button>
                                        <button type="button" onClick={() => disminuirValor('fechas')}>
                                            <IoIosArrowDown/>
                                        </button>
                                    </HandlerFechasContainer>
                                </HandlerFechasWrapper>
                                Fechas restantes
                                    <HandlerFechasWrapper>
                                        <Input 
                                            name='fechas_restantes'
                                            placeholder="Ejemplo: 1" 
                                            icon={<BsCalendar2Event className='icon-input'/>} 
                                            value={formState.fechas_restantes}
                                            readOnly // O puedes quitar esto si prefieres permitir edición directa
                                        />
                                        <HandlerFechasContainer>
                                        <button type="button" onClick={() => aumentarValor('fechas_restantes')}>
                                            <IoIosArrowUp/>
                                        </button>
                                        <button type="button" onClick={() => disminuirValor('fechas_restantes')}>
                                            <IoIosArrowDown/>
                                        </button>
                                        </HandlerFechasContainer>
                                    </HandlerFechasWrapper>
                                    Multa
                                    <InputRadioContainer>
                                        <InputRadioWrapper>
                                            <label htmlFor={'multa-si'}>
                                                Sí
                                            </label>
                                            <input 
                                                id={'multa-si'} 
                                                type='radio' 
                                                name='multa' 
                                                value={'S'} 
                                                checked={formState.multa === 'S'} 
                                                onChange={handleChange} 
                                            />
                                        </InputRadioWrapper>

                                        <InputRadioWrapper>
                                            <label htmlFor="multa-no">
                                                No
                                            </label>
                                            <input 
                                                id={'multa-no'} 
                                                type='radio' 
                                                name='multa' 
                                                value={'N'} 
                                                checked={formState.multa === 'N'} 
                                                onChange={handleChange} 
                                            />
                                        </InputRadioWrapper>
                                    </InputRadioContainer>

                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeUpdateModal} />
                </>
            }
            {
                isDescripcionModalOpen && <>
                    <ModalCreate 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDescripcionModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Detalle de la expulsión`}
                        onClickClose={closeDescripcionModal}
                        texto={<div dangerouslySetInnerHTML={{ __html: infoPartidoExpulsion }} />}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeDescripcionModal}>
                                    <IoClose />
                                    Cerrar
                                </Button>
                            </>
                        }
                    />
                    <Overlay onClick={closeDescripcionModal} />
                </>
            }
        </Content>
    );
};

export default Expulsados;
