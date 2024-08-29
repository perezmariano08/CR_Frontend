import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoPencil, IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { LuDownload, LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import { ContentNavWrapper, ContentTitle, MenuContentTop } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { dataEdicionesColumns } from '../../../Data/Ediciones/DataEdiciones';
import Axios from 'axios';
import { URL, URLImages } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { CategoriasEdicionEmpty, TablasTemporadaContainer, TablaTemporada } from '../Ediciones/edicionesStyles';
import useForm from '../../../hooks/useForm';
import { TbPlayFootball } from 'react-icons/tb';
import Select from '../../../components/Select/Select';

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import { CategoriaEquiposEmpty, EquipoDetalleInfo, EquipoWrapper } from './categoriasStyles';
import { dataPlantelesColumns } from '../../../Data/Jugadores/Jugadores';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';
import { AccionesBodyTemplate, EstadoBodyTemplate } from '../../../components/Table/TableStyles';
import { PiIdentificationCardLight, PiUser } from 'react-icons/pi';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { useEquipos } from '../../../hooks/useEquipos';

const CategoriasEquiposDetalle = () => {
    const dispatch = useDispatch()
    const { id_page } = useParams()
    const { escudosEquipos } = useEquipos();


    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const jugadoresList = useSelector((state) => state.jugadores.data);
    const [jugadorExistente, setJugadorExistente] = useState(null);

    const equipoFiltrado = equiposList.find(equipo => equipo.id_equipo == id_page);
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == equipoFiltrado.id_categoria);
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    const categoriaEquipos = equiposList.filter((equipo) => equipo.id_categoria == equipoFiltrado.id_categoria)
    
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    // Estado de los botones que realizan una accion en la base de datos
    const [isImporting, setIsImporting] = useState(false);
    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);
    // Referencia del input
    const fileInputRef = useRef(null);
    const { 
        isCreateModalOpen, openCreateModal, closeCreateModal, 
        isDeleteModalOpen, openDeleteModal, closeDeleteModal,
        isUpdateModalOpen, openUpdateModal, closeUpdateModal,
    } = useModalsCrud();

    // Manejo del form
    const [formState, handleFormChange, resetForm, setFormState] = useForm({ 
        id_edicion: categoriaFiltrada.id_edicion,
        id_categoria: equipoFiltrado.id_categoria,
        dni_jugador: '',
        nombre_jugador: '',
        apellido_jugador: '',
        posicion_jugador: '',
        id_equipo: id_page,
        id_jugador: ''
    });

    const [id_jugadorSeleccionado, setId_jugadorSeleccionado] = useState(null);
    // Planteles Data
    const plantelesList = useSelector((state) => state.planteles.data);
    const planteles = plantelesList.map(categoria => ({
        ...categoria,
        acciones: (
            <AccionesBodyTemplate >
                <Button bg={"danger"} onClick={() => {
                        setId_jugadorSeleccionado(categoria.id_jugador)
                        openDeleteModal()
                    }}>
                    <IoTrashOutline />
                </Button>
                <Button bg={"import"} onClick={() => editarJugador(categoria.id_jugador)}>
                    <IoPencil />
                </Button>
            </AccionesBodyTemplate>
        ),
        dni: (
            <>
                {categoria.dni === null ? (
                    <EstadoBodyTemplate $bg={"danger"}>SIN DNI</EstadoBodyTemplate>
                ) : (
                    categoria.dni
                )}
            </>
        ),
        estado: (
            <>
                {categoria.sancionado === "S" ? (
                    <EstadoBodyTemplate $bg={"danger"}>Deshabilitado</EstadoBodyTemplate>
                ) : (
                    <EstadoBodyTemplate $bg={"success"}>Habilitado</EstadoBodyTemplate>
                )}
            </>
        ),
        posicion: (
            <>
                {categoria.posicion === null || categoria.posicion == "" ? (
                    '-'
                ) : (
                    categoria.posicion
                )}
            </>
        )
    }));

    const editarJugador = (id_jugador) => {
        const jugadorAEditar = jugadoresList.find((jugador) => jugador.id_jugador === id_jugador)
        if (jugadorAEditar) {
            setFormState({
                dni_jugador: jugadorAEditar.dni,
                nombre_jugador: jugadorAEditar.nombre,
                apellido_jugador: jugadorAEditar.apellido,
                posicion_jugador: jugadorAEditar.posicion,
            });
            openUpdateModal()
        }
    }
    
    const ListaBuenaFeEquipo = planteles.filter((plantel) => 
        plantel.id_equipo == id_page &&
        plantel.id_categoria === equipoFiltrado.id_categoria && 
        plantel.id_edicion === categoriaFiltrada.id_edicion &&
        plantel.eventual === 'N'
    )

    const EventualesEquipo = planteles.filter((plantel) => 
        plantel.id_equipo == id_page &&
        plantel.id_categoria === equipoFiltrado.id_categoria && 
        plantel.id_edicion === categoriaFiltrada.id_edicion &&
        plantel.eventual === 'S'
    )
    
    
    const [isDniConfirmationOpen, setIsDniConfirmationOpen] = useState(false);
    const [confirmDni, setConfirmDni] = useState(false);
    const handleDniConfirmation = async (confirm) => {
        if (confirm) {
            // Agregar el jugador existente al plantel
            const dataPlantel = {
                id_categoria: equipoFiltrado.id_categoria,
                id_edicion: categoriaFiltrada.id_edicion,
                id_jugador: jugadorExistente.id_jugador,
                id_equipo: id_page
            };
            
            try {
                await Axios.post(`${URL}/user/agregar-jugador-plantel`, dataPlantel);
                toast.success('Jugador asignado al plantel correctamente.');
                dispatch(fetchPlanteles())
                closeCreateModal();
                resetForm();
            } catch (error) {
                console.error("Error asignando el jugador al plantel:", error);
                toast.error("Error al asignar el jugador al plantel.");
            }
        } else {
            // Permitir al usuario cambiar el DNI
            setFormState(prevState => ({ ...prevState, dni_jugador: '' }));
        }
        
        setIsDniConfirmationOpen(false);
    };
    

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-jugador`, fetchJugadores, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {  
        if (!formState.nombre_jugador.trim()) {
            toast.error("Completá los campos.");
            return;
        }
    
        // Obtener la lista de jugadores actualizada antes de la verificación del DNI
        await dispatch(fetchJugadores());
    
        // Buscar el jugador existente en la lista actualizada
        const jugadorExistente = jugadoresList.find(a => a.dni === formState.dni_jugador.trim());
        
        if (jugadorExistente) {
            // Mostrar modal de confirmación si el DNI ya existe
            setJugadorExistente(jugadorExistente); // Establecer el jugador encontrado
            setIsDniConfirmationOpen(true);
            closeCreateModal();
            return;
        }
    
        const data = {
            id_categoria: equipoFiltrado.id_categoria,
            id_edicion: categoriaFiltrada.id_edicion,
            dni: formState.dni_jugador,
            nombre: formState.nombre_jugador,
            apellido: formState.apellido_jugador,
            posicion: formState.posicion_jugador,
            id_equipo: id_page
        };
        
        await crear(data);
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchPlanteles());
        dispatch(fetchJugadores()); // Actualizar la lista de jugadores después de la creación
        closeCreateModal();
        resetForm()
    };
    // ELIMINAR
    const { eliminarPorData, isDeleting } = useCrud(
        `${URL}/user/eliminar-jugador-plantel`, fetchPlanteles, 'Registro eliminado correctamente.', "Error al eliminar el registro."
    );

    const eliminarRegistros = async () => {        
        const data = {
            id_categoria: equipoFiltrado.id_categoria,
            id_edicion: categoriaFiltrada.id_edicion,
            id_jugador: id_jugadorSeleccionado,
            id_equipo: id_page
        };
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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setFileName(file.name); // Guarda el nombre del archivo seleccionado

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data.filter(row => Object.keys(row).length > 0);
                setFileData(data); // Guarda los datos del archivo en el estado
            },
            error: (error) => {
                toast.error("Error al leer el archivo");
                console.error("Error al leer el archivo:", error);
            }
        });
    };

    const handleFileImport = async () => {
        if (!fileData || fileData.length === 0) {
            toast.error("No hay datos para importar.");
            return;
        }
    
        try {
            setIsImporting(true)
            // Extraer todos los DNIs de jugadoresList para una verificación rápida y mapearlos con su id_jugador
            const dniToJugadorMap = new Map(jugadoresList.map(jugador => [jugador.dni, jugador.id_jugador]));

            for (const jugador of fileData) {
                const { dni, nombre, apellido, posicion } = jugador;
                
                // Verifica si el jugador ya existe en jugadoresList
                if (dniToJugadorMap.has(dni)) {
                    // Obtén el id_jugador del jugador existente
                    const id_jugador = dniToJugadorMap.get(dni);
                    console.log(id_jugador);
                    
                    // Inserta el jugador y su relación en planteles
                    await Axios.post(`${URL}/user/agregar-jugador-plantel`, {
                        id_jugador,
                        id_equipo: id_page, // Reemplaza esto con el id del equipo actual
                        id_edicion: categoriaFiltrada.id_edicion, // Reemplaza con la edición actual
                        id_categoria: equipoFiltrado.id_categoria // Reemplaza con la categoría actual
                    });
                    console.log(`El jugador con DNI ${dni} ya existe y se ha agregado al plantel.`);
                    continue;
                }

                // Inserta el jugador y su relación en planteles
                await Axios.post(`${URL}/user/crear-jugador`, {
                    dni,
                    nombre,
                    apellido,
                    posicion,
                    id_equipo: id_page, // Reemplaza esto con el id del equipo actual
                    id_edicion: categoriaFiltrada.id_edicion, // Reemplaza con la edición actual
                    id_categoria: equipoFiltrado.id_categoria // Reemplaza con la categoría actual
                });
    
                console.log(`Jugador con DNI ${dni} agregado correctamente.`);
            }
            setIsImporting(false)
            toast.success("Importación completada correctamente.");
            dispatch(fetchJugadores());
            dispatch(fetchPlanteles());
            dispatch(fetchEquipos())
            closeImportModal()
        } catch (error) {
            console.error("Error durante la importación:", error);
            toast.error("Ocurrió un error durante la importación.");
            setIsImporting(false)
        }
    };
    
    
    
    const openImportModal = () => setIsImportModalOpen(true);
    const closeImportModal = () => {
        setFileName(""); // Restablece el nombre del archivo cuando se cierra el modal
        setFileData(null); // Restablece los datos del archivo cuando se cierra el modal
        setIsImportModalOpen(false);
    };

    const cancelFileSelection = () => {
        setFileName(""); // Restablece el nombre del archivo
        setFileKey(prevKey => prevKey + 1); // Forza la actualización del input de archivo
        setFileData(null); // Restablece los datos del archivo
    };

    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchPlanteles());
        dispatch(fetchJugadores());
    }, [dispatch]);
        
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
                <li><NavLink to={`/admin/categorias/resumen/${categoriaFiltrada.id_categoria}`}>Resumen</NavLink></li>
                <li><NavLink to={`/admin/categorias/formato/${categoriaFiltrada.id_categoria}`}>Formato</NavLink></li>
                <li><NavLink to={`/admin/categorias/fixture/${categoriaFiltrada.id_categoria}`}>Fixture</NavLink></li>
                <li><NavLink to={`/admin/categorias/equipos/${categoriaFiltrada.id_categoria}`}>Equipos ({categoriaEquipos.length})</NavLink></li>
                <li><NavLink to={`/admin/categorias/config/${categoriaFiltrada.id_categoria}`}>Configuración</NavLink></li>
            </ContentNavWrapper>
            <EquipoDetalleInfo>
                <EquipoWrapper>
                    <img src={`${URLImages}${escudosEquipos(equipoFiltrado.id_equipo)}`} alt={equipoFiltrado.nombre} />
                    <h1>{equipoFiltrado.nombre}</h1>
                </EquipoWrapper>
                <Button bg="success" color="white" >
                    <p>Editar equipo</p>
                </Button>
            </EquipoDetalleInfo>
            <div style={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}>
                    <Button bg="success" color="white" onClick={openCreateModal}>
                        <p>Agregar jugador</p>
                    </Button>
                    <Button bg="danger" color="white">
                        <p>Eliminar jugador</p>
                    </Button>
                </div>
                <label htmlFor="importInput" style={{ display: 'none' }}>
                    <input
                        type="file"
                        id="importInput"
                        accept=".csv"
                        key={fileKey}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </label>
                <Button bg="import" color="white"  onClick={openImportModal}>
                    <p>Importar jugadores</p>
                </Button>
            </div>
            
            {
                ListaBuenaFeEquipo.length > 0 ? (
                    <>
                        <p>Lista de buena fé ({equipoFiltrado.jugadores})</p>
                        <Table
                            data={ListaBuenaFeEquipo}
                            dataColumns={dataPlantelesColumns}
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={'id_jugador'}
                            // urlClick={`/admin/categorias/equipos/${edicionFiltrada.id_edicion}/detalle/`}
                            // rowClickLink
                        />
                        {
                            EventualesEquipo.length > 0 && (
                                <>
                                    <p>Jugadores eventuales ({EventualesEquipo.length} jugadores)</p>
                                    <Table
                                        data={EventualesEquipo}
                                        dataColumns={dataPlantelesColumns}
                                        arrayName={'Planteles'}
                                        paginator={false}
                                        selection={false}
                                        sortable={false}
                                        id_={'id_jugador'}
                                        // urlClick={`/admin/categorias/equipos/${edicionFiltrada.id_edicion}/detalle/`}
                                        // rowClickLink
                                    />
                                </>
                            )
                        }
                        
                    </>
                ) : (
                    <p>No se han encontrado jugadores.</p>
                )
            }
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear jugador`}
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
                                    DNI
                                    <Input 
                                        name='dni_jugador'
                                        type='text' 
                                        placeholder="Escriba el DNI..."
                                        icon={<PiIdentificationCardLight className='icon-input'/>} 
                                        value={formState.dni_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Nombre
                                    <Input 
                                        name='nombre_jugador'
                                        type='text' 
                                        placeholder="Escriba el nombre..." 
                                        icon={<PiUser className='icon-input'/>} 
                                        value={formState.nombre_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Apellido
                                    <Input 
                                        name='apellido_jugador'
                                        type='text' 
                                        placeholder="Escriba el apellido..."
                                        icon={<PiUser className='icon-input'/>} 
                                        value={formState.apellido_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Posición
                                    <Input 
                                        name='posicion_jugador'
                                        type='text' 
                                        placeholder="Escriba la posicion..." 
                                        icon={<TbPlayFootball className='icon-input'/>} 
                                        value={formState.posicion_jugador}
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
                            `¿Estas seguro que quieres remover los jugadores seleccionados de esta lista de buena fe?`}
                            animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={closeDeleteModal}
                            title={`Eliminar jugadores`}
                            buttons={
                            <>
                                <Button color={"danger"} onClick={closeDeleteModal}>
                                    <IoClose />
                                    No
                                </Button>
                                <Button color={"success"} onClick={eliminarRegistros} disabled={isDeleting}>
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
                isDniConfirmationOpen && (
                    <>
                        <ModalCreate 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isDniConfirmationOpen ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            title={`DNI ya existe`}
                            onClickClose={() => setIsDniConfirmationOpen(false)}
                            buttons={
                                <>
                                    <Button color={"danger"} onClick={() => handleDniConfirmation(false)}>
                                        <IoClose />
                                        Cambiar DNI
                                    </Button>
                                    <Button color={"success"} onClick={() => handleDniConfirmation(true)} disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <LoaderIcon size="small" color='green' />
                                            </>
                                        ) : (
                                            <>
                                                <IoCheckmark />
                                                Agregar
                                            </>
                                        )}
                                    </Button>
                                </>
                            }
                            form={
                                <>
                                    <p>Encontramos un jugador en tu torneo con el DNI ingresado.
                                    ¿El jugador que intentas crear es esta misma persona?</p>
                                    <h1>{jugadorExistente.nombre} {jugadorExistente.apellido}</h1>
                                    <p>{formState.dni_jugador}</p>
                                </>
                                

                            }
                        />
                        <Overlay onClick={() => setIsDniConfirmationOpen(false)} />
                    </>
                )
            }
            {
                isImportModalOpen && <>
                    <ModalImport initial={{ opacity: 0 }}
                        animate={{ opacity: isImportModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title="Carga tu archivo"
                        message={`Hola`}
                        onClickClose={closeImportModal}
                        fileName={fileName}
                        buttons={
                            <>
                                {fileName ? (
                                    <Button color="danger" onClick={cancelFileSelection}>
                                        <IoClose />
                                        Cancelar archivo
                                    </Button>
                                ) : (
                                    <Button bg="import" color="white" as="label" htmlFor="importInput">
                                        <LuUpload />
                                        <p>Seleccionar</p>
                                    </Button>
                                )}
                                <Button color={"success"} onClick={handleFileImport} disabled={!fileName|| isImporting}>
                                    {isImporting ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Importando
                                        </>
                                    ) : (
                                        <>
                                            <LuUpload />
                                            Importar
                                        </>
                                    )}
                                </Button>
                            </>
                        }
                    />
                    <Overlay onClick={closeImportModal} />
                </>
            }
            {
                isUpdateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Editar jugador`}
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
                                    DNI
                                    <Input 
                                        name='dni_jugador'
                                        type='text' 
                                        placeholder="Escriba el DNI..."
                                        icon={<PiIdentificationCardLight className='icon-input'/>} 
                                        value={formState.dni_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Nombre
                                    <Input 
                                        name='nombre_jugador'
                                        type='text' 
                                        placeholder="Escriba el nombre..." 
                                        icon={<PiUser className='icon-input'/>} 
                                        value={formState.nombre_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Apellido
                                    <Input 
                                        name='apellido_jugador'
                                        type='text' 
                                        placeholder="Escriba el apellido..."
                                        icon={<PiUser className='icon-input'/>} 
                                        value={formState.apellido_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Posición
                                    <Input 
                                        name='posicion_jugador'
                                        type='text' 
                                        placeholder="Escriba la posicion..." 
                                        icon={<TbPlayFootball className='icon-input'/>} 
                                        value={formState.posicion_jugador}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeUpdateModal} />
                </>
            }
        </Content>
    );
};

export default CategoriasEquiposDetalle;
