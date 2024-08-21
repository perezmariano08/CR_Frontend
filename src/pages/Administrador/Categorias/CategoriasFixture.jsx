import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoPencil, IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { LuDownload, LuFlagTriangleRight, LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import { ContentNavWrapper, ContentTitle, FixtureFechas, FixtureFechasWrapper, MenuContentTop } from '../../../components/Content/ContentStyles';
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
import { dataPartidosColumns } from '../../../Data/Partidos/Partidos';
import { LiaAngleLeftSolid, LiaAngleRightSolid } from "react-icons/lia";
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';

const CategoriasFixture = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams(); // Obtenemos el id desde la URL
    
    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_edicion: id_page,
        nombre_categoria: '',
        genero: 'M',
        tipo_futbol: 7,
        duracion_tiempo: '',
        duracion_entretiempo: '',
    });
    const isFormEmpty = !formState.nombre_categoria.trim();

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { isCreateModalOpen, openCreateModal, closeCreateModal } = useModalsCrud();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
     // Estado de los botones que realizan una accion en la base de datos
    const [isImporting, setIsImporting] = useState(false);
    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);
    // Referencia del input
    const fileInputRef = useRef(null);

    // Constantes del modulo
    const articuloSingular = "el"
    const articuloPlural = "los"
    const id = "id_equipo"
    const plural = "ediciones"
    const singular = "edicion"
    const get = "get-anios"
    const create = "crear-anio"
    const importar = "importar-anios"
    const eliminar = "delete-anio"


    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const partidosList = useSelector((state) => state.partidos.data);
    const equiposList = useSelector((state) => state.equipos.data);
    
    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchPartidos());
    }, []);


    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-categoria`, fetchCategorias, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {
        if (!formState.nombre_categoria.trim() || !formState.duracion_tiempo || !formState.duracion_entretiempo) {
            toast.error("Completá los campos.");
            return;
        }

        if (formState.duracion_tiempo < 4 ) {
            toast.error("La duración de cada tiempo debe tener al menos 5.");
            return;
        }

        if (categoriasList.some(a => a.nombre === formState.nombre_categoria.trim() && a.id_edicion == formState.id_edicion)) {
            toast.error(`La categoría ya existe en esta edición.`);
            return;
        }
        
        
        const data = {
            id_edicion: formState.id_edicion,
            nombre: formState.nombre_categoria.trim(),
            genero: formState.genero,
            tipo_futbol: formState.tipo_futbol,
            duracion_tiempo: formState.duracion_tiempo,
            duracion_entretiempo: formState.duracion_entretiempo
        };
        
        await crear(data);
        closeCreateModal();
        resetForm()
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
        if (fileData) {
                // Mapea los nombres de los equipos a sus respectivos IDs
                const nuevosDatos = fileData.map(row => {
                    const equipoLocal = equiposList.find(equipo => equipo.nombre === row.equipoLocal);
                    const equipoVisita = equiposList.find(equipo => equipo.nombre === row.equipoVisita);
    
                    if (!equipoLocal || !equipoVisita) {
                        throw new Error(`No se encontraron equipos para uno o ambos nombres: ${row.equipoLocal}, ${row.equipoVisita}`);
                    }
    
                    return {
                        ...row,
                        id_equipoLocal: equipoLocal.id_equipo,
                        id_equipoVisita: equipoVisita.id_equipo,
                        id_categoria: id_page,
                    };
                });
    
                console.log(nuevosDatos);
                setIsImporting(true); 
                // Aquí puedes continuar con la importación de los datos
                Axios.post(`${URL}/user/importar-partidos`, nuevosDatos)
                    .then(() => {
                        toast.success(`Se importaron ${nuevosDatos.length} registros correctamente.`);
                        setIsImporting(false); 
                        closeImportModal()
                        dispatch(fetchPartidos());
                        setFileKey(prevKey => prevKey + 1);
                        setFileName(""); // Restablece el nombre del archivo después de la importación
                        setFileData(null); // Restablece los datos del archivo después de la importación
                    })
                    .catch(error => {
                        setIsImporting(false); 
                        toast.error("Error al importar los datos.");
                        console.error("Error al importar los datos:", error.response?.data || error.message);
                    });
        } else {
            toast.error("No hay datos para importar.");
        }
    };
    
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_page);
    const categoriasEdicion = categoriasList.filter(categoria => categoria.id_edicion == id_page)
    const categoriasListLink = categoriasEdicion.map(categoria => ({
        ...categoria,
        link: `/admin/ediciones/categorias/resumen/${categoria.id_categoria}`, 
    }));

    const categoriaEquipos = equiposList.filter((equipo) => equipo.id_categoria == id_page)
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    const partidosCategoria = partidosList.filter((partido) => partido.id_categoria == id_page)
    // Agregar acciones a la tabla
        const partidosListLink = partidosCategoria.map(partido => ({
            ...partido,
            eliminar: (
                <div style={{display: "flex", gap: "10px"}}>
                    <Button bg={"danger"} onClick={() => ''}>
                        <IoTrashOutline />
                    </Button>
                    <Button bg={"import"} onClick={() => ''}>
                        <IoPencil />
                    </Button>
                </div>
                
            ),
        }));
    // Agrupar partidos por fecha
    const partidosPorFecha = partidosListLink.reduce((acc, partido) => {
        const fecha = partido.jornada; // Asumiendo que `partido.fecha` contiene la fecha del partido
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(partido);
        return acc;
    }, {});

    const fechas = Object.keys(partidosPorFecha);

    // Estado para manejar la fecha seleccionada
    const [fechaSeleccionada, setFechaSeleccionada] = useState(fechas[0]);

    // Navegar entre fechas
    const cambiarFecha = (direccion) => {
        const indexActual = fechas.indexOf(fechaSeleccionada);
        if (direccion === 'anterior' && indexActual > 0) {
            setFechaSeleccionada(fechas[indexActual - 1]);
        } else if (direccion === 'siguiente' && indexActual < fechas.length - 1) {
            setFechaSeleccionada(fechas[indexActual + 1]);
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
                <li><NavLink to={`/admin/categorias/equipos/${id_page}`}>Equipos ({categoriaEquipos.length})</NavLink></li>
                <li><NavLink to={`/admin/categorias/config/${id_page}`}>Configuración</NavLink></li>
            </ContentNavWrapper>
            {
                partidosCategoria.length > 0 ? (
                    <>
                        <FixtureFechasWrapper>
                            <FixtureFechas>
                                <Button onClick={() => cambiarFecha('anterior')} disabled={fechas.indexOf(fechaSeleccionada) === 0}>
                                    <LiaAngleLeftSolid  />
                                </Button>
                                <span>Fecha {fechaSeleccionada}</span>
                                <Button onClick={() => cambiarFecha('siguiente')} disabled={fechas.indexOf(fechaSeleccionada) === fechas.length - 1}>
                                    <LiaAngleRightSolid  />
                                </Button>
                            </FixtureFechas>
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
                                <p>Importar fechas</p>
                            </Button>
                        </FixtureFechasWrapper>
                        <Table
                            data={partidosPorFecha[fechaSeleccionada]}
                            dataColumns={dataPartidosColumns}
                            arrayName={'Partidos'}
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={'id_partido'}
                            urlClick={`/admin/categorias/equipos/${edicionFiltrada.id_edicion}/detalle/`}
                            rowClickLink
                        />
                    </>
                ) : (
                    <>
                        <p>No se encontraron partidos.</p>
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
        </Content>
    );
};

export default CategoriasFixture;
