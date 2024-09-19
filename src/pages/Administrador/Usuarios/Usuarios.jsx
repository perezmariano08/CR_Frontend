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
import { ModalFormInputContainer, ModalFormInputImg } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import Axios from 'axios';
import { URL, URLImages } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedRows } from '../../../redux/SelectedRows/selectedRowsSlice';
import ModalImport from '../../../components/Modals/ModalImport/ModalImport';
import { fetchAños } from '../../../redux/ServicesApi/añosSlice';
import { fetchRoles } from '../../../redux/ServicesApi/rolesSlice';
import { fetchUsuarios } from '../../../redux/ServicesApi/usuariosSlice';
import { dataUsuariosColumns } from '../../../Data/Usuarios/DataUsuarios';
import Select from '../../../components/Select/Select';
import { PiEnvelope, PiIdentificationCardLight, PiPhone, PiUser } from 'react-icons/pi';
import { dataEstadosAI } from '../../../Data/Estados/Estados';
import { AiOutlineCalendar } from 'react-icons/ai';
import { LiaUserCogSolid, LiaUserEditSolid } from "react-icons/lia";
import { MdOutlineImage } from 'react-icons/md';
import InputCalendar from '../../../components/UI/Input/InputCalendar';
import { HiMiniPaintBrush } from "react-icons/hi2";

const Usuarios = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token'); // Obtener el token
    // Constantes del modulo
    const articuloSingular = "el"
    const articuloPlural = "los"
    const id = "id_usuario"
    const plural = "usuarios"
    const singular = "usuario"
    const get = "get-usuarios"
    const create = "crear-cuenta"
    const importar = "importar-usuarios"
    const eliminar = "delete-usuario"
    const update = "update-usuario"

    // Estados para manejar la apertura y cierre de los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Estado de los botones que realizan una accion en la base de datos
    const [isSaving, setIsSaving] = useState(false);

    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);
    // Referencia del input
    const fileInputRef = useRef(null);

    // Estados para guardar los valores de los inputs
    const [dni, setDni] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState("");
    const [email, setEmail] = useState("");
    const [equipo, setEquipo] = useState("");
    const [estado, setEstado] = useState("");
    const [clave, setClave] = useState();
    const [img, setImg] = useState("");
    const [id_usuario, setIdUsuario] = useState("");

    // Estado para guardar los valores originales al abrir el modal de edición
    const [originalValues, setOriginalValues] = useState({});

    // Estado del el/los Listado/s que se necesitan en el modulo
    const usuariosList = useSelector((state) => state.usuarios.data);
    const rolesList = useSelector((state) => state.roles.data);
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
            setIsSaving(true);
            try {
                const response = await Axios.get(`${URLImages}/admin/${get}`);
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
                Axios.post(`${URL}/admin/${eliminar}`, { id: row.id_usuario }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            );
    
            toast.promise(
                Promise.all(deletePromises)
                    .then(async () => {
                        dispatch(fetchUsuarios());
                        closeDeleteModal();
                        dispatch(clearSelectedRows());
                        setFileKey(prevKey => prevKey + 1);
                        setIsSaving(false);
                    }),
                {
                    loading: 'Borrando...',
                    success: `${plural.charAt(0).toUpperCase() + plural.slice(1)}  eliminadas correctamente`,
                    error: `No se pudieron eliminar ${articuloPlural} ${plural}.`,
                }
            ).catch(error => {
                setIsSaving(false);
                console.error(`Error al eliminar ${articuloPlural} ${plural}.`, error);
            });
        } else {
            toast.error(`No hay ${plural} seleccionadas.`);
        }
    };

    useEffect(() => {
        dispatch(fetchUsuarios());
        dispatch(fetchRoles());
        return () => {
            dispatch(clearSelectedRows());
        };
    }, []);

    const agregarDato = async () => {
        if (
            dni != "" &&
            nombre != "" &&
            apellido != "" &&
            nacimiento != "" &&
            telefono != "" &&
            email != "" &&
            clave != "" &&
            rol != ""
        ){
            setIsSaving(true);
            try {
                // Despacha fetchUsuarios para obtener los datos existentes
                const response = await dispatch(fetchUsuarios()).unwrap();
                const datosExistentes = response                
                const datoExiste = datosExistentes.some(a => a.dni === dni);
                if (datoExiste) {
                    toast.error(`${articuloSingular.charAt(0).toUpperCase() + articuloSingular.slice(1)}  ${singular} ya existe.`);
                    setIsSaving(false)
                } else {
                    const fechaNacimiento = nacimiento;
                    Axios.post(`${URL}/auth/${create}`, {
                        dni,
                        nombre,
                        apellido,
                        fechaNacimiento,
                        telefono,
                        email,
                        clave,
                        rol
                    }).then(() => {
                        dispatch(fetchUsuarios());
                        closeCreateModal();
                        setNombre("");
                        setDescripcion("");
                        setIsSaving(false)
                    });
                    setIsSaving(false)
                    setTimeout(() => {
                        toast.success(`${singular.charAt(0).toUpperCase() + singular.slice(1)} registrada correctamente. Se envio un mail de confirmacion al usuario para activar la cuenta`);
                    }, 3000) 
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

    const isUpdated = () => {
        console.log(originalValues);
        console.log(img)
        return (
            dni !== originalValues.dni ||
            nombre !== originalValues.nombre ||
            apellido !== originalValues.apellido ||
            email !== originalValues.email ||
            telefono !== originalValues.telefono ||
            nacimiento !== originalValues.nacimiento ||
            rol != originalValues.rol ||
            equipo != originalValues.equipo ||
            estado != originalValues.estado) ||
            img != originalValues.img
        ;
    };

    const editarDato = async () => {
        if (!isUpdated) {
            setIsSaving(false);
            toast.info("No se realizaron cambios.");
            return;
        }
        setIsSaving(true);
        try {
            let imageUrl = img; // Usa la URL de la imagen actual si no se ha seleccionado una nueva
            if (imageFile) {
                // Crear un FormData para enviar el archivo al servidor
                const formData = new FormData();
                formData.append('image', imageFile);

                // Subir la imagen al servidor
                const uploadResponse = await Axios.post(`${URLImages}/upload-image/usuario`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                imageUrl = uploadResponse.data.imageUrl;
                setImg(imageUrl) // Usa la URL de la imagen subida
            }
            const response = await Axios.put(`${URL}/admin/${update}`,
                {
                    dni,
                    nombre,
                    apellido,
                    nacimiento,
                    email,
                    telefono,
                    id_rol: rol,
                    estado,
                    img: imageUrl,
                    id_usuario
                },  {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                setIsSaving(false)
                toast.success(`${singular.charAt(0).toUpperCase() + singular.slice(1)} actualizado correctamente.`);
                dispatch(fetchUsuarios())
                dispatch(clearSelectedRows());
                closeEditModal()
            }
        } catch (error) {
            setIsSaving(false)
            console.error(`Error al verificar o agregar ${articuloSingular} ${singular}.`, error);
            toast.error(`Hubo un problema al verificar ${articuloSingular} ${singular}.`);
        }
    };

    const editRow = () => {
        setDni(selectedRows[0].dni)
        setNombre(selectedRows[0].nombre)
        setApellido(selectedRows[0].apellido)
        setEmail(selectedRows[0].email)
        setTelefono(selectedRows[0].telefono)
        setNacimiento(selectedRows[0].nacimiento)
        setRol(selectedRows[0].id_rol)
        setEquipo(selectedRows[0].id_equipo)
        setIdUsuario(selectedRows[0].id_usuario)
        setEstado(selectedRows[0].estado)
        setImg(selectedRows[0].img)

        // Guarda los valores originales
        setOriginalValues({
            dni: selectedRows[0].dni,
            nombre: selectedRows[0].nombre,
            apellido: selectedRows[0].apellido,
            email: selectedRows[0].email,
            telefono: selectedRows[0].telefono,
            nacimiento: selectedRows[0].nacimiento,
            rol: selectedRows[0].id_rol,
            equipo: selectedRows[0].id_equipo,
            estado: selectedRows[0].estado,
            img: selectedRows[0].img
        });
        openEditModal()
    };

    // Funciones que manejan el estado de los modales (Apertura y cierre)
    const openCreateModal = () => {
        setDni("")
        setNombre("")
        setApellido("")
        setEmail("")
        setTelefono("")
        setNacimiento("")
        setClave("")
        setRol("")
        setIsCreateModalOpen(true);}

    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openImportModal = () => setIsImportModalOpen(true);
    const closeImportModal = () => {
        setFileName(""); // Restablece el nombre del archivo cuando se cierra el modal
        setFileData(null); // Restablece los datos del archivo cuando se cierra el modal
        setIsImportModalOpen(false);
    };
    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => {
        // setDni("")
        // setNombre("")
        // setApellido("")
        // setEmail("")
        // setTelefono("")
        // setNacimiento("")
        // setRol("")
        // setEquipo("")
        setPreviewImage("")
        setIsEditModalOpen(false);
    }

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
        const csv = convertToCSV(usuariosList);
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
            setImageFile(file)
            setImg(file)
            // Crear una URL de vista previa para la imagen seleccionada
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file); // Leer el archivo como una URL de datos
        }
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
                        <HiMiniPaintBrush />
                        <p>Editar</p>
                    </Button>
                </ActionsCrudButtons>
                <ActionsCrudButtons>
                    <Button bg="export" color="white" onClick={handleExport} disabled={usuariosList.length === 0}>
                        <LuDownload />
                        <p>Descargar</p>
                    </Button>
                </ActionsCrudButtons>
                    
                
            </ActionsCrud>
            <Table data={usuariosList} dataColumns={dataUsuariosColumns} arrayName={plural.charAt(0).toUpperCase() + plural.slice(1)} id_={id} />
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
<ModalFormInputContainer>
    DNI
    <Input 
        type='text' 
        placeholder="Escriba el DNI..." 
        value={dni}
        onChange={(event) => {
            const value = event.target.value;
            // Validar que solo sean números
            if (/^\d*$/.test(value)) {
                setDni(value);
            }
        }}
        icon={<PiIdentificationCardLight className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Nombre
    <Input 
        type='text' 
        placeholder="Escriba el nombre..." 
        value={nombre}
        onChange={(event) => {
            const value = event.target.value;
            // Validar que solo sean letras
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setNombre(value);
            }
        }}
        icon={<PiUser className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Apellido
    <Input 
        type='text' 
        placeholder="Escriba el apellido..." 
        value={apellido}
        onChange={(event) => {
            const value = event.target.value;
            // Validar que solo sean letras
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setApellido(value);
            }
        }}
        icon={<PiUser className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Fecha de Nacimiento
    <InputCalendar 
        type='text' 
        placeholder="Escriba aqui..." 
        value={nacimiento}
        onChange={(event) => { setNacimiento(event.target.value)}}
        icon={<AiOutlineCalendar className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Email
    <Input 
        type='text' 
        placeholder="Escriba aqui..." 
        value={email}
        onChange={(event) => { 
            const value = event.target.value;
                setEmail(value);
        }}
        icon={<PiEnvelope className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Telefono
    <Input 
        type='text' 
        placeholder="Escriba aqui..." 
        value={telefono}
        onChange={(event) => {
            const value = event.target.value;
            // Validar que solo sean números
            if (/^\d*$/.test(value)) {
                setTelefono(value);
            }
        }}
        icon={<PiPhone className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Clave
    <Input 
        type='password'  // Cambia el tipo de campo a "password"
        placeholder="Escriba aqui..." 
        value={clave}
        onChange={(event) => { setClave(event.target.value)}} 
        icon={<PiPhone className='icon-input'/>} 
    />
</ModalFormInputContainer>

<ModalFormInputContainer>
    Rol
    <Select 
        data={rolesList}
        placeholder="Seleccionar rol"
        value={rol}
        icon={<IoShieldHalf className='icon-select' />}
        onChange={(event) => { setRol(event.target.value)}}
        id_={"id_rol"}
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
            {
                isEditModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isEditModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Editar ${singular}`}
                        onClickClose={closeEditModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeEditModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={editarDato} disabled={!isUpdated() || isSaving}>
                                    {isSaving ? (
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
                                    Imagen
                                    <ModalFormInputImg>
                                        {previewImage && 
                                            <img src={previewImage} alt="Vista previa" style={{ width: '80px', height: '80px' }} />
                                        }

                                        {!previewImage && 
                                            <img src={`${URLImages}${img}`} alt="Vista previa" style={{ width: '80px', height: '80px' }} />
                                        }

                                        
                                        <Input 
                                            type='file' 
                                            accept="image/*"
                                            onChange={(event) => handleImageUpload(event)}
                                            icon={<MdOutlineImage className='icon-input'/>}
                                        />
                                    </ModalFormInputImg>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    DNI
                                    <Input 
                                        type='text' 
                                        placeholder="Escriba el DNI..." 
                                        value={dni}
                                        onChange={(event) => { setDni(event.target.value)}}
                                        icon={<PiIdentificationCardLight className='icon-input'/>} 
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Nombre
                                    <Input 
                                        type='text' 
                                        placeholder="Escriba el bombre..." value={nombre}
                                        onChange={(event) => { setNombre(event.target.value)}}
                                        icon={<PiUser className='icon-input'/>} 
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Apellido
                                    <Input 
                                        type='text' 
                                        placeholder="Escriba el apellido..." 
                                        value={apellido}
                                        onChange={(event) => { setApellido(event.target.value)}} 
                                        icon={<PiUser className='icon-input'/>} 
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Fecha de Nacimiento
                                    <Input 
                                    type='text' 
                                    placeholder="Escriba aqui..." 
                                    value={nacimiento}
                                    onChange={(event) => { setNacimiento(event.target.value)}}
                                    icon={<AiOutlineCalendar className='icon-input'/>} />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Email
                                    <Input 
                                    type='text' 
                                    placeholder="Escriba aqui..." 
                                    value={email}
                                    onChange={(event) => { setEmail(event.target.value)}}
                                    icon={<PiEnvelope className='icon-input'/>} 
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Telefono
                                    <Input 
                                    type='text' 
                                    placeholder="Escriba aqui..." 
                                    value={telefono}
                                    icon={<PiPhone className='icon-input'/>} 
                                    onChange={(event) => { setTelefono(event.target.value)}}  />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Rol
                                    <Select 
                                        data={rolesList}
                                        placeholder="Seleccionar rol"
                                        value={rol}
                                        icon={<IoShieldHalf className='icon-select' />}
                                        onChange={(event) => { setRol(event.target.value)}}
                                        id_={"id_rol"}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                {/* <ModalFormInputContainer>
                                    Equipo
                                    <Select 
                                        data={equiposList}
                                        placeholder="Seleccionar equipo"
                                        value={equipo}
                                        icon={<IoShieldHalf className='icon-select' />}
                                        onChange={(event) => { setEquipo(event.target.value)}}
                                        id_={"id_equipo"}
                                    >
                                    </Select>
                                </ModalFormInputContainer> */}
                                <ModalFormInputContainer>
                                    Estado
                                    <Select 
                                        data={dataEstadosAI}
                                        placeholder={"Seleccionar estado"}
                                        value={estado}
                                        onChange={(event) => { setEstado(event.target.value)}}
                                        id_={'id_estado'}
                                        icon={<LiaUserEditSolid className='icon-select' /> }
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

export default Usuarios;
