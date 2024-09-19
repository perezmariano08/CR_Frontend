import React, { useEffect, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import Table from '../../../components/Table/Table';
import { ContentNavWrapper, MenuContentTop } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer  } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { URL, URLImages } from '../../../utils/utils';
import { LoaderIcon, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';

import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import { CategoriaEquiposEmpty, EquipoExiste, EquipoExisteDivider, EquipoExisteEscudo, EquipoExisteItem, EquipoExisteLista, EquipoNoExiste } from './categoriasStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { EquipoBodyTemplate, EstadoBodyTemplate } from '../../../components/Table/TableStyles';
import CategoriasMenuNav from './CategoriasMenuNav';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';

const CategoriasEquipos = () => {
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const jugadoresList = useSelector((state) => state.jugadores.data);

    const temporadas = useSelector((state) => state.temporadas.data);
    const equiposTemporada = temporadas.filter((t) => t.id_categoria == id_categoria)
    
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const categoriasSelect = categoriasList.filter((categoria) => categoria.id_edicion == categoriaFiltrada.id_edicion && categoria.id_categoria !== categoriaFiltrada.id_categoria )

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_categoria: id_categoria,
        id_edicion: categoriaFiltrada.id_edicion,
        nombre_equipo: ''
    });

    const [formStateCategoria, handleFormChangeCategoria, resetFormCategoria] = useForm({
        id_categoriaVieja: id_categoria, 
        id_categoria: categoriasSelect.length > 0 ? categoriasSelect[0].id_categoria : null
    });

    const isFormEmpty = !formState.nombre_equipo.trim();

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { 
        isCreateModalOpen, openCreateModal, closeCreateModal,
        isDeleteModalOpen, openDeleteModal, closeDeleteModal,
        isUpdateModalOpen, openUpdateModal, closeUpdateModal,
    } = useModalsCrud();

    // Constantes del modulo

    const id = "id_equipo"

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-equipo`, fetchTemporadas, 'Registro creado correctamente.', "Error al crear el registro."
    );

    // Para el segundo formulario de creación
    const { crear: asignarTemporada, isSaving: isSavingAsignacionEquipo } = useCrud(
        `${URL}/user/insertar-equipo-temporada`, 
        fetchTemporadas, 
        'Registro del jugador creado correctamente.', 
        "Error al crear el jugador."
    );

    const agregarRegistro = async () => {
        if (!formState.nombre_equipo.trim()) {
            toast.error("Completá los campos.");
            return;
        }

        if (formState.nombre_equipo.length < 3 ) {
            toast.error("Ingrese al menos 3 caracteres.");
            return;
        }

        if (equiposList.some(a => a.nombre === formState.nombre_equipo.trim())) {
            toast.error(`El equipo ya existe en el torneo.`);
            return;
        }
        
        const data = {
            id_categoria: formState.id_categoria,
            id_edicion: formState.id_edicion,
            nombre: formState.nombre_equipo.trim(),
            id_zona: null
        };
        
        await crear(data);
        closeCreateModal();
        resetForm()
    };

    const asignarRegistro = async (id_equipo) => {
        if (equiposTemporada.find(e => e.id_equipo === id_equipo)) {
            toast.error(`El equipo ya pertenece a esta categoria.`);
            return;
        }

        const data = {
            id_categoria: formState.id_categoria,
            id_edicion: formState.id_edicion,
            id_equipo: id_equipo,
            id_zona: null
        };
        
        await asignarTemporada(data);
        closeCreateModal();
        resetForm()
    };

    // ELIMINAR
    const [idEliminar, setidEliminar] = useState(null) 

    const eliminarEquipo = (id_equipo) => {
        openDeleteModal()
        setidEliminar(id_equipo)
    }

    const { eliminarPorData, isDeleting } = useCrud(
        `${URL}/user/eliminar-equipo-temporada`, fetchTemporadas, 'Registro eliminado correctamente.', "Error al eliminar el registro."
    );

    const eliminarRegistros = async () => {
        const data = {
            id_categoria: formState.id_categoria,
            id_edicion: formState.id_edicion,
            id_equipo: idEliminar,
        }
        console.log(data)        

        try {
            await eliminarPorData(data);
        } catch (error) {
            console.error("Error eliminando años:", error);
        } finally {
            closeDeleteModal()
        }
    };

    // ACTUALIZAR
    const [idEditar, setidEditar] = useState(null) 

    const editarEquipo = (id_equipo) => {
        openUpdateModal()
        setidEditar(id_equipo)
    }
    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/actualizar-categoria-equipo`, fetchEquipos, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        const data = { 
            id_categoriaNueva: formStateCategoria.id_categoria,
            id_equipo: idEditar,
        }
        await actualizar(data);
        closeUpdateModal()
    };
    
    const categoriaEquiposs = equiposList.filter((equipo) => equipo.id_categoria == id_categoria)
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    const equipoSeleccionado = equiposList.find((equipo) => equipo.id_equipo == idEliminar)

    // Agregar acciones a la tabla
    const categoriasEquiposLink = equiposTemporada.map(equipo => ({
        ...equipo,
        eliminar: (
            <Button bg={"danger"} onClick={() => eliminarEquipo(equipo.id_equipo)}>
                <IoTrashOutline />
            </Button>
        ),
        actualizar: categoriasSelect.length > 0 ? (
            <Button bg={"import"} onClick={() => editarEquipo(equipo.id_equipo)}>
                Cambiar categoria
            </Button>
        ) : null,
        asignar: 
            equipo.vacante ? <EstadoBodyTemplate $bg={"success"}>
            ASIGNADA
        </EstadoBodyTemplate> :   
        (
            <Button bg={"import"} onClick={() => navigate(`/admin/categorias/formato/${equipo.id_categoria}`)}>
                Asignar
            </Button>
        ),
        equipo: (
            <EquipoBodyTemplate>
                <img src={`${URLImages}${escudosEquipos(equipo.id_equipo)}`} alt={nombresEquipos(equipo.id_equipo)} />
                <span>{nombresEquipos(equipo.id_equipo)}</span>
            </EquipoBodyTemplate>
        ),
        jugadores_con_dni: 
            equipo.jugadores_con_dni === 1 ? (
                `${equipo.jugadores_con_dni} jugador`
            ) : `${equipo.jugadores_con_dni} jugadores`,
        jugadores_sin_dni: equipo.jugadores_sin_dni === 1 ? (
            `${equipo.jugadores_sin_dni} jugador`
        ) : `${equipo.jugadores_sin_dni} jugadores`,
    }));

    const [crearEquipo, setCrearEquipo] = useState(false);

    const manejarCrearEquipo = () => {
        setCrearEquipo(true); // Cambia el estado para mostrar el formulario de creación
    };

    const [idAsignar, setIdAsignar] = useState(null) 

    const manejoGuardarEquipo = (id_equipo) => {
        // Lógica para guardar el nuevo equipo
        setCrearEquipo(false); // Opcional, para cerrar el formulario después de guardar
        setIdAsignar(id_equipo)
        alert(id_equipo)
        asignarRegistro(id_equipo)
    };
    
useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos())
        dispatch(fetchTemporadas())
        if (isCreateModalOpen) {
            // Cada vez que se abra el modal, resetear el estado a false
            setCrearEquipo(false);
            resetForm()
        }
    }, [isCreateModalOpen]);

    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <NavLink to={`/admin/ediciones/categorias/${edicionFiltrada.id_edicion}`}>{edicionFiltrada.nombre_temporada}</NavLink>
                /
                <div>{categoriaFiltrada.nombre}</div>
            </MenuContentTop>
            <CategoriasMenuNav id_categoria={id_categoria}/>
            <Button bg="success" color="white" onClick={openCreateModal}>
                <FiPlus />
                <p>Agregar equipo</p>
            </Button>
            {
                equiposTemporada.length > 0 ? (
                    <>
                        <Table
                            data={categoriasEquiposLink}
                            dataColumns={dataEquiposColumns}
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={id}
                            urlClick={`/admin/categorias/equipos/${id_categoria}/detalle/`}
                            rowClickLink
                        />
                    </>
                ) : (
                    <CategoriaEquiposEmpty>
                        <p>No se han encontrado equipos.</p>
                    </CategoriaEquiposEmpty>
                    
                )
            }
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Agregar equipo`}
                        onClickClose={closeCreateModal}
                        buttons={
                            crearEquipo && <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={agregarRegistro} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Guardando
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
                            !crearEquipo ? 
                            <ModalFormInputContainer>
                                nombre
                                <Input 
                                    name='nombre_equipo'
                                    type='text' 
                                    placeholder="Nombre" 
                                    icon={<BsCalendar2Event className='icon-input'/>} 
                                    value={formState.nombre_equipo}
                                    onChange={handleFormChange}
                                />
                                <p style={{color: '#a8a8a8', textTransform: 'uppercase'}}>ingresar al menos 3 caracateres</p>
                            </ModalFormInputContainer>
                            : <ModalFormInputContainer>
                                nombre
                                <Input 
                                    name='nombre_equipo'
                                    type='text' 
                                    placeholder="Nombre" 
                                    icon={<BsCalendar2Event className='icon-input'/>} 
                                    value={formState.nombre_equipo}
                                    onChange={handleFormChange}
                                />
                            </ModalFormInputContainer>
                        }
                        texto={
                            !crearEquipo &&
                            formState.nombre_equipo.length >= 3 && (
                                equiposList.find((e) => 
                                    e.nombre.toLowerCase().includes(formState.nombre_equipo.trim().toLowerCase())
                                ) 
                                ? 
                                <EquipoExiste>
                                    <h2>Equipos en tu torneo</h2>
                                    <EquipoExisteLista>
                                    {
                                        equiposList
                                            .filter((e) => 
                                                e.nombre.toLowerCase().includes(formState.nombre_equipo.trim().toLowerCase())
                                            )
                                            .map((e) => (
                                                <EquipoExisteItem key={e.id_equipo}>
                                                    <EquipoExisteEscudo>
                                                        <img src={`${URLImages}${escudosEquipos(e.id_equipo)}`} alt={nombresEquipos(e.id_equipo)} />
                                                        {e.nombre}
                                                    </EquipoExisteEscudo>
                                                    <Button color={'success'} onClick={() => asignarRegistro(e.id_equipo)}>
                                                        Seleccionar
                                                    </Button>
                                                </EquipoExisteItem>
                                            ))
                                    }
                                    </EquipoExisteLista>
                                    <EquipoExisteDivider/>
                                    <EquipoNoExiste>
                                        <p>¿No encuentras el equipo?</p>
                                        <Button bg={'success'} onClick={manejarCrearEquipo}>
                                            Crear equipo
                                        </Button>
                                    </EquipoNoExiste>
                                </EquipoExiste>
                                :
                                <EquipoNoExiste>
                                    <p>Parece que no tienes ningún equipo llamado "<span>{formState.nombre_equipo}</span>",
                                    pero puedes crearlo</p>
                                    <Button bg={'success'} onClick={manejarCrearEquipo}>
                                        Crear equipo
                                    </Button>
                                </EquipoNoExiste>
                            )
                        }
                    />
                    <Overlay onClick={closeCreateModal} />
                </>
            }
            {
                isDeleteModalOpen && (
                    <>
                        <ModalDelete
                            text={
                            `¿Estas seguro que quieres eliminar el equipo ${equipoSeleccionado.nombre} de la categoria?`}
                            animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={closeDeleteModal}
                            buttons={
                            <>
                                <Button color={"danger"} onClick={closeDeleteModal}>
                                    <IoClose />
                                    No
                                </Button>
                                <Button color={"success"} onClick={eliminarRegistros} disabled={''}>
                                    {isDeleting ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Eliminando
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
                        <Overlay onClick={closeDeleteModal}/>
                    </>
                    
                )
            }
            {
                isUpdateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Cambiar de categoria`}
                        onClickClose={closeUpdateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeUpdateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={actualizarDato} disabled={isUpdating}>
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
                                    categoría
                                    <Select 
                                        name={'id_categoria'}
                                        data={categoriasSelect}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_categoria"}
                                        column='nombre'
                                        value={formStateCategoria.id_categoria}
                                        onChange={handleFormChangeCategoria}
                                    >
                            </Select>
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeCreateModal} />
                </>
            }
        </Content>
    );
};

export default CategoriasEquipos;
