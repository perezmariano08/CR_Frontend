import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoList, IoPencil, IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { LuDownload, LuFlagTriangleRight, LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import { ContentNavWrapper, ContentTitle, FixtureButtons, FixtureFechas, FixtureFechasWrapper, MenuContentTop } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper, ModalJornadaContainer } from '../../../components/Modals/ModalsStyles';
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
import { BiMessageDetail, BiSolidEdit } from "react-icons/bi";

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import { dataPartidosColumns } from '../../../Data/Partidos/Partidos';
import { LiaAngleLeftSolid, LiaAngleRightSolid } from "react-icons/lia";
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { useEquipos } from '../../../hooks/useEquipos';
import { EquipoBodyTemplate, EstadoBodyTemplate, ResultadoBodyTemplate } from '../../../components/Table/TableStyles';
import { convertirFecha, formatHour, formatPartidoDateTime } from '../../../utils/formatDateTime';
import CategoriasMenuNav from './CategoriasMenuNav';
import { Calendar } from 'primereact/calendar';
import InputCalendar from '../../../components/UI/Input/InputCalendar';
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';
import { estadoPartidos } from '../../../Data/Estados/Estados';
import { fetchUsuarios } from '../../../redux/ServicesApi/usuariosSlice';
import { PiSoccerBall } from 'react-icons/pi';
import DreamTeam from './DreamTeam';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import Switch from '../../../components/UI/Switch/Switch';
import { CheckBoxContainer, CustomCheckBox, GroupContainerCheckBox, LabelCheckBox } from './categoriasStyles';

const CategoriasFixture = () => {
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL
    const [searchParams] = useSearchParams(); // Lee los parámetros de búsqueda

  // Obtén el valor del parámetro jornada
    const jornada = parseInt(searchParams.get('jornada'));

    const navigate = useNavigate()
    const { escudosEquipos, nombresEquipos } = useEquipos();
    
    // Manejo del form
    const [formState, handleFormChange, resetForm, setFormState] = useForm({ 
        id_edicion: id_categoria,
        equipo_local: '',
        equipo_visita: '',
        goles_local: '',
        goles_visita: '',
        pen_local: '',
        pen_visita: '',
        jornada_actual: '',
        jornada: '',
        dia: '',
        hora: '',
        cancha: '',
        arbitro: '',
        planillero: '',
        zona: '',
        id_partido: '',
        estado: '',
        interzonal: false,
        ventaja_deportiva: false
    });
    // const isFormEmpty = !formState.nombre_categoria.trim();

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { 
        isCreateModalOpen, openCreateModal, closeCreateModal,
        isDescripcionModalOpen, openDescripcionModal, closeDescripcionModal,
        isUpdateModalOpen, openUpdateModal, closeUpdateModal,
        isDeleteModalOpen, openDeleteModal, closeDeleteModal
    } = useModalsCrud();
    const [descripcion, setIsDescripcion] = useState(false);

    const [isEditarPartido, setEditarPartido] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
     // Estado de los botones que realizan una accion en la base de datos
    const [isImporting, setIsImporting] = useState(false);
    // Estados para guardar los datos del archivo
    const [fileKey, setFileKey] = useState(0);
    const [fileName, setFileName] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [partidoOriginal, setPartidoOriginal] = useState(null); // Guardar datos originales del partido

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
    const temporadas = useSelector((state) => state.temporadas.data);
    const zonas = useSelector((state) => state.zonas.data);
    const usuarios = useSelector((state) => state.usuarios.data);
    
    const planilleros = usuarios.filter((u) => u.id_rol === 2)
    const tipoZonaFiltrada = zonas.find((z) => z.id_zona == formState.zona)?.tipo_zona;

    const closeAndClearForm = (closeModal) => {
        closeModal()
        resetForm();
    };

    const handleSetJornadaActual = (jornada) => {
        if (zonasFiltradas.length === 0) {
            toast.error("Debes crear una zona antes de crear un partido.");
            return;
        }

        setFormState((prevFromSate) => ({
            ...prevFromSate,
            jornada_actual: jornada
        }));
        openCreateModal();
    }

    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchPartidos());
        dispatch(fetchZonas());
        dispatch(fetchUsuarios());
        dispatch(fetchTemporadas());
    }, []);

    // ACTUALIZAR
    const editarPartido = (id_partido) => {
        const partidoAEditar = partidosCategoria.find((partido) => partido.id_partido === id_partido)

        if (partidoAEditar) {

            setPartidoOriginal({
                goles_local: partidoAEditar.goles_local,
                goles_visita: partidoAEditar.goles_visita,
                pen_local: partidoAEditar.pen_local,
                pen_visita: partidoAEditar.pen_visita,
                ventaja_deportiva: partidoAEditar.ventaja_deportiva,
            });

            setFormState({
                equipo_local: partidoAEditar.id_equipoLocal,
                equipo_visita: partidoAEditar.id_equipoVisita,
                goles_local: partidoAEditar.goles_local,
                goles_visita: partidoAEditar.goles_visita,
                pen_local: partidoAEditar.pen_local,
                pen_visita: partidoAEditar.pen_visita,
                jornada: partidoAEditar.jornada,
                dia: partidoAEditar.dia,
                hora: partidoAEditar.hora,
                cancha: partidoAEditar.cancha,
                arbitro: partidoAEditar.arbitro,
                estado: partidoAEditar.estado,
                planillero: partidoAEditar.id_planillero,
                zona: partidoAEditar.id_zona,
                id_partido: partidoAEditar.id_partido,
                interzonal: partidoAEditar.interzonal === 'S' ? true : false,
                ventaja_deportiva: partidoAEditar.ventaja_deportiva,
            });
            
            openUpdateModal()
            setEditarPartido(true);
        }
    }

    // Función de actualización en el cliente
    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/actualizar-partido`, fetchPartidos, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        // Convertir la fecha a formato YYYY-MM-DD si es necesario
        const diaPartido = formState.dia ? new Date(formState.dia).toLocaleDateString('en-CA') : '';
    
        let interzonal = formState.interzonal ? 'S' : 'N';
    
        const data = { 
            id_equipoLocal: formState.equipo_local, 
            id_equipoVisita: formState.equipo_visita, 
            goles_local: formState.goles_local, 
            goles_visita: formState.goles_visita, 
            pen_local: formState.pen_local, 
            pen_visita: formState.pen_visita,
            jornada: formState.jornada, 
            dia: diaPartido, 
            hora: formState.hora,
            cancha: formState.cancha,
            arbitro: formState.arbitro,
            id_planillero: formState.planillero,
            id_edicion: edicionFiltrada.id_edicion,
            id_categoria: categoriaFiltrada.id_categoria,
            id_zona: formState.zona,
            estado: formState.estado,
            id_partido: formState.id_partido,
            interzonal: interzonal,
            ventaja_deportiva: formState.ventaja_deportiva
        };
    
        const estadoCambiado = 
            (formState.estado === 'F' || formState.estado === 'S') &&
            partidoOriginal.estado !== formState.estado;
    
        const datosCambiados =
            partidoOriginal.goles_local != formState.goles_local ||
            partidoOriginal.goles_visita != formState.goles_visita ||
            partidoOriginal.pen_local != formState.pen_local ||
            partidoOriginal.pen_visita != formState.pen_visita ||
            partidoOriginal.ventaja_deportiva != formState.ventaja_deportiva;
    
        const activarSP =
            (estadoCambiado || datosCambiados) &&
            (tipoZonaFiltrada === 'eliminacion-directa' ||
                tipoZonaFiltrada === 'eliminacion-directa-ida-vuelta');
    
        if (activarSP) {
            data.actualizar_partido = true;
        }
    
        try {
            await actualizar(data);
            closeUpdateModal();
    
            setEditarPartido(false);
            resetForm();
        } catch (error) {
            console.error('Error al actualizar el dato:', error);
        }
    };
    

    const [id_partidoEliminar, setIdPartidoEliminar] = useState(null);
    // ELIMINAR
    const { eliminarPorId, isDeleting } = useCrud(
        `${URL}/user/eliminar-partido`, fetchPartidos
    );

    const eliminarRegistros = async () => {
        try {
            await eliminarPorId(id_partidoEliminar);
        } catch (error) {
            console.error("Error eliminando partido:", error);
        } finally {
            closeDeleteModal()
        }
    };

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-partido`, fetchPartidos
    );

    const agregarRegistro = async () => {
        const diaPartido = formState.dia ?new Date(formState.dia).toISOString().split('T')[0] : ''
        
        if (
            !formState.equipo_local || 
            !formState.equipo_visita || 
            !formState.jornada ||
            !formState.dia ||
            !formState.hora
        ) {
            toast.error("Debes completar todos los campos del formulario para guardar");
            return;
        }

        if (formState.equipo_local === formState.equipo_visita) {
            toast.error("No se puede crear un partido con los mismos equipos.");
            return;
        }

        let interzonal = 'N'
        if (formState.interzonal) {
            interzonal = 'S'
        }
        
        const data = {
            id_equipoLocal: formState.equipo_local, 
            id_equipoVisita: formState.equipo_visita, 
            jornada: formState.jornada, 
            dia: diaPartido, 
            hora: formState.hora, 
            cancha: formState.cancha ? formState.cancha : "Cancha a conf.", 
            arbitro: formState.arbitro ? formState.arbitro : null, 
            id_planillero: formState.planillero ? formState.planillero : null,
            id_edicion: edicionFiltrada.id_edicion,
            id_categoria: categoriaFiltrada.id_categoria,
            id_zona: formState.zona,
            interzonal: interzonal,
            ventaja_deportiva: formState.ventaja_deportiva
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
                    const equipoLocal = equiposList.find(equipo => equipo.nombre === row.equipoLocal.trim());
                    const equipoVisita = equiposList.find(equipo => equipo.nombre === row.equipoVisita.trim());

                    // Validación para mostrar errores específicos
                    if (!equipoLocal) {
                        toast.error(`No se encontró el equipo: ${row.equipoLocal.trim()}. Revise su archivo`);
                    }
                    if (!equipoVisita) {
                        toast.error(`No se encontró el equipo: ${row.equipoVisita.trim()}. Revise su archivo`);
                    }
    
                    return {
                        ...row,
                        dia: convertirFecha(row.dia),
                        id_equipoLocal: equipoLocal.id_equipo,
                        id_equipoVisita: equipoVisita.id_equipo,
                        id_categoria: id_categoria,
                        id_edicion: edicionFiltrada.id_edicion,
                        id_zona: formState.zona
                    };
                });
                
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
    
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const categoriasEdicion = categoriasList.filter(categoria => categoria.id_edicion == id_categoria)
    const categoriasListLink = categoriasEdicion.map(categoria => ({
        ...categoria,
        link: `/admin/ediciones/categorias/resumen/${categoria.id_categoria}`, 
    }));

    const equiposCategoria = equiposList.filter((equipo) => equipo.id_categoria == id_categoria);
    const equiposTemporada = temporadas.filter((t) => t.id_categoria == id_categoria);

    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    const partidosCategoria = partidosList.filter((partido) => partido.id_categoria == id_categoria)
    const zonasFiltradas = zonas.filter((z) => z.id_categoria == categoriaFiltrada.id_categoria)
    
    // Agregar acciones a la tabla
    const partidosListLink = partidosCategoria.map(partido => ({
        ...partido,
        acciones: (
            <div style={{display: "flex", gap: "10px"}}>
                <Button bg={"danger"} onClick={() => {
                    setIdPartidoEliminar(partido.id_partido)
                    openDeleteModal()
                }}>
                    <IoTrashOutline />
                </Button>
                <Button bg={"import"} onClick={() => editarPartido(partido.id_partido)}>
                    <BiSolidEdit />
                </Button>
                <Button bg={"export"} onClick={() => abrirDescripcion(partido.descripcion)}>
                    <BiMessageDetail />
                </Button>
            </div>
        ),
        id_equipoLocal: (
            <EquipoBodyTemplate className='local'>
                <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                <span>{nombresEquipos(partido.id_equipoLocal)}</span>
            </EquipoBodyTemplate>
        ),
        id_equipoVisita: (
            <EquipoBodyTemplate>
                <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                <span>{nombresEquipos(partido.id_equipoVisita)}</span>
            </EquipoBodyTemplate>
        ),
        estado: (
            <>
                {partido.estado === 'F' && (
                    <EstadoBodyTemplate $bg={"success"}>FINALIZADO</EstadoBodyTemplate>
                )}
                {partido.estado === 'P' && (
                    <EstadoBodyTemplate $bg={"import"}>PROGRAMADO</EstadoBodyTemplate>
                )}
                {partido.estado === 'S' && (
                    <EstadoBodyTemplate $bg={"danger"}>SUSPENDIDO</EstadoBodyTemplate>
                )}
                {partido.estado === 'C' && (
                    <EstadoBodyTemplate $bg={"export"}>EN CURSO</EstadoBodyTemplate>
                )}
                {partido.estado === 'T' && (
                    <EstadoBodyTemplate $bg={"yellow"}>FALTA SUBIR</EstadoBodyTemplate>
                )}
            </>
        ),
        resultado: (
            <ResultadoBodyTemplate>
                <span>{partido.goles_local}</span>
                <span>-</span>
                <span>{partido.goles_visita}</span>
            </ResultadoBodyTemplate>
        ),
        dia: (
            formatPartidoDateTime(partido.dia)
        ),
        hora: (
            formatHour(partido.hora)
        )
    }));

    // Filtrar partidos por fecha
    const partidosJornada = partidosListLink.filter((p) => p.jornada === jornada)
    
    // Estado para manejar la fecha seleccionada
    const [fechaSeleccionada, setFechaSeleccionada] = useState(jornada);

    // Navegar entre fechas
    const cambiarFecha = (direccion) => {
        // const indexActual = fechas.indexOf(fechaSeleccionada);
        if (direccion === 'anterior') {
            navigate(`/admin/categorias/fixture/${id_categoria}?jornada=${jornada - 1}`)
        } else if (direccion === 'siguiente') {
            navigate(`/admin/categorias/fixture/${id_categoria}?jornada=${jornada + 1}`)
            // setFechaSeleccionada(jornadaInt + 1);
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

    const abrirDescripcion = (mensaje) => {
        openDescripcionModal()
        mensaje ? setIsDescripcion(mensaje) : setIsDescripcion("No hay descripción del partido")
    }

    // No permite elegir el mismo equipo local y visitante
    useEffect(() => {
        if (!isEditarPartido) {
            if (formState.equipo_local) {
    
            setFormState((prevState) => ({
                ...prevState,
                equipo_visita: '',
            }));
            }
        }
    }, [formState.equipo_local]);
    
    const mostrarEquipos = (equipos) => {
        if (!equipos) {
            toast.error("No se encontraron equipos");
            return;
        }
    
        const zonaElegida = zonas.find((z) => z.id_zona == formState.zona);
        
        if (formState.interzonal) {
            const equiposInterzonal = equipos.filter(
                (equipo) =>
                    equipo.id_categoria == zonaElegida.id_categoria &&
                    zonas.find((z) => z.id_zona == equipo.id_zona)?.fase == zonaElegida?.fase
            );

            return equiposInterzonal;
        } else {
            const equiposZona = equipos.filter((equipo) => equipo.id_zona == formState.zona);
            return equiposZona;
        }
    };

    const validarRenderVentaja = () => {
        const tipoZonaFiltrada = zonas.find((z) => z.id_zona == formState.zona)?.tipo_zona;
        
        return formState.equipo_local && formState.equipo_visita && tipoZonaFiltrada !== 'todos-contra-todos';
    };
    
    const isValid = validarRenderVentaja();

    const determinarInstancia = (id_zona, jornada) => {
        const zonaFiltrada = zonas?.find((z) => z.id_zona == id_zona);
        if (!zonaFiltrada) {
            return 'Zona no encontrada';
        }
    
        if (zonaFiltrada.tipo_zona === 'todos-contra-todos') {
            return `Fecha ${jornada}`;
        }
    
        if (zonaFiltrada.fase === 1) {
            return 1;
        }
    
        return `${zonaFiltrada.nombre_zona} - (Fecha ${jornada})` || 'Nombre no disponible';
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
            <CategoriasMenuNav id_categoria={id_categoria}/>
            {
                partidosCategoria.length > 0 ? (
                    <>
                        <FixtureFechasWrapper>
                            <FixtureFechas>
                                <Button onClick={() => cambiarFecha('anterior')} disabled={jornada - 1 === 0}>
                                    <LiaAngleLeftSolid  />
                                </Button>
                                <span>{determinarInstancia(partidosJornada[0].id_zona, jornada)}</span>
                                <Button onClick={() => cambiarFecha('siguiente')} disabled={partidosListLink.filter((p) => p.jornada === jornada + 1).length === 0}>
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
                            <FixtureButtons>
                                <Button bg="success" color="white" onClick={() => handleSetJornadaActual(partidosJornada[0]?.jornada)}>
                                    <FiPlus />
                                    <p>Crear partido</p>
                                </Button>
                                <Button bg="import" color="white" onClick={openImportModal}>
                                    <LuUpload />
                                    <p>Importar fechas</p>
                                </Button>
                            </FixtureButtons>
                            
                        </FixtureFechasWrapper>
                        {
                            partidosJornada.length > 0 ? <Table
                            data={partidosJornada}
                            dataColumns={dataPartidosColumns}
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={'id_partido'}
                            // urlClick={`/admin/categorias/fixture/${edicionFiltrada.id_edicion}/detalle/`}
                            // rowClickLink
                        /> : <p>No se encontraron partidos para esta jornada.</p>
                        }
                        
                    </>
                ) : (
                    <>
                        <Button bg="success" color="white" onClick={() => handleSetJornadaActual(partidosJornada[0]?.jornada)}>
                                    <FiPlus />
                                    <p>Crear partido</p>
                        </Button>
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
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Agregar partido`}
                        onClickClose={() => closeAndClearForm(closeCreateModal)}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={() => closeAndClearForm(closeCreateModal)}>
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
                                    Zona
                                    <Select 
                                        name={'zona'}
                                        data={zonasFiltradas}
                                        placeholder={'Seleccionar zona'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_zona"}
                                        column='nombre_zona'
                                        value={formState.zona}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                {
                                    tipoZonaFiltrada === 'todos-contra-todos' && (
                                        <ModalFormInputContainer>
                                            Interzonal
                                            <Switch
                                                disabled={!formState.zona}
                                                isChecked={formState.interzonal}
                                                onChange={(e) => handleFormChange({
                                                    target: { name: 'interzonal', value: e.target.checked }
                                                })}
                                            />
                                        </ModalFormInputContainer>
                                    )
                                }
                                <ModalFormInputContainer>
                                    Equipo Local
                                    <Select 
                                        name={'equipo_local'}
                                        data={mostrarEquipos(equiposTemporada.filter((e) => e.id_equipo != formState.equipo_visita))}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        column='nombre_equipo'
                                        value={formState.equipo_local}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Equipo Visitante
                                    <Select 
                                        name={'equipo_visita'}
                                        data={mostrarEquipos(equiposTemporada.filter((e) => e.id_equipo != formState.equipo_local))}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        column='nombre_equipo'
                                        value={formState.equipo_visita}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                {
                                    isValid && (
                                        <ModalFormInputContainer>
                                        Ventaja Deportiva
                                        <GroupContainerCheckBox>
                                            <CheckBoxContainer>
                                            <LabelCheckBox>
                                                {nombresEquipos(parseInt(formState.equipo_local))}
                                                <CustomCheckBox 
                                                type="checkbox" 
                                                checked={formState.ventaja_deportiva === formState.equipo_local}
                                                onChange={() => setFormState({ 
                                                    ...formState, 
                                                    ventaja_deportiva: formState.ventaja_deportiva === formState.equipo_local ? null : formState.equipo_local 
                                                })}
                                                />
                                            </LabelCheckBox>
                                            </CheckBoxContainer>
                                            <CheckBoxContainer>
                                            <LabelCheckBox>
                                                {nombresEquipos(parseInt(formState.equipo_visita))}
                                                <CustomCheckBox 
                                                type="checkbox" 
                                                checked={formState.ventaja_deportiva === formState.equipo_visita}
                                                onChange={() => setFormState({ 
                                                    ...formState, 
                                                    ventaja_deportiva: formState.ventaja_deportiva === formState.equipo_visita ? null : formState.equipo_visita 
                                                })}
                                                />
                                            </LabelCheckBox>
                                            </CheckBoxContainer>
                                        </GroupContainerCheckBox>
                                        </ModalFormInputContainer>
                                    )
                                }
                                <ModalJornadaContainer>
                                    <ModalFormInputContainer>
                                        Jornada actual
                                        <Input 
                                            name='jornada'
                                            type='number' 
                                            placeholder="Ejemplo: 1" 
                                            icon={<BsCalendar2Event className='icon-input'/>} 
                                            value={formState.jornada_actual}
                                            onChange={handleFormChange}
                                            readOnly
                                        />
                                    </ModalFormInputContainer>
                                    <ModalFormInputContainer>
                                        Jornada
                                        <Input 
                                            name='jornada'
                                            type='number' 
                                            placeholder="Ejemplo: 1" 
                                            icon={<BsCalendar2Event className='icon-input'/>} 
                                            value={formState.jornada}
                                            onChange={handleFormChange}
                                        />
                                    </ModalFormInputContainer>
                                </ModalJornadaContainer>
                                <ModalFormInputContainer>
                                    Día
                                    <InputCalendar
                                        name='dia'
                                        placeholder="Seleccione fecha" 
                                        value={formState.dia}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Hora
                                    <Input 
                                        name='hora'
                                        type='time' 
                                        placeholder="Ejemplo: 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.hora}
                                        onChange={handleFormChange}
                                        step="1800"  // 30 minutos = 1800 segundos
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Cancha
                                    <Input 
                                        name='cancha'
                                        type='text' 
                                        placeholder="Ejemplo: Cancha 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.cancha}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Arbitro
                                    <Input 
                                        name='arbitro'
                                        type='text' 
                                        placeholder="Nombre" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.arbitro}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Planillero
                                    <Select 
                                        name={'planillero'}
                                        data={planilleros}
                                        placeholder={'Seleccionar planillero'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_usuario"}
                                        column='usuario'
                                        value={formState.planillero}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                
                            </>
                        }
                    />
                    <Overlay onClick={() => closeAndClearForm(closeCreateModal)} />
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
                        exampleFile={"/ejemplo_partidos.csv"}
                        nombreEjemplo={'partidos'}
                        select={
                            <ModalFormInputContainer>
                                Zona
                                <Select 
                                    name={'zona'}
                                    data={zonasFiltradas}
                                    placeholder={'Seleccionar zona'}
                                    icon={<IoShieldHalf className='icon-select'/>}
                                    id_={"id_zona"}
                                    column='nombre_zona'
                                    value={formState.zona}
                                    onChange={handleFormChange}
                                >
                                </Select>
                            </ModalFormInputContainer>
                        }
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
                                <Button color={"success"} onClick={handleFileImport} disabled={!fileName || !formState.zona}>
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
                isDescripcionModalOpen && <>
                    <ModalCreate 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDescripcionModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Descripción del partido`}
                        onClickClose={closeDescripcionModal}
                        texto={descripcion}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeDescripcionModal}>
                                    <IoClose />
                                    Cerrar
                                </Button>
                            </>
                        }
                    />
                    <Overlay onClick={closeDescripcionModal} />
                </>
            }
            {
                isUpdateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Editar partido`}
                        onClickClose={() => {
                            closeUpdateModal()
                            resetForm()
                        }}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={() => {
                                    closeUpdateModal()
                                    resetForm()
                                }}>
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
                                    Zona
                                    <Select 
                                        name={'zona'}
                                        data={zonasFiltradas}
                                        placeholder={'Seleccionar zona'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_zona"}
                                        column='nombre_zona'
                                        value={formState.zona}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                {
                                    tipoZonaFiltrada === 'todos-contra-todos' && (
                                        <ModalFormInputContainer>
                                            Interzonal
                                            <Switch
                                                disabled={!formState.zona}
                                                isChecked={formState.interzonal}
                                                onChange={(e) => handleFormChange({
                                                    target: { name: 'interzonal', value: e.target.checked }
                                                })}
                                            />
                                        </ModalFormInputContainer>
                                    )
                                }
                                <ModalFormInputContainer>
                                    Equipo Local
                                    <Select 
                                        name={'equipo_local'}
                                        data={mostrarEquipos(equiposTemporada.filter((e) => e.id_equipo != formState.equipo_visita))}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        column='nombre_equipo'
                                        value={formState.equipo_local}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormWrapper>
                                    <ModalFormInputContainer>
                                        Goles local
                                        <Input 
                                            name='goles_local'
                                            type='number' 
                                            placeholder="Ejemplo: 1" 
                                            icon={<PiSoccerBall className='icon-input'/>} 
                                            value={formState.goles_local}
                                            onChange={handleFormChange}
                                        />
                                    </ModalFormInputContainer>
                                    {
                                        (tipoZonaFiltrada === 'eliminacion-directa' || tipoZonaFiltrada === 'eliminacion-directa-ida-vuelta') && (
                                            <ModalFormInputContainer>
                                                Penales local
                                                <Input 
                                                    name='pen_local'
                                                    type='number' 
                                                    placeholder="Ejemplo: 1" 
                                                    icon={<PiSoccerBall className='icon-input'/>} 
                                                    value={formState.pen_local}
                                                    onChange={handleFormChange}
                                                />
                                            </ModalFormInputContainer>
                                        )
                                    }
                                </ModalFormWrapper>
                                <ModalFormInputContainer>
                                    Equipo Visitante
                                    <Select 
                                        name={'equipo_visita'}
                                        data={mostrarEquipos(equiposTemporada.filter((e) => e.id_equipo != formState.equipo_local))}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        column='nombre_equipo'
                                        value={formState.equipo_visita}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormWrapper>
                                    <ModalFormInputContainer>
                                        Goles visita
                                        <Input 
                                            name='goles_visita'
                                            type='number' 
                                            placeholder="Ejemplo: 1" 
                                            icon={<PiSoccerBall className='icon-input'/>} 
                                            value={formState.goles_visita}
                                            onChange={handleFormChange}
                                        />
                                    </ModalFormInputContainer>
                                    {
                                        (tipoZonaFiltrada === 'eliminacion-directa' || tipoZonaFiltrada === 'eliminacion-directa-ida-vuelta') && (
                                            <ModalFormInputContainer>
                                                Penales visita
                                                <Input 
                                                    name='pen_visita'
                                                    type='number' 
                                                    placeholder="Ejemplo: 1" 
                                                    icon={<PiSoccerBall className='icon-input'/>} 
                                                    value={formState.pen_visita}
                                                    onChange={handleFormChange}
                                                />
                                            </ModalFormInputContainer>
                                        )
                                    }
                                </ModalFormWrapper>
                                {
                                    isValid && (
                                        <ModalFormInputContainer>
                                        Ventaja Deportiva
                                        <GroupContainerCheckBox>
                                            <CheckBoxContainer>
                                            <LabelCheckBox>
                                                {nombresEquipos(parseInt(formState.equipo_local))}
                                                <CustomCheckBox 
                                                type="checkbox" 
                                                checked={formState.ventaja_deportiva === formState.equipo_local}
                                                onChange={() => setFormState({ 
                                                    ...formState, 
                                                    ventaja_deportiva: formState.ventaja_deportiva === formState.equipo_local ? null : formState.equipo_local 
                                                })}
                                                />
                                            </LabelCheckBox>
                                            </CheckBoxContainer>
                                            <CheckBoxContainer>
                                            <LabelCheckBox>
                                                {nombresEquipos(parseInt(formState.equipo_visita))}
                                                <CustomCheckBox 
                                                type="checkbox" 
                                                checked={formState.ventaja_deportiva === formState.equipo_visita}
                                                onChange={() => setFormState({ 
                                                    ...formState, 
                                                    ventaja_deportiva: formState.ventaja_deportiva === formState.equipo_visita ? null : formState.equipo_visita 
                                                })}
                                                />
                                            </LabelCheckBox>
                                            </CheckBoxContainer>
                                        </GroupContainerCheckBox>
                                        </ModalFormInputContainer>
                                    )
                                }
                                <ModalFormInputContainer>
                                    Jornada
                                    <Input 
                                        name='jornada'
                                        type='number' 
                                        placeholder="Ejemplo: 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.jornada}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Establecer nuevo día
                                    <InputCalendar
                                        name='dia'
                                        placeholder="Seleccione fecha" 
                                        value={formState.dia}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Hora
                                    <Input 
                                        name='hora'
                                        type='time' 
                                        placeholder="Ejemplo: 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.hora}
                                        onChange={handleFormChange}
                                        
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Cancha
                                    <Input 
                                        name='cancha'
                                        type='text' 
                                        placeholder="Ejemplo: Cancha 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.cancha}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Arbitro
                                    <Input 
                                        name='arbitro'
                                        type='text' 
                                        placeholder="Nombre" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.arbitro}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Planillero
                                    <Select 
                                        name={'planillero'}
                                        data={planilleros}
                                        placeholder={'Seleccionar planillero'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_usuario"}
                                        column='usuario'
                                        value={formState.planillero}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Estado
                                    <Select 
                                        name={'estado'}
                                        data={estadoPartidos}
                                        placeholder={'Seleccionar estado'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_estado"}
                                        column='nombre'
                                        value={formState.estado}
                                        onChange={handleFormChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={() => {
                        closeUpdateModal()
                        resetForm()
                    }} />
                </>
            }
            {
                isDeleteModalOpen && (
                    <>
                        <ModalDelete
                            text={
                            `¿Estas seguro que quieres eliminar el partido?`}
                            animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={closeDeleteModal}
                            title={`Eliminar edición ${categoriaFiltrada.nombre}?`}
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
        <DreamTeam id_categoria={id_categoria} jornada={jornada} />
        </Content>
    );
};

export default CategoriasFixture;
