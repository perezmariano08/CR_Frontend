import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { ModalFormInputContainer, ModalFormInputImg } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { debounce } from 'lodash';
import Axios from 'axios';
import { URL } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { fetchDivisiones } from '../../../redux/ServicesApi/divisionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import Select from '../../../components/Select/Select';
import { PiUser } from 'react-icons/pi';
import { MdMessage, MdOutlineImage } from "react-icons/md";
import { BiMessageDetail } from 'react-icons/bi';

const Equipos = () => {
    const dispatch = useDispatch();

    // Constantes del modulo
    const articuloSingular = "el"
    const articuloPlural = "los"
    const id = "id_equipo"
    const plural = "equipos"
    const singular = "equipo"
    const get = "get-equipos"
    const create = "crear-equipo"
    const importar = "importar-equipo"
    const eliminar = "delete-equipo"

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
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [division, setDivision] = useState("");
    const [img, setImg] = useState("");

    // Estado del el/los Listado/s que se necesitan en el modulo
    const equiposList = useSelector((state) => state.equipos.data);
    const divisionesList = useSelector((state) => state.divisiones.data);
    const categoriasList = useSelector((state) => state.categorias.data);

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
                Axios.post(`${URL}/admin/${eliminar}`, { id: row.id_jugador })
            );
    
            toast.promise(
                Promise.all(deletePromises)
                    .then(async () => {
                        dispatch(fetchJugadores());
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
        dispatch(fetchJugadores());
        dispatch(fetchEquipos());
        dispatch(fetchDivisiones())
        dispatch(fetchCategorias())
        return () => {
            dispatch(clearSelectedRows());
        };
    }, []);

    const agregarDato = async () => {
        if (
            nombre !== "" && 
            categoria !== "" && 
            img !== "" && 
            division !== "") {
            setIsSaving(true);
            try {
                const response = await Axios.get(`${URL}/user/${get}`);
                const datosExistentes = response.data;
                const datoExiste = datosExistentes.some(a => a.nombre === nombre);
                if (datoExiste) {
                    toast.error(`${articuloSingular.charAt(0).toUpperCase() + articuloSingular.slice(1)} ${singular} ya existe.`);
                    setIsSaving(false);
                } else {
                    let imageUrl = img; // Usa la URL de la imagen actual si no se ha seleccionado una nueva

                    if (imageFile) {
                        
                        // Crear un FormData para enviar el archivo al servidor
                        const formData = new FormData();
                        formData.append('image', imageFile);
                        // Subir la imagen al servidor
                        const uploadResponse = await Axios.post(`${URL}/upload-image/equipo`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                        imageUrl = uploadResponse.data.imageUrl;
                        setImg(imageUrl) // Usa la URL de la imagen subida
                    }
    
                    Axios.post(`${URL}/admin/${create}`, {
                        nombre,
                        categoria,
                        division,
                        img: imageUrl,
                        descripcion
                    }).then(() => {
                        toast.success(`${singular.charAt(0).toUpperCase() + singular.slice(1)} registrado correctamente.`);
                        setIsSaving(false);
                        dispatch(fetchEquipos());
                        closeCreateModal();
                        setNombre("");
                        setDescripcion("");
                        setImg("");
                        setCategoria("");
                        setDivision("");
                        setImageFile(null); // Restablece el archivo de imagen
                    });
                }
            } catch (error) {
                setIsSaving(false);
                console.error(`Error al verificar o agregar ${articuloSingular} ${singular}.`, error);
                toast.error(`Hubo un problema al verificar ${articuloSingular} ${singular}.`);
            }
        } else {
            toast.error("Completá los campos.");
        }
    };

    // Funciones que manejan el estado de los modales (Apertura y cierre)
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => {
        setPreviewImage(false);
        setIsCreateModalOpen(false)
    };
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

    const editRow = () => {
        setNombre(selectedRows[0].nombre);
        openCreateModal()
    };
    
    const handleExport = () => {
        const csv = convertToCSV(añosList);
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

    const [imageFile, setImageFile] = useState(null); // Estado para almacenar el archivo de imagen
    const [previewImage, setPreviewImage] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImg(file)
            // Crear una URL de vista previa para la imagen seleccionada
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file); // Leer el archivo como una URL de datos
        }
    };

    // Debounce the onChange handler
    const handleInputChange = useCallback(debounce((event) => {
        setNombre(event.target.value);
    }, 300), []);
    
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
                    <Button bg="export" color="white" onClick={handleExport} disabled={equiposList.length === 0}>
                        <LuDownload />
                        <p>Descargar</p>
                    </Button>
                </ActionsCrudButtons>
            </ActionsCrud>
            <Table data={equiposList} dataColumns={dataEquiposColumns} arrayName={plural.charAt(0).toUpperCase() + plural.slice(1)} id_={id} />
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
                        form={ <>
                            <ModalFormInputContainer>
                                Nombre del equipo
                                <Input 
                                    type='text' 
                                    placeholder="Escriba el nombre..." 
                                    onChange={handleInputChange}
                                    icon={<IoShieldHalf className='icon-input'/>} 
                                />
                            </ModalFormInputContainer>
                            <ModalFormInputContainer>
                                Logo (Opcional)
                                <ModalFormInputImg>
                                    {previewImage && <img src={previewImage} alt="Vista previa" style={{ width: '80px', height: '80px' }} />}
                                    <Input 
                                        type='file' 
                                        accept="image/*"
                                        onChange={(event) => handleImageUpload(event)}
                                        icon={<MdOutlineImage className='icon-input'/>}
                                    />
                                </ModalFormInputImg>
                            </ModalFormInputContainer>
                            <ModalFormInputContainer>
                                Categoría
                                <Select
                                    data={categoriasList}
                                    placeholder="Seleccionar categoría"
                                    icon={<IoShieldHalf className='icon-select'/>}
                                    id_={"id_categoria"}
                                    onChange={(event) => { setCategoria(event.target.value)}}
                                >
                                </Select>
                            </ModalFormInputContainer>
                            <ModalFormInputContainer>
                                División
                                <Select
                                    data={divisionesList}
                                    placeholder="Seleccionar divisin"
                                    icon={<IoShieldHalf className='icon-select'/>}
                                    id_={"id_division"}
                                    onChange={(event) => { setDivision(event.target.value)}}
                                >
                                </Select>
                            </ModalFormInputContainer>
                            <ModalFormInputContainer>
                                Añadir descripción (Opcional)
                                <Input 
                                    type='text' 
                                    placeholder="Escriba aqui..."
                                    onChange={(event) => { setDescripcion(event.target.value)}} 
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

export default Equipos;
