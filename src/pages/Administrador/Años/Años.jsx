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
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { dataEdicionesColumns } from '../../../Data/Ediciones/DataEdiciones';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import useForm from '../../../hooks/useForm';
import { TbPlayFootball } from 'react-icons/tb';
import Select from '../../../components/Select/Select';

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";

const Años = () => {
    const dispatch = useDispatch();

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        nombre_edicion: '',
        id_torneo: '',
        temporada: new Date().getFullYear(),
        mes_inicio: '',
        mes_finalizacion: '',
        puntos_victoria: 3,
        puntos_empate: 1,
        puntos_derrota: 0,
    });
    const isFormEmpty = !formState.nombre_edicion.trim();

    // Constantes del modulo
    const articuloSingular = "el"
    const articuloPlural = "los"
    const id = "id_año"
    const plural = "ediciones"
    const singular = "edicion"
    const get = "get-anios"
    const create = "crear-anio"
    const importar = "importar-anios"
    const eliminar = "delete-anio"

    // Estados para manejar la apertura y cierre de los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Estado de los botones que realizan una accion en la base de datos
    const [isSaving, setIsSaving] = useState(false);

    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);
    // Referencia del input
    const fileInputRef = useRef(null);

    // Estados para guardar los valores de los inputs
    const [año, setAño] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);

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
            setIsSaving(true);
            try {
                const response = await Axios.get(`${URL}/admin/${get}`);
                const datosExistentes = response.data.map(a => a.año);
                const nuevosDatos = fileData.filter(row => !datosExistentes.includes(row.año));
                if (nuevosDatos.length > 0) {
                    Axios.post(`${URL}/admin/${importar}`, nuevosDatos)
                        .then(() => {
                            toast.success(`Se importaron ${nuevosDatos.length} registros correctamente.`);
                            closeImportModal()
                            dispatch(fetchAños());
                            setFileKey(prevKey => prevKey + 1);
                            setFileName(""); // Restablece el nombre del archivo después de la importación
                            setFileData(null); // Restablece los datos del archivo después de la importación
                            setIsSaving(false);
                        });
                } else {
                    setIsSaving(false);
                    toast.error(`Todos ${articuloPlural} ${plural} del archivo ya existen.`);
                }
            } catch (error) {
                setIsSaving(false);
                toast.error("Error al verificar los datos.");
                console.error("Error al verificar los datos:", error);
            }
        } else {
            setIsSaving(false);
            toast.error("No hay datos para importar.");
        }
    };

    const eliminarAños = async () => {
        if (selectedRows.length > 0) {
            setIsSaving(true);
            const deletePromises = selectedRows.map(row => 
                Axios.post(`${URL}/admin/${eliminar}`, { id: row.id_año })
            );
    
            toast.promise(
                Promise.all(deletePromises)
                    .then(async () => {
                        dispatch(fetchAños());
                        closeDeleteModal();
                        dispatch(clearSelectedRows());
                        setFileKey(prevKey => prevKey + 1);
                        setIsSaving(false);
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
        dispatch(fetchEdiciones());
        return () => {
            dispatch(clearSelectedRows());
        };
    }, []);

    const agregarDato = async () => {
        if (formState.nombre_edicion !== "") {
            console.log(formState);
            setIsSaving(true);
            try {
                const response = await Axios.get(`${URL}/user/get-ediciones`);
                const datosExistentes = response.data;
                const datoExiste = datosExistentes.some(a => a.nombre === formState.nombre_edicion);
                if (datoExiste) {
                    toast.error(`${articuloSingular.charAt(0).toUpperCase() + articuloSingular.slice(1)}  ${singular} ya existe.`);
                } else {
                    Axios.post(`${URL}/user/crear-edicion`, {
                        nombre: formState.nombre_edicion,
                        temporada: formState.temporada,
                        puntos_victoria: formState.puntos_victoria,
                        puntos_empate: formState.puntos_empate,
                        puntos_derrota: formState.puntos_derrota
                    }).then(() => {
                        toast.success(`${singular.charAt(0).toUpperCase() + singular.slice(1)} registrado correctamente.`);
                        dispatch(fetchEdiciones());
                        closeCreateModal();
                        setAño("");
                        setDescripcion("");
                        setIsSaving(false)
                    });
                }
            } catch (error) {
                setIsSaving(false)
                console.error(`Error al verificar o agregar ${articuloSingular} ${singular}.`, error);
                toast.error(`Hubo un problema al verificar ${articuloSingular} ${singular}.`);
            }
        } else {
            toast.error("Completá los campos.");
        }
    };

    // Funciones que manejan el estado de los modales (Apertura y cierre)
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
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
        const csv = convertToCSV(edicionesList);
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
    
    const temporadas = [...new Set(edicionesList.map(edicion => edicion.temporada))]
    .sort((a, b) => b - a); // Ordena las temporadas de más reciente a más antigua
    
    return (
        <Content>
            <Button bg="success" color="white" onClick={openCreateModal}>
                <FiPlus />
                <p>Agregar nueva edición</p>
            </Button>
            <Toaster />
            {/* <ActionsCrud>
                <ActionsCrudButtons>
                    
                    <Button bg="danger" color="white" onClick={openDeleteModal} disabled={selectedRows.length === 0}>
                        <IoTrashOutline />
                        <p>Eliminar</p>
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
                    <Button bg="export" color="white" onClick={handleExport} disabled={edicionesList.length === 0}>
                        <LuDownload />
                        <p>Descargar</p>
                    </Button>
                </ActionsCrudButtons>
            </ActionsCrud> */}
            <TablasTemporadaContainer>
                {temporadas.map(temporada => (
                    <TablaTemporada key={temporada}>
                        <h2>Temporada {temporada}</h2>
                        <Table 
                            data={edicionesList.filter(edicion => edicion.temporada === temporada)} 
                            dataColumns={dataEdicionesColumns} 
                            arrayName={'Ediciones'} 
                            paginator={false}
                        />
                    </TablaTemporada>
                ))}
            </TablasTemporadaContainer>
            
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
                                <ModalFormWrapper>
                                    <ModalFormInputContainer>
                                    nombre
                                    <Input 
                                        name='nombre_edicion'
                                        type='text' 
                                        placeholder="Nombre" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.nombre_edicion}
                                        onChange={handleFormChange}
                                    />
                                    {
                                        formState.nombre_edicion && (
                                            <p>
                                                La edición se mostrará con el nombre: <span>{formState.nombre_edicion} {formState.temporada}</span>
                                            </p>
                                        )
                                    }
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Temporada
                                    <Select 
                                        name={'temporada'}
                                        data={[
                                            {
                                                temporada: 2023,
                                                nombre: "Temporada 2023",
                                            },
                                            {
                                                temporada: 2024,
                                                nombre: "Temporada 2024",
                                            },
                                            {
                                                temporada: 2025,
                                                nombre: "Temporada 2025",
                                            }
                                        ]}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"temporada"}
                                        column='nombre'
                                        value={formState.temporada}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                </ModalFormWrapper>
                                
                                <ModalFormWrapper>
                                    <ModalFormInputContainer>
                                    puntos por victoria
                                    <Select 
                                        name={'puntos_victoria'}
                                        data={[
                                            {
                                                puntos_victoria: 0,
                                                nombre: "No se otorgan",
                                            },
                                            {
                                                puntos_victoria: 1,
                                                nombre: "1 punto",
                                            },
                                            {
                                                puntos_victoria: 2,
                                                nombre: "2 puntos",
                                            },
                                            {
                                                puntos_victoria: 3,
                                                nombre: "3 puntos",
                                            }
                                        ]}
                                        icon={<TbNumber className='icon-select'/>}
                                        id_={"puntos_victoria"}
                                        column='nombre'
                                        value={formState.puntos_victoria}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    puntos por empate
                                    <Select 
                                        name={'puntos_empate'}
                                        data={[
                                            {
                                                puntos_empate: 0,
                                                nombre: "No se otorgan",
                                            },
                                            {
                                                puntos_empate: 1,
                                                nombre: "1 punto",
                                            },
                                            {
                                                puntos_empate: 2,
                                                nombre: "2 puntos",
                                            },
                                            {
                                                puntos_empate: 3,
                                                nombre: "3 puntos",
                                            }
                                        ]}
                                        icon={<TbNumber className='icon-select'/>}
                                        id_={"puntos_empate"}
                                        column='nombre'
                                        value={formState.puntos_empate}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    puntos por derrota
                                    <Select 
                                        name={'puntos_derrota'}
                                        data={[
                                            {
                                                puntos_derrota: 0,
                                                nombre: "No se otorgan",
                                            },
                                            {
                                                puntos_derrota: 1,
                                                nombre: "1 punto",
                                            },
                                            {
                                                puntos_derrota: 2,
                                                nombre: "2 puntos",
                                            },
                                            {
                                                puntos_derrota: 3,
                                                nombre: "3 puntos",
                                            }
                                        ]}
                                        icon={<TbNumber className='icon-select'/>}
                                        id_={"puntos_derrota"}
                                        column='nombre'
                                        value={formState.puntos_derrota}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                </ModalFormWrapper>
                                
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
                                <Button color={"success"} onClick={eliminarAños} disabled={isSaving}>
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
        </Content>
    );
};

export default Años;
