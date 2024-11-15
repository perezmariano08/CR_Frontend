import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
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
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { CategoriasEdicionEmpty, TablasTemporadaContainer, TablaTemporada } from '../Ediciones/edicionesStyles';
import useForm from '../../../hooks/useForm';
import { TbPlayFootball } from 'react-icons/tb';
import Select from '../../../components/Select/Select';
import { LiaAngleDownSolid } from "react-icons/lia";
import { GoKebabHorizontal } from "react-icons/go";

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import CategoriasMenuNav from './CategoriasMenuNav';
import { CategoriaFormatoWrapper, EquipoExiste, EquipoExisteDivider, EquipoExisteEscudo, EquipoExisteItem, EquipoExisteLista, EquipoNoExiste, FaseDivider, FormatoFaseTitulo, FormatoFaseWrapper, FormatoZona, FormatoZonaContainer, FormatoZonaInfo, FormatoZonasWrapper, FormatoZonaVacantes, VacanteEquipo, VacanteWrapper } from './categoriasStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { fetchFases } from '../../../redux/ServicesApi/fasesSlice';
import { getEtapas, getIdPartidosZona, getPartidosCategoria, getPartidosZona, insertarFase } from '../../../utils/dataFetchers';
import useFetchData from './useFetchData';

const CategoriasFormato = () => {
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const zonas = useSelector((state) => state.zonas.data);
    // const partidosCategoria = partidos.filter((p) => p.id_categoria == id_categoria)
    
    const temporadas = useSelector((state) => state.temporadas.data);
    const equiposTemporada = temporadas.filter((t) => t.id_categoria == id_categoria)
    const fases = useSelector((state) => state.fases.data);

    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);

    // Manejo del form
    const [formState, handleFormChange, resetForm, setFormState] = useForm({
        id_categoria: id_categoria,
        nombre_zona: '',
        tipo_zona: 'todos-contra-todos',
        cantidad_equipos: '',
        nombre_equipo: '',
        id_zona: '',
        fase: null,
        fases_select: null,
        zonas_select: null,
        id_partido_previo: null,
        etapa: null,
        vacante: null,
        id_edicion: edicionFiltrada.id_edicion,
    });

    //Modales
    const [isAsignarEquipoZona, setAsignarEquipoZona] = useState(false);
    const [isAsignarVacantePlayOff, setAsignarVacantePlayOff] = useState(false);
    const [isEliminarVacante, setEliminarVacante] = useState(false);
    const [isVaciarVacante, setVaciarVacante] = useState(false);

    const [numeroVacante, setNumeroVacante] = useState('');
    const [id_zona, setIdZona] = useState('');
    const [idEliminar, setidEliminar] = useState(null)

    const [zonaExpandida, setZonaExpandida] = useState(null);
    const [crearEquipo, setCrearEquipo] = useState(false);
    // const [vacantePlayOff, setVacantePlayOff] = useState(false);
    const [faseActual, setFaseActual] = useState(null);
    const [VacanteEliminar, setVacanteEliminar] = useState(null)
    const [partidosZona, setPartidosZona] = useState([]);
    const [triggerFetch, setTriggerFetch] = useState(false); // Variable de estado para controlar el fetch
    const [faseEstado, setFaseEstado] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [initialZona, setInitialZona] = useState(null); // Store initial zone data

    // MODAL HANDLERS
    const openEquipoZona = () => setAsignarEquipoZona(true);
    const closeEquipoZona = () => setAsignarEquipoZona(false);

    const openEliminarVacante = () => setEliminarVacante(true);
    const closeEliminarVacante = () => setEliminarVacante(false);

    const openAsignarVacantePlayOff = () => setAsignarVacantePlayOff(true);
    const closeAsignarVacantePlayOff = () => setAsignarVacantePlayOff(false);

    const openVaciarVacante = () => setVaciarVacante(true);
    const closeVaciarVacante = () => setVaciarVacante(false);

    const {
        isCreateModalOpen, openCreateModal, closeCreateModal,
        isDeleteModalOpen, openDeleteModal, closeDeleteModal,
        isUpdateModalOpen, openUpdateModal, closeUpdateModal,
    } = useModalsCrud();

    //Fetch hooks
    const { data: etapas, loading: loadingEtapas, error: errorEtapas } = useFetchData(getEtapas);

    const { data: idPartidosZona, loading: loadingIdPartidos, error: errorIdPartidos } = useFetchData(
        () => getIdPartidosZona(formState.zonas_select), 
        [formState.zonas_select]
    );
    
    const { data: partidosCategoria, loading: loadingPartidosCategoria, error: errorPartidosCategoria } = useFetchData(
        () => getPartidosCategoria(id_categoria), 
        [id_categoria, triggerFetch]
    );

    const verificarVacante = (id_zona, vacante) => {
        // Verificar en temporadas si existe la vacante
        const vacanteTemporada = temporadas.find((t) => t.id_zona == id_zona && t.vacante == vacante);
        if (vacanteTemporada && vacanteTemporada.id_equipo) {
            return true;
        }
    
        // Verificar en partidosCategoria si existe la vacante y si tiene un partido previo
        const vacantePartido = partidosCategoria.find((p) => p.id_zona == id_zona && 
            (p.vacante_local == vacante || p.vacante_visita == vacante));
    
        if (vacantePartido) {
            // Verificar si es el local o la visita y comprobar si tiene un partido previo
            if (vacantePartido.vacante_local == vacante && vacantePartido.id_partido_previo_local) {
                return true;
            } 
            if (vacantePartido.vacante_visita == vacante && vacantePartido.id_partido_previo_visita) {
                return true;
            }
        }
    
        return false;
    }

    const openModalVaciarVacante = (id_zona, vacante) => { 

        if (!verificarVacante(id_zona, vacante)) {
            toast.error('La vacante ya se encuentra vacía');
            return;
        }

        const tipoZona = zonas.find(z => z.id_zona == id_zona).tipo_zona;

        setFormState({
            id_zona: id_zona,
            vacante: vacante,
            tipo_zona: tipoZona,
        });

        openVaciarVacante();
    }

    const closeAndClearForm = (closeModal) => {
        closeModal()
        resetForm();
    };

    const agregarEquipoZona = async (id_zona, vacante) => {
        setIdZona(id_zona);
        setNumeroVacante(vacante);
        
        // Usar el valor de vacante directamente aquí
        const partidosZonaFetch = await getPartidosZona(id_zona, vacante);
        setPartidosZona(partidosZonaFetch);
    
        openEquipoZona();
    };

    const handleSetFaseEstado = (numero_fase) => {
        setFaseEstado(numero_fase);
        openCreateModal();
    };

    //ACTUALIZAR
    const { actualizar, isUpdating } = useCrud(
        `${URL}/admin/actualizar-zona`, fetchZonas, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const openModalUpdate = (zona) => {
        const etapaEncontrada = etapas.find(e => e.id_etapa == zona.id_etapa);

        const zonaDefault = {
            id_zona: zona.id_zona,
            nombre_zona: zona.nombre_zona,
            tipo_zona: zona.tipo_zona,
            etapa: etapaEncontrada.id_etapa,
            cantidad_equipos: zona.cantidad_equipos,
        };
        setInitialZona(zonaDefault);
        setFormState(zonaDefault);
    
        openUpdateModal();
    };

    useEffect(() => {
        validateForm();
    }, [formState]);
    
    const validateForm = () => {
        if (
            initialZona &&
            formState &&
            formState.nombre_zona?.trim() === initialZona.nombre_zona?.trim() &&
            formState.tipo_zona === initialZona.tipo_zona &&
            formState.cantidad_equipos == initialZona.cantidad_equipos &&
            formState.etapa == initialZona.etapa
        ) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    };
    
    const handleFormChangeWithValidation = (e) => {
        handleFormChange(e); // Update formState with changes
    };
    
    const contarVacantesOcupadas = (zonaId) => {
        const cantidadEquiposZona = zonas.find(z => z.id_zona == zonaId).cantidad_equipos;
        const cantidadEquiposTemporada = temporadas.filter((t) => t.id_zona == zonaId).length;
        
        const cantidadEquiposPartidos = partidosCategoria.reduce((count, partido) => {
            if (partido.id_zona === zonaId) {
                // Sumar 1 si id_partido_previo_local o id_partido_previo_visita está ocupado
                if (partido.id_partido_previo_local) count += 1;
                if (partido.id_partido_previo_visita) count += 1;
            }
            return count;
        }, 0);
    
        const vacantesOcupadas = cantidadEquiposTemporada + cantidadEquiposPartidos;
    
        return Math.min(vacantesOcupadas, cantidadEquiposZona);
    };
    
    const determinarTipoActualizacion = (cantidadNueva, idZona) => {
        const cantidadVieja = zonas.find((z) => z.id_zona == idZona).cantidad_equipos;
        if (cantidadNueva > cantidadVieja) {
            return 'mayor';
        } else if (cantidadNueva < cantidadVieja) {
            return 'menor';
        } else {
            return 'igual';
        }
    };
    
    // Función para actualizar el registro
    const actualizarRegistro = async () => {
        const vacantesOcupadas = contarVacantesOcupadas(Number(formState.id_zona));
        const tipoActualizacion = determinarTipoActualizacion(formState.cantidad_equipos, formState.id_zona)

        if (formState.tipo_zona === 'eliminacion-directa' && parseInt(formState.cantidad_equipos) % 2 !== 0) {
            toast.error("En zonas de eliminación directa el número de equipos debe ser par.");
            return;
        }

        if (vacantesOcupadas > parseInt(formState.cantidad_equipos)) {
            const exceso = vacantesOcupadas - parseInt(formState.cantidad_equipos);
            toast.error(`Hay ${vacantesOcupadas} vacantes ocupadas. Debe vaciar ${exceso} para continuar.`);
            return;
        }

        if (!formState.nombre_zona.trim()) {
            toast.error("Completá los campos.");
            return;
        }

        if (parseInt(formState.cantidad_equipos) < 2) {
            toast.error("El campo cantidad de equipos debe tener al menos 2.");
            return;
        }

        if (formState.tipo_zona === 'eliminacion-directa' && parseInt(formState.cantidad_equipos) % 2 !== 0) {
            toast.error("El número de equipos debe ser par.");
            return;
        }

        const data = {
            id_zona: formState.id_zona,
            nombre_zona: formState.nombre_zona,
            tipo_zona: formState.tipo_zona,
            etapa: formState.etapa,
            cantidad_equipos: formState.cantidad_equipos,
            tipo: tipoActualizacion
        };

        await actualizar(data);
        closeUpdateModal();
        resetForm();
    };

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-zona-vacantes-partidos`, fetchZonas, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {
        if (!formState.nombre_zona.trim()) {
            toast.error("Completá los campos.");
            return;
        }

        if (formState.cantidad_equipos < 2) {
            toast.error("El campo cantidad de equipos debe tener al menos 2.");
            return;
        }

        if (formState.tipo_zona === 'eliminacion-directa' && parseInt(formState.cantidad_equipos) % 2 !== 0) {
            toast.error("El numero de equipos debe ser par");
            return;
        }

        const data = {
            id_categoria: id_categoria,
            nombre: formState.nombre_zona.trim(),
            cantidad_equipos: formState.cantidad_equipos,
            id_etapa: formState.etapa || 1,
            fase: faseEstado,
            tipo_zona: formState.tipo_zona,
            id_edicion: formState.id_edicion,
        };

        await crear(data);
        closeCreateModal();
        resetForm()
    };

    // CREAR
    const { crear: guardarEquipo, isSaving: isSavingCrearEquipo } = useCrud(
        `${URL}/user/crear-equipo`, fetchTemporadas, 'Registro creado correctamente.', "Error al crear el registro."
    );

    // Para el segundo formulario de creación
    const { crear: asignarTemporada, isSaving: isSavingAsignacionEquipo } = useCrud(
        `${URL}/user/insertar-equipo-temporada`,
        fetchTemporadas,
        'Equipo asignado correctamente.',
        "Error al asignar el equipo a la vacante."
    );

    const agregarEquipo = async () => {
        if (!formState.nombre_equipo.trim()) {
            toast.error("Completá los campos.");
            return;
        }

        if (formState.nombre_equipo.length < 3) {
            toast.error("Ingrese al menos 3 caracteres.");
            return;
        }

        if (equiposList.some(a => a.nombre === formState.nombre_equipo.trim())) {
            toast.error(`El equipo ya existe en el torneo.`);
            return;
        }

        const data = {
            id_categoria: formState.id_categoria,
            id_edicion: edicionFiltrada.id_edicion,
            nombre: formState.nombre_equipo.trim(),
            id_zona: id_zona,
            vacante: numeroVacante
        };

        await guardarEquipo(data);
        closeEquipoZona();
        resetForm()
    };

    // CREAR
    const { crear: guardarVacantePlayOff, isSaving: isSavingVacantePlayOff } = useCrud(
        `${URL}/admin/guardar-vacante-play-off`, fetchTemporadas, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarPlayOffVacante = async () => {
        // Validar que id_partido_previo no sea nulo o indefinido
        if (!formState.id_partido_previo) {
            toast.error("El ID del partido previo no puede estar vacío.");
            return;
        }
    
        const id_partido_previo = formState.id_partido_previo.split('-')[1];
        const resultado = formState.id_partido_previo ? formState.id_partido_previo.split('-')[0] : null;
    
        if (!resultado) {
            toast.error("El resultado no puede estar vacío.");
            return;
        }
    
        const data = {
            id_partido: partidosZona[0].id_partido,
            id_partido_previo: id_partido_previo,
            resultado: resultado,
            vacante: numeroVacante,
        };

        await guardarVacantePlayOff(data);
        closeAsignarVacantePlayOff();
        resetForm();

        setTriggerFetch(prev => !prev);

    }

    // VACIAR
    const { actualizar: fetchVaciarVacante, isUpdating: isEmptying } = useCrud(
        `${URL}/admin/vaciar-vacante`, fetchTemporadas
    );

    const vaciarVacante = async () => {
        const data = {
            id_zona: formState.id_zona,
            vacante: formState.vacante,
            tipo_zona: formState.tipo_zona,
        };
    
        try {
            await fetchVaciarVacante(data);
            closeAndClearForm(closeVaciarVacante);
    
        } catch (error) {
            console.error('Error al vaciar vacante:', error);
        }
    };

    // ELIMINAR
    const eliminarZona = (id_zona) => {
        openDeleteModal()
        setidEliminar(id_zona)
    }

    const eliminarVacante = (id_zona, vacante) => {

        if (verificarVacante(id_zona, vacante)) {
            toast.error('Debe vaciar la vacante antes de eliminarla');
            return;
        }

        const tipoZona = zonas.find(z => z.id_zona == id_zona).tipo_zona;
        openEliminarVacante()
        setFormState({
            id_zona: id_zona,
            vacante: vacante,
            tipo_zona: tipoZona,
        })
    }

    const { actualizar: deleteVacante, isDeleting: isDeletingVacante } = useCrud(
        `${URL}/admin/eliminar-vacante`, fetchTemporadas
    );

    const eliminarRegistros = async () => {
        const data = {
            id_zona: formState.id_zona,
            vacante: formState.vacante,
            tipo_zona: formState.tipo_zona,
        };
        console.log(data);
        return;
        try {
            await deleteVacante(data);
            closeAndClearForm(closeEliminarVacante);
        } catch (error) {
            console.error("Error eliminando zona:", error);
        }
    };

    useEffect(() => {
        dispatch(fetchEdiciones());
        // dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchZonas());
        dispatch(fetchTemporadas());
        dispatch(fetchFases(id_categoria));

        if (isAsignarEquipoZona) {
            // Cada vez que se abra el modal, resetear el estado a false
            setCrearEquipo(false);
            resetForm()
        }
    }, [isAsignarEquipoZona]);

    const asignarRegistro = async (id_equipo) => {
        // Verificar si el equipo ya está asignado a la vacante
        if (
            equiposTemporada.find(e => e.id_equipo === id_equipo && e.vacante == numeroVacante && e.id_categoria == id_categoria && e.id_zona == id_zona)
        ) {
            toast.error(`El equipo ya pertenece a esta vacante.`);
            return;
        }
    
        const zonaFiltrada = zonas.find(z => z.id_zona == id_zona)
        let data = {}
        
        if (zonaFiltrada.tipo_zona === 'todos-contra-todos') {
            data = {
                id_categoria: formState.id_categoria,
                id_edicion: edicionFiltrada.id_edicion,
                id_equipo: id_equipo,
                id_zona: id_zona,
                vacante: numeroVacante
            };
        } else if (zonaFiltrada.tipo_zona === 'eliminacion-directa') {

            if (partidosZona.length === 0) {
                toast.error("No se encontraron partidos para esta zona.");
                return;
            }

            data = {
                id_categoria: formState.id_categoria,
                id_edicion: edicionFiltrada.id_edicion,
                id_equipo: id_equipo,
                id_zona: id_zona,
                vacante: numeroVacante,
                id_partido: partidosZona[0].id_partido,
            };
        }

        await asignarTemporada(data);
        closeEquipoZona();
        resetForm();
    };

    // Función para manejar la expansión
    const toggleExpandido = (id_zona) => {
        // Si la zona seleccionada ya está expandida, la contraemos; si no, la expandimos.
        setZonaExpandida(zonaExpandida === id_zona ? null : id_zona);
    };

    const manejarCrearEquipo = () => {
        setCrearEquipo(true);
    };

    const insertarNuevaFase = () => {
        const data = {
            id_categoria: id_categoria,
            numero_fase: fases.length + 1,
        };
        insertarFase(data);
        dispatch(fetchFases(id_categoria));

    }

    const agregarVacantePlayOff = async (fase, vacante, id_zona) => {
        if (!vacante) return; // Verificar si vacante es válido antes de continuar
    
        openAsignarVacantePlayOff();
        
        setNumeroVacante(vacante);
        setFaseActual(fase);
    
        const partidosZonaFetch = await getPartidosZona(id_zona, vacante); // Usar `vacante` directamente
        setPartidosZona(partidosZonaFetch);
    };
    
    const obtenerResultadoYEtiquetaVacante = (numeroZona, numeroVacante) => {
        
        const partidosFiltrados = partidosCategoria.filter(partido => partido.id_zona == numeroZona);

        const partidoRelaciondo = partidosFiltrados.find(partido => 
            (partido.vacante_local === numeroVacante || partido.vacante_visita === numeroVacante)
        );
    
        if (!partidoRelaciondo) return <>Vacante<NavLink>Seleccionar equipo</NavLink></>;
    
        // Obtener el resultado del partido previo basado en el local o visita
        const esLocal = partidoRelaciondo.vacante_local === numeroVacante;
        const resultadoPrevio = esLocal ? partidoRelaciondo.res_partido_previo_local : partidoRelaciondo.res_partido_previo_visita;
        const idPartidoPrevio = esLocal ? partidoRelaciondo.id_partido_previo_local : partidoRelaciondo.id_partido_previo_visita;
        const partidoPrevio = partidosCategoria.find(p => p.id_partido == idPartidoPrevio);

        const zonaAnterior = partidoPrevio?.id_zona;
        const zonaFiltrada = zonas.find(z => z.id_zona == zonaAnterior);

        // Determinar quién ganó 
        const resultado = resultadoPrevio === 'G' ? 'Ganador' : resultadoPrevio === 'P' ? 'Perdedor' : null;

        if (!resultado) return <>Vacante<NavLink>Seleccionar equipo</NavLink></>

        // Generar la etiqueta
        const letraFase = String.fromCharCode(64 + zonaFiltrada?.fase);
        const etiqueta = `${letraFase}${partidoPrevio?.vacante_local}-${letraFase}${partidoPrevio?.vacante_visita}`; // C1-C2
    
        return {
            resultado,
            etiqueta,
        };
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
            <CategoriasMenuNav id_categoria={id_categoria} />
            <CategoriaFormatoWrapper>
                {fases.length > 0
                    ? fases.map((fase) => (
                        <div key={`fase-${fase.numero_fase}`}>
                            <FormatoFaseWrapper>
                                <FormatoFaseTitulo>
                                    Fase {fase.numero_fase}
                                    <GoKebabHorizontal style={{ transform: 'rotate(90deg)' }} />
                                </FormatoFaseTitulo>
                                <Button bg={'success'} onClick={() => handleSetFaseEstado(fase.numero_fase)}>
                                    Agregar zona
                                </Button>
                                <FormatoZonasWrapper>
                                    {zonas
                                        .filter((z) => z.fase === fase.numero_fase && z.id_categoria == fase.id_categoria)
                                        .map((z) => {
                                            // Primer conteo de vacantes ocupadas basándonos en temporadas
                                            const equiposAsignados = temporadas.filter((t) => t.id_zona === z.id_zona);
                                            let completo = false;
                                            const vacantesOcupadas = contarVacantesOcupadas(z.id_zona);
                                            
                                            completo = parseInt(vacantesOcupadas) === parseInt(z.cantidad_equipos);
                                            return (
                                                <FormatoZonaContainer
                                                    key={z.id_zona}
                                                    className={zonaExpandida === z.id_zona ? '' : 'no-expandido'}>
                                                    <FormatoZona onClick={() => toggleExpandido(z.id_zona)}>
                                                        <LiaAngleDownSolid
                                                            className={zonaExpandida === z.id_zona ? 'icono-rotado' : ''}
                                                        />

                                                        <FormatoZonaInfo>
                                                            <p>
                                                                {z.nombre_etapa}<span> {z.nombre_zona}</span>
                                                            </p>
                                                            {z.tipo_zona === 'todos-contra-todos' && 'Todos contra todos'}
                                                            {z.tipo_zona === 'eliminacion-directa' && 'Eliminacion directa'}

                                                            <span
                                                                className={
                                                                    completo
                                                                        ? 'completo'
                                                                        : 'incompleto'
                                                                }>
                                                                {`${vacantesOcupadas} / ${z.cantidad_equipos} vacantes ocupadas`}
                                                            </span>
                                                        </FormatoZonaInfo>

                                                        <div className='relative' onClick={(e) => e.stopPropagation()}>
                                                            <GoKebabHorizontal className='kebab' />
                                                            <div className='modales'>
                                                                <div
                                                                onClick={() =>openModalUpdate(z)}
                                                                >Editar</div>
                                                                <div
                                                                    onClick={() => eliminarZona(z.id_zona)}
                                                                    className='eliminar'>
                                                                    Eliminar
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormatoZona>

                                                    <FormatoZonaVacantes
                                                        className={zonaExpandida === z.id_zona ? 'expandido' : ''}>
                                                        {[...Array(z.cantidad_equipos)].map((_, index) => {
                                                            const numeroZona = z.id_zona;
                                                            const vacante = index + 1;
                                                            const equipoAsignado = equiposAsignados.find(
                                                                (e) => e.vacante === vacante
                                                            );

                                                            const { resultado, etiqueta } = obtenerResultadoYEtiquetaVacante(numeroZona, vacante);
                                                            const partidoAsignado = partidosCategoria.find(
                                                                (p) => p.id_zona === z.id_zona && (p.vacante_local === vacante || p.vacante_visita === vacante)
                                                            );
                                                                                                                        
                                                            return (
                                                                <VacanteWrapper
                                                                    key={`vacante-${index}`}
                                                                    className={[partidoAsignado ? 'cruce' : '',equipoAsignado ? 'equipo' : '' ].join(' ')}
                                                                    onClick={() => {
                                                                        if (z.tipo_zona === 'todos-contra-todos') {
                                                                            agregarEquipoZona(z.id_zona, vacante);
                                                                        } else {
                                                                            agregarVacantePlayOff(z.fase, vacante, z.id_zona);
                                                                            closeCreateModal(); // Cerrar cualquier otro modal activo
                                                                        }
                                                                    }}>
                                                                    {equipoAsignado ? (
                                                                        <>
                                                                            EQUIPO
                                                                            <VacanteEquipo>
                                                                                <img
                                                                                    src={`${URLImages}${escudosEquipos(
                                                                                        equipoAsignado.id_equipo
                                                                                    )}`}
                                                                                    alt={nombresEquipos(equipoAsignado.id_equipo)}
                                                                                />
                                                                                {nombresEquipos(equipoAsignado.id_equipo)}
                                                                            </VacanteEquipo>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                        {resultado ? (
                                                                            <VacanteEquipo>
                                                                                {resultado} {etiqueta}
                                                                            </VacanteEquipo>
                                                                        ) : (
                                                                            <>
                                                                                Vacante
                                                                                <NavLink>Seleccionar equipo</NavLink>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                    )}
                                                                    <div
                                                                        className={[partidoAsignado ? 'cruce' : '',equipoAsignado ? 'vacante-texto existe' : 'vacante-texto' ].join(' ')}
                                                                    >

                                                                        A{vacante}
                                                                    </div>
                                                                    <div
                                                                        className='relative'
                                                                        onClick={(e) => e.stopPropagation()}>
                                                                        <GoKebabHorizontal className='kebab' />
                                                                        <div className='modales'>
                                                                            <div className='editar' onClick={() => agregarEquipoZona(z.id_zona, vacante, 'update')}>
                                                                                Reemplazar equipo
                                                                            </div>
                                                                            <div
                                                                                onClick={() => openModalVaciarVacante(z.id_zona, vacante)}
                                                                                className='vaciar'>
                                                                                Vaciar vacante
                                                                            </div>
                                                                            <div
                                                                                onClick={() =>eliminarVacante(z.id_zona,vacante)}
                                                                                className='eliminar'>
                                                                                Eliminar vacante
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </VacanteWrapper>
                                                            );
                                                        })}
                                                    </FormatoZonaVacantes>
                                                    
                                                </FormatoZonaContainer>
                                            );
                                        })}
                                </FormatoZonasWrapper>
                            </FormatoFaseWrapper>
                            <FaseDivider />
                        </div>
                    ))
                    : ''}

                <FormatoFaseWrapper>
                    <Button bg={'success'} onClick={insertarNuevaFase}>
                        Agregar fase
                    </Button>
                </FormatoFaseWrapper>
            </CategoriaFormatoWrapper>

            {
                isAsignarVacantePlayOff && <>
                    <ModalCreate
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAsignarVacantePlayOff ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Agregar equipo`}
                        onClickClose={() => closeAndClearForm(closeAsignarVacantePlayOff)}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={() => closeAndClearForm(closeAsignarVacantePlayOff)}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={agregarPlayOffVacante} disabled={isSaving}>
                                    {isSavingCrearEquipo ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Guardando
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
                                        Seleccionar fase
                                        <Select
                                            name='fases_select'
                                            type='text'
                                            placeholder="Seleccionar fase"
                                            value={formState.fases_select}
                                            icon={<BsCalendar2Event className='icon-select' />}
                                            column='numero_fase'
                                            data={fases.filter((f) => f.numero_fase != faseActual)}
                                            id_= {'numero_fase'}
                                            onChange={handleFormChange} />
                                    </ModalFormInputContainer>
                                    <ModalFormInputContainer>
                                        Seleccionar zona
                                        <Select
                                            name='zonas_select'
                                            type='text'
                                            placeholder="Seleccionar zona"
                                            value={formState.zonas_select}
                                            icon={<BsCalendar2Event className='icon-select' />}
                                            column='nombre_zona_etapa'
                                            data={zonas.filter((z) => z.fase == formState.fases_select && z.id_categoria == id_categoria)}
                                            id_= {'id_zona'}
                                            disabled={!formState.fases_select}
                                            onChange={handleFormChange} />
                                    </ModalFormInputContainer>
                                    <ModalFormInputContainer>
                                        Seleccionar resultado
                                        <Select
                                            name='id_partido_previo'
                                            type='text'
                                            placeholder="Seleccionar resultado"
                                            value={formState.id_partido_previo}
                                            icon={<BsCalendar2Event className='icon-select' />}
                                            column='nombre_fase'
                                            data={loadingIdPartidos ? [] : idPartidosZona}
                                            id_= {'id_partido'}
                                            disabled={!formState.zonas_select || loadingIdPartidos}
                                            onChange={handleFormChange} />
                                    </ModalFormInputContainer>
                                </>
                        }
                    />
                    <Overlay onClick={() => closeAndClearForm(closeAsignarVacantePlayOff)} />
                </>
            }
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Agregar zona`}
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
                                            Guardando
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
                                        name='nombre_zona'
                                        type='text'
                                        placeholder="Nombre"
                                        icon={<BsCalendar2Event className='icon-input' />}
                                        value={formState.nombre_zona}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    categoría
                                    <Select
                                        name={'tipo_zona'}
                                        data={[
                                            {
                                                id_tipo_zona: 'eliminacion-directa',
                                                tipo_zona: "Eliminación Directa"
                                            },
                                            {
                                                id_tipo_zona: 'eliminacion-directa-ida-vuelta',
                                                tipo_zona: "Eliminación Directa (Ida y Vuelta)"
                                            },
                                            {
                                                id_tipo_zona: 'todos-contra-todos',
                                                tipo_zona: "Todos Contra Todos"
                                            },
                                            {
                                                id_tipo_zona: 'todos-contra-todos-ida-vuelta',
                                                tipo_zona: "Todos Contra Todos (Ida y Vuelta)"
                                            },
                                        ]}
                                        icon={<IoShieldHalf className='icon-select' />}
                                        id_={"id_tipo_zona"}
                                        column='tipo_zona'
                                        value={formState.tipo_zona}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Etapa
                                    <Select
                                        name={'etapa'}
                                        data={etapas}
                                        icon={<IoShieldHalf className='icon-select' />}
                                        id_={"id_etapa"}
                                        column='nombre'
                                        value={formState.etapa}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    cantidad de equipos
                                    <Input
                                        name='cantidad_equipos'
                                        type='number'
                                        placeholder="Cantidad de equipos"
                                        icon={<BsCalendar2Event className='icon-input' />}
                                        value={formState.cantidad_equipos}
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
                isAsignarEquipoZona && <>
                    <ModalCreate
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAsignarEquipoZona ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Agregar equipo`}
                        onClickClose={closeEquipoZona}
                        buttons={
                            crearEquipo && <>
                                <Button color={"danger"} onClick={closeEquipoZona}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={agregarEquipo} disabled={isSaving}>
                                    {isSavingCrearEquipo ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Guardando
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
                            !crearEquipo ?
                                <>
                                    <ModalFormInputContainer>
                                        nombre
                                        <Input
                                            name='nombre_equipo'
                                            type='text'
                                            placeholder="Nombre"
                                            icon={<BsCalendar2Event className='icon-input' />}
                                            value={formState.nombre_equipo}
                                            onChange={handleFormChange} />
                                        <p style={{ color: '#a8a8a8', textTransform: 'uppercase' }}>ingresar al menos 3 caracateres</p>
                                    </ModalFormInputContainer>
                                </>
                                : <ModalFormInputContainer>
                                    nombre
                                    <Input
                                        name='nombre_equipo'
                                        type='text'
                                        placeholder="Nombre"
                                        icon={<BsCalendar2Event className='icon-input' />}
                                        value={formState.nombre_equipo}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                        }
                        texto={
                            !crearEquipo &&
                                formState.nombre_equipo.length >= 3 ? (
                                equiposList.find((e) =>
                                    e.nombre.toLowerCase().includes(formState.nombre_equipo.trim().toLowerCase())
                                )
                                    ?
                                    <EquipoExiste>
                                        <h2>Equipos en tu torneo</h2>
                                        <EquipoExisteLista>
                                            {
                                                equiposList
                                                    .filter((e) =>
                                                        e.nombre.toLowerCase().includes(formState.nombre_equipo.trim().toLowerCase())
                                                    )
                                                    .map((e) => (
                                                        <EquipoExisteItem key={e.id_equipo}>
                                                            <EquipoExisteEscudo>
                                                                <img src={`${URLImages}${escudosEquipos(e.id_equipo)}`} alt={nombresEquipos(e.id_equipo)} />
                                                                {e.nombre}
                                                            </EquipoExisteEscudo>
                                                            <Button color={'success'} onClick={() => asignarRegistro(e.id_equipo)}>
                                                                Seleccionar
                                                            </Button>
                                                        </EquipoExisteItem>
                                                    ))
                                            }
                                        </EquipoExisteLista>
                                        <EquipoExisteDivider />
                                        <EquipoNoExiste>
                                            <p>¿No encuentras el equipo?</p>
                                            <Button bg={'success'} onClick={manejarCrearEquipo}>
                                                Crear equipo
                                            </Button>
                                        </EquipoNoExiste>
                                    </EquipoExiste>
                                    :
                                    <EquipoNoExiste>
                                        <p>Parece que no tienes ningún equipo llamado "<span>{formState.nombre_equipo}</span>",
                                            pero puedes crearlo</p>
                                        <Button bg={'success'} onClick={manejarCrearEquipo}>
                                            Crear equipo
                                        </Button>
                                    </EquipoNoExiste>
                            ) :
                                equiposTemporada
                                    .filter((e) =>
                                        e.id_zona === null
                                    ).length > 0
                                &&
                                <>
                                    <EquipoExisteDivider />
                                    <EquipoExiste>
                                        <h2>Sugerencias</h2>
                                        <EquipoExisteLista>
                                            {
                                                equiposTemporada
                                                    .filter((e) =>
                                                        e.id_categoria == id_categoria &&
                                                        e.id_zona === null
                                                    )
                                                    .map((e) => (
                                                        <EquipoExisteItem key={e.id_equipo}>
                                                            <EquipoExisteEscudo>
                                                                <img src={`${URLImages}${escudosEquipos(e.id_equipo)}`} alt={nombresEquipos(e.id_equipo)} />
                                                                {nombresEquipos(e.id_equipo)}
                                                            </EquipoExisteEscudo>
                                                            <Button color={'success'} onClick={() => asignarRegistro(e.id_equipo)}>
                                                                Seleccionar
                                                            </Button>
                                                        </EquipoExisteItem>
                                                    ))
                                            }
                                        </EquipoExisteLista>
                                    </EquipoExiste>
                                </>
                        }
                    />
                    <Overlay onClick={closeEquipoZona} />
                </>
            }
            {
                isDeleteModalOpen && (
                    <>
                        <ModalDelete
                            text={
                                `¿Estas seguro que quieres eliminar la fase?`}
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
                                        {isDeletingVacante ? (
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
                        <Overlay onClick={closeDeleteModal} />
                    </>

                )
            }
            {
                isVaciarVacante && (
                    <>
                        <ModalDelete
                            text={
                                `¿Estas seguro que quieres vaciar la vacante?`}
                            animate={{ opacity: isVaciarVacante ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={() => closeAndClearForm(closeVaciarVacante)}
                            buttons={
                                <>
                                    <Button color={"danger"} onClick={() => closeAndClearForm(closeVaciarVacante)}>
                                        <IoClose />
                                        No
                                    </Button>
                                    <Button color={"success"} onClick={vaciarVacante} disabled={''}>
                                        {isEmptying ? (
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
                        <Overlay onClick={() => closeAndClearForm(closeVaciarVacante)} />
                    </>

                )
            }
            {
                isEliminarVacante && (
                    <>
                        <ModalDelete
                            text={
                                `¿Estas seguro que quieres eliminar la vacante?`}
                            animate={{ opacity: isEliminarVacante ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={() => closeAndClearForm(closeEliminarVacante)}
                            buttons={
                                <>
                                    <Button color={"danger"} onClick={() => closeAndClearForm(closeEliminarVacante)}>
                                        <IoClose />
                                        No
                                    </Button>
                                    <Button color={"success"} onClick={eliminarRegistros} disabled={''}>
                                        {isDeletingVacante ? (
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
                        <Overlay onClick={() => closeAndClearForm(closeEliminarVacante)} />
                    </>

                )
            }
            {
                isUpdateModalOpen && ( 
                <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Editar zona`}
                        onClickClose={closeUpdateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeUpdateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={actualizarRegistro} disabled={isSaving || !isValid}>
                                    {isSaving ? (
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
                                    nombre
                                    <Input
                                        name='nombre_zona'
                                        type='text'
                                        placeholder="Nombre"
                                        icon={<BsCalendar2Event className='icon-input' />}
                                        value={formState.nombre_zona}
                                        onChange={handleFormChangeWithValidation}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    categoría
                                    <Select
                                        name={'tipo_zona'}
                                        data={[
                                            {
                                                id_tipo_zona: 'eliminacion-directa',
                                                tipo_zona: "Eliminación Directa"
                                            },
                                            {
                                                id_tipo_zona: 'eliminacion-directa-ida-vuelta',
                                                tipo_zona: "Eliminación Directa (Ida y Vuelta)"
                                            },
                                            {
                                                id_tipo_zona: 'todos-contra-todos',
                                                tipo_zona: "Todos Contra Todos"
                                            },
                                            {
                                                id_tipo_zona: 'todos-contra-todos-ida-vuelta',
                                                tipo_zona: "Todos Contra Todos (Ida y Vuelta)"
                                            },
                                        ]}
                                        icon={<IoShieldHalf className='icon-select' />}
                                        id_={"id_tipo_zona"}
                                        column='tipo_zona'
                                        value={formState.tipo_zona}
                                        onChange={handleFormChangeWithValidation}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Etapa
                                    <Select
                                        name={'etapa'}
                                        data={etapas}
                                        icon={<IoShieldHalf className='icon-select' />}
                                        id_={"id_etapa"}
                                        column='nombre'
                                        value={formState.etapa}
                                        onChange={handleFormChangeWithValidation}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    cantidad de equipos
                                    <Input
                                        name='cantidad_equipos'
                                        type='number'
                                        placeholder="Cantidad de equipos"
                                        icon={<BsCalendar2Event className='icon-input' />}
                                        value={formState.cantidad_equipos}
                                        onChange={handleFormChangeWithValidation}
                                    />
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeUpdateModal} />
                </>
                )
            }
        </Content>
    );
};

export default CategoriasFormato;
