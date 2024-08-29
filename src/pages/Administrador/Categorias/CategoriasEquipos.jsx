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
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';

import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import { CategoriaEquiposEmpty } from './categoriasStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { EquipoBodyTemplate } from '../../../components/Table/TableStyles';

const CategoriasEquipos = () => {
    const { escudosEquipos, nombresEquipos } = useEquipos();

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const jugadoresList = useSelector((state) => state.jugadores.data);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { id_page } = useParams(); // Obtenemos el id desde la URL
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_page);
    const categoriasSelect = categoriasList.filter((categoria) => categoria.id_edicion == categoriaFiltrada.id_edicion && categoria.id_categoria !== categoriaFiltrada.id_categoria )

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_categoria: id_page,
        id_edicion: categoriaFiltrada.id_edicion,
        nombre_equipo: ''
    });

    const [formStateCategoria, handleFormChangeCategoria, resetFormCategoria] = useForm({
        id_categoriaVieja: id_page, 
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
        `${URL}/user/crear-equipo`, fetchEquipos, 'Registro creado correctamente.', "Error al crear el registro."
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
        };
        
        await crear(data);
        closeCreateModal();
        resetForm()
    };

    // ELIMINAR
    const [idEliminar, setidEliminar] = useState(null) 

    const eliminarEquipo = (id_equipo) => {
        openDeleteModal()
        setidEliminar(id_equipo)
    }

    const { eliminarPorId, isDeleting } = useCrud(
        `${URL}/user/eliminar-equipo`, fetchEquipos, 'Registro eliminado correctamente.', "Error al eliminar el registro."
    );

    const eliminarRegistros = async () => {
        try {
            await eliminarPorId(idEliminar);
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
    
    const categoriaEquiposs = equiposList.filter((equipo) => equipo.id_categoria == id_page)
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    const equipoSeleccionado = equiposList.find((equipo) => equipo.id_equipo == idEliminar)

    // Agregar acciones a la tabla
    const categoriasEquiposLink = categoriaEquiposs.map(categoria => ({
        ...categoria,
        eliminar: (
            <Button bg={"danger"} onClick={() => eliminarEquipo(categoria.id_equipo)}>
                <IoTrashOutline />
            </Button>
        ),
        actualizar: categoriasSelect.length > 0 ? (
            <Button bg={"import"} onClick={() => editarEquipo(categoria.id_equipo)}>
                Cambiar categoria
            </Button>
        ) : null,
        asignar: (
            <Button bg={"import"} onClick={() => navigate(`/admin/categorias/formato/${categoriaFiltrada.id_categoria}`)}>
                Asignar
            </Button>
        ),
        equipo: (
            <EquipoBodyTemplate>
                <img src={`${URLImages}${escudosEquipos(categoria.id_equipo)}`} alt={nombresEquipos(categoria.id_equipo)} />
                <span>{nombresEquipos(categoria.id_equipo)}</span>
            </EquipoBodyTemplate>
        )
    }));
    
useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos())
    }, []);

    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <NavLink to={`/admin/ediciones/categorias/${edicionFiltrada.id_edicion}`}>{edicionFiltrada.nombre_temporada}</NavLink>
                /
                <div>{categoriaFiltrada.nombre}</div>
            </MenuContentTop>
            <ContentNavWrapper>
                <li><NavLink to={`/admin/categorias/resumen/${id_page}`}>Resumen</NavLink></li>
                <li><NavLink to={`/admin/categorias/formato/${id_page}`}>Formato</NavLink></li>
                <li><NavLink to={`/admin/categorias/fixture/${id_page}`}>Fixture</NavLink></li>
                <li><NavLink to={`/admin/categorias/equipos/${id_page}`}>Equipos ({categoriaEquiposs.length})</NavLink></li>
                <li><NavLink to={`/admin/categorias/config/${id_page}`}>Configuración</NavLink></li>
            </ContentNavWrapper>
            <Button bg="success" color="white" onClick={openCreateModal}>
                <FiPlus />
                <p>Agregar equipo</p>
            </Button>
            {
                categoriaEquiposs.length > 0 ? (
                    <>
                        <Table
                            data={categoriasEquiposLink}
                            dataColumns={dataEquiposColumns}
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={id}
                            urlClick={`/admin/categorias/equipos/${id_page}/detalle/`}
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
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={agregarRegistro} disabled={isSaving}>
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
                            </>
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
                            `¿Estas seguro que quieres eliminar el equipo ${equipoSeleccionado.nombre}?`}
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
                                    {false ? (
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
