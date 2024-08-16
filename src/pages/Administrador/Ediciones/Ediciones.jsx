import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { TablasTemporadaContainer, TablaTemporada } from './edicionesStyles';
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { edicionesListColumns } from '../../../Data/Ediciones/edicionesListColumns';

const Ediciones = () => {
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
    const id = "id_edicion"
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
    
    const edicionesListConLinks = edicionesList.map(edicion => ({
    ...edicion,
    link: `/${edicion.id_edicion}`,  // Aquí construyes el enlace basado en el id u otros datos
    }));
    
    // Estado de las filas seleccionadas para eliminar
    const selectedRows = useSelector(state => state.selectedRows.selectedRows);

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


    
    const temporadas = [...new Set(edicionesList.map(edicion => edicion.temporada))]
    .sort((a, b) => b - a); // Ordena las temporadas de más reciente a más antigua
    
    return (
        <Content>
            <Toaster />
            <Button bg="success" color="white" onClick={openCreateModal}>
                <FiPlus />
                <p>Agregar nueva edición</p>
            </Button>
            <TablasTemporadaContainer>
                {temporadas.map(temporada => (
                    <TablaTemporada key={temporada}>
                        <h2>Temporada {temporada}</h2>
                        <Table 
                            data={edicionesListConLinks.filter(edicion => edicion.temporada === temporada)} 
                            dataColumns={edicionesListColumns} 
                            arrayName={'Ediciones'} 
                            paginator={false}
                            selection={false}
                            id_={id}
                            urlClick={'/admin/ediciones/'}
                            rowClickLink
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

export default Ediciones;
