import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoTrashOutline } from 'react-icons/io5';
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
import { fetchAños } from '../../../redux/ServicesApi/añosSlice';
import { dataDivisionesColumns } from '../../../Data/Divisiones/Divisiones';
import { fetchDivisiones } from '../../../redux/ServicesApi/divisionesSlice';
import { BiMessageDetail } from 'react-icons/bi';
import { MdDriveFileRenameOutline } from 'react-icons/md';

import useForm from '../../../hooks/useForm';
import { useCrud } from '../../../hooks/useCrud';

const Divisiones = () => {
    const dispatch = useDispatch();

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        nombre_division: '', 
        descripcion_division: '' 
    });
    const isFormEmpty = !formState.nombre_division.trim();

    // Constantes del modulo
    const articuloSingular = "la"
    const articuloPlural = "las"
    const id = "id_division"
    const plural = "divisiones"
    const singular = "división"

    const crearEndpoint = "crear-division"
    const importarEndpoint = "importar-divisiones"
    const eliminarEndpoint = "delete-division"

    // Estados para manejar la apertura y cierre de los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);

    // Referencia del input
    const fileInputRef = useRef(null);

    // Estado del el/los Listado/s que se necesitan en el modulo
    const divisionesList = useSelector((state) => state.divisiones.data);

    // Estado de las filas seleccionadas para eliminar
    const selectedRows = useSelector(state => state.selectedRows.selectedRows);

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/${crearEndpoint}`, fetchDivisiones, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {
        if (!formState.nombre_division.trim()) {
            toast.error("Completá los campos.");
            return;
        }
        
        if (divisionesList.some(a => a.nombre === formState.nombre_division.trim())) {
            toast.error(`${articuloSingular.charAt(0).toUpperCase() + articuloSingular.slice(1)}  ${singular} ya existe.`);
            return
        } 
        
        const data = {
            nombre: formState.nombre_division.trim(),
            descripcion: formState.descripcion_division.trim(),
        };
        
        await crear(data);
        closeCreateModal();
        resetForm()
    };

    // ELIMINAR
    const { eliminar, isDeleting } = useCrud(
        `${URL}/user/${eliminarEndpoint}`, fetchDivisiones, 'Registro eliminado correctamente.', "Error al eliminar el registro."
    );

    const eliminarRegistros = async () => {
        if (selectedRows.length > 0) {
            const ids = selectedRows.map(row => row.id_division);
            try {
                await eliminar(ids);
                dispatch(clearSelectedRows());
            } catch (error) {
                console.error("Error eliminando años:", error);
            } finally {
                closeDeleteModal();
            }
        } else {
            toast.error(`No hay ${plural} seleccionadas.`);
        }
    };

    // IMPORTAR
    const { importar, isImporting } = useCrud(
        `${URL}/user/${importarEndpoint}`, 
        fetchDivisiones
    );

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

    const importarRegistros = async () => {
        if (!fileData) {
            toast.error("No hay datos para importar.");
            return;
        }

        try {
            await importar(fileData, divisionesList);
        } catch (error) {
            console.error("Error eliminando años:", error);
        } finally {
            closeImportModal();
            setFileKey(prevKey => prevKey + 1);
            setFileName(""); // Restablece el nombre del archivo después de la importación
            setFileData(null); // Restablece los datos del archivo después de la importación
        }
        
    };
    
    const cancelFileSelection = () => {
        setFileName(""); // Restablece el nombre del archivo
        setFileKey(prevKey => prevKey + 1); // Forza la actualización del input de archivo
        setFileData(null); // Restablece los datos del archivo
    };

    // EXPORTAR
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
        const csv = convertToCSV(divisionesList);
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

    // Funciones que manejan el estado de los modales (Apertura y cierre)
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => {
        setIsCreateModalOpen(false)
    }
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openImportModal = () => setIsImportModalOpen(true);
    const closeImportModal = () => {
        setFileName(""); // Restablece el nombre del archivo cuando se cierra el modal
        setFileData(null); // Restablece los datos del archivo cuando se cierra el modal
        setIsImportModalOpen(false);
    };

    return (
        <Content>
            <Toaster />
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
                </ActionsCrudButtons>
                <ActionsCrudButtons>
                    <label htmlFor="importInput" style={{ display: 'none' }}>
                        <input
                            name='importar'
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
                    <Button bg="export" color="white" onClick={handleExport} disabled={divisionesList.length === 0}>
                        <LuDownload />
                        <p>Descargar</p>
                    </Button>
                </ActionsCrudButtons>
            </ActionsCrud>
            <Table data={divisionesList} dataColumns={dataDivisionesColumns} arrayName={singular.charAt(0).toUpperCase() + singular.slice(1)} id_={id} />
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
                                <Button 
                                    color={"success"} 
                                    onClick={() => {
                                        agregarRegistro();
                                    }}
                                    disabled={isFormEmpty || isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            Guardando
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
                                    Nombre de la división
                                    <Input 
                                        type='text'
                                        name='nombre_division' 
                                        placeholder="Escriba aqui..." 
                                        value={formState.nombre_division}
                                        onChange={handleFormChange}
                                        icon={<MdDriveFileRenameOutline className='icon-input'/>}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Añadir descripción (Opcional)
                                    <Input 
                                        type='text'
                                        name='descripcion_division' 
                                        placeholder="Escriba aqui..." 
                                        value={formState.descripcion_division}
                                        onChange={handleFormChange}
                                        icon={<BiMessageDetail className='icon-input'/>}
                                    />
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
                                <Button color={"success"} onClick={eliminarRegistros} disabled={isDeleting}>
                                    {isDeleting ? (
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
                                <Button color={"success"} onClick={importarRegistros} disabled={!fileName || isImporting}>
                                    {isImporting ? (
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
        </Content>
    );
};

export default Divisiones;
