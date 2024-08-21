import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { LuDownload, LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import { ContentTitle } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataJugadoresColumns } from '../../../Data/Jugadores/Jugadores';
import Select from '../../../components/Select/Select';
import { PiIdentificationCardLight, PiUser } from 'react-icons/pi';

import { TbPlayFootball } from "react-icons/tb";
import useForm from '../../../hooks/useForm';
import { useCrud } from '../../../hooks/useCrud';

const Jugadores = () => {
    const dispatch = useDispatch();
    const tuToken = localStorage.getItem('token'); // O donde guardes el token

    const headers = {
        'Authorization': `Bearer ${tuToken}`,
        'Content-Type': 'application/json'
    };

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        dni_jugador: '', 
        nombre_jugador: '', 
        apellido_jugador: '', 
        posicion_jugador: '', 
        id_equipo: null,
    });

    const isFormEmpty = !formState.dni_jugador.trim();

    // Constantes del modulo
    const articuloSingular = "el"
    const articuloPlural = "los"
    const id = "id_jugador"
    const plural = "jugadores"
    const singular = "jugador"
    const get = "get-jugadores"
    const crearEndpoint = "crear-jugador"
    const importar = "importar-jugadores"
    const eliminar = "delete-jugador"
    const actualizarEndpoint = "update-jugador"

    // Estados para manejar la apertura y cierre de los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Estado de los botones que realizan una accion en la base de datos

    
    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);
    // Referencia del input
    const fileInputRef = useRef(null);

    // Estado del el/los Listado/s que se necesitan en el modulo
    const jugadoresList = useSelector((state) => state.jugadores.data);
    const equiposList = useSelector((state) => state.equipos.data);

    // Estado de las filas seleccionadas para eliminar
    const selectedRows = useSelector(state => state.selectedRows.selectedRows);

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
        if (fileData) {
            try {
                const response = await Axios.post(`${URL}/user/importar-jugadores`, fileData);
                toast.success(`Se importaron los registros correctamente.`);
                closeImportModal();
                dispatch(fetchJugadores());
                setFileKey(prevKey => prevKey + 1);
                setFileName(""); // Restablece el nombre del archivo después de la importación
                setFileData(null); // Restablece los datos del archivo después de la importación
            } catch (error) {
                toast.error("Error al importar los datos.");
                console.error("Error al importar los datos:", error);
            }
        } else {
            toast.error("No hay datos para importar.");
        }
    };
    

    const eliminarDato = async () => {
        if (selectedRows.length > 0) {
            const deletePromises = selectedRows.map(row => 
                Axios.post(`${URL}/user/${eliminar}`, { id: row.id_jugador })
            );
    
            toast.promise(
                Promise.all(deletePromises)
                    .then(async () => {
                        dispatch(fetchJugadores());
                        closeDeleteModal();
                        dispatch(clearSelectedRows());
                        setFileKey(prevKey => prevKey + 1);
                    }),
                {
                    loading: 'Borrando...',
                    success: `${plural.charAt(0).toUpperCase() + plural.slice(1)}  eliminados correctamente`,
                    error: `No se pudieron eliminar ${articuloPlural} ${plural}.`,
                }
            ).catch(error => {
                console.error(`Error al eliminar ${articuloPlural} ${plural}.`, error);
            });
        } else {
            toast.error(`No hay ${plural} seleccionados.`);
        }
    };

    useEffect(() => {
        dispatch(fetchJugadores());
        dispatch(fetchEquipos())
        return () => {
            dispatch(clearSelectedRows());
        };
    }, []);

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/${crearEndpoint}`, fetchJugadores, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {
        console.log(formState);
        
        if (
            !formState.dni_jugador ||
            !formState.nombre_jugador ||
            !formState.apellido_jugador
        ) {
            toast.error("Completá los campos.");
            return;
        }
        
        if (jugadoresList.some(a => a.dni === formState.dni_jugador.trim())) {
            toast.error(`El jugador ya existe en la base de datos`);
            return
        } 
        
        const data = {
            dni: formState.dni_jugador.trim(),
            nombre: formState.nombre_jugador.trim(),
            apellido: formState.apellido_jugador.trim(),
            posicion: formState.posicion_jugador.trim(),
            id_equipo: formState.id_equipo
        };
        
        await crear(data);
        closeCreateModal();
        resetForm()
    };

    // ACTUALIZAR
    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/${actualizarEndpoint}`, fetchJugadores, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        const data = {
            dni: formState.dni_jugador,
            nombre: formState.nombre_jugador,
            apellido: formState.apellido_jugador,
            posicion: formState.posicion_jugador,
            id_equipo: formState.id_equipo,
            id_jugador: formState.id_jugador
        }
        await actualizar(data);
        dispatch(clearSelectedRows());
        closeEditModal()
    };

    const editRow = () => {
        formState.dni_jugador = selectedRows[0].dni
        formState.nombre_jugador = selectedRows[0].nombre
        formState.apellido_jugador = selectedRows[0].apellido
        formState.posicion_jugador = selectedRows[0].posicion
        formState.id_equipo = selectedRows[0].id_equipo
        formState.id_jugador = selectedRows[0].id_jugador
        openEditModal()
    };

    // Funciones que manejan el estado de los modales (Apertura y cierre)
    const openCreateModal = () => setIsCreateModalOpen(true);
    const openEditModal = () => setIsEditModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false)
    const closeEditModal = () => {
        setIsEditModalOpen(false)
        resetForm()
    };
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false)
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

    const convertToCSV = (objArray) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let csv = '\uFEFF'; // BOM (Byte Order Mark)
    
        const headers = Object.keys(array[0]).filter(key => key !== id);
        csv += headers.join(',') + '\r\n';
    
        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (index !== id) {
                    if (line !== '') line += ',';
                    line += array[i][index];
                }
            }
            if (line.trim() !== '') {
                csv += line + '\r\n';
            }
        }
    
        return csv;
    };

    
    
    const handleExport = () => {
        const csv = convertToCSV(jugadoresList);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
    
        link.setAttribute('href', url);
        link.setAttribute('download', `${plural}.csv`);
        link.style.visibility = 'hidden';
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <Content>
            <ContentTitle>{plural.charAt(0).toUpperCase() + plural.slice(1)}</ContentTitle>
            <ActionsCrud>
                <ActionsCrudButtons>
                    <Button bg="success" color="white" onClick={openCreateModal}>
                        <FiPlus />
                        <p>Nuevo</p>
                    </Button>
                    <Button bg="danger" color="white" onClick={openDeleteModal} disabled={selectedRows.length === 0}>
                        <IoTrashOutline />
                        <p>Eliminar</p>
                    </Button>
                    <Button bg="import" color="white" onClick={editRow} disabled={selectedRows.length > 1 || selectedRows.length === 0}>
                        <IoTrashOutline />
                        <p>Editar</p>
                    </Button>
                </ActionsCrudButtons>
                <ActionsCrudButtons>
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
                    <Button bg="import" color="white" onClick={openImportModal}>
                        <LuUpload />
                        <p>Importar</p>
                    </Button>
                    <Button bg="export" color="white" onClick={handleExport} disabled={jugadoresList.length === 0}>
                        <LuDownload />
                        <p>Descargar</p>
                    </Button>
                    
                </ActionsCrudButtons>
                    
                
            </ActionsCrud>
            <Table data={jugadoresList} dataColumns={dataJugadoresColumns} arrayName={plural.charAt(0).toUpperCase() + plural.slice(1)} id_={id} />
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear ${singular}`}
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
                                <ModalFormInputContainer>
                                    Equipo
                                    <Select 
                                        name={'id_equipo'}
                                        data={equiposList}
                                        placeholder="Seleccionar equipo"
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        value={formState.id_equipo}
                                        onChange={handleFormChange}
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
                        message={`${articuloPlural} ${plural}`}
                        onClickClose={closeDeleteModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeDeleteModal}>
                                    <IoClose />
                                    No
                                </Button>
                                <Button color={"success"} onClick={eliminarDato} disabled={isSaving}>
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
                isImportModalOpen && <>
                    <ModalImport initial={{ opacity: 0 }}
                        animate={{ opacity: isImportModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title="Carga tu archivo"
                        message={`${articuloPlural} ${plural}`}
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
                                <Button color={"success"} onClick={handleFileImport} disabled={!fileName}>
                                    {isSaving ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
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
                isEditModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isEditModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear ${singular}`}
                        onClickClose={closeEditModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeEditModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={actualizarDato} disabled={isUpdating}>
                                    {isUpdating ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
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
                                <ModalFormInputContainer>
                                    Equipo
                                    <Select 
                                        name={'id_equipo'}
                                        data={equiposList}
                                        placeholder="Seleccionar equipo"
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        value={formState.id_equipo}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeEditModal} />
                </>
            }
        </Content>
    );
};

export default Jugadores;
