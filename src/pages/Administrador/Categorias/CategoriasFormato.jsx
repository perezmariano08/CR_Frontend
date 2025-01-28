
import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
import { ContentNavWrapper, ContentTitle, MenuContentTop } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { URL, URLImages } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';
import { LiaAngleDownSolid } from "react-icons/lia";
import { GoKebabHorizontal } from "react-icons/go";
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import CategoriasMenuNav from './CategoriasMenuNav';
import { CategoriaFormatoWrapper, EquipoExiste, EquipoExisteDivider, EquipoExisteEscudo, EquipoExisteItem, EquipoExisteLista, EquipoNoExiste, FaseDivider, FormatoFaseTitulo, FormatoFaseWrapper, FormatoZona, FormatoZonaContainer, FormatoZonaInfo, FormatoZonasWrapper, FormatoZonaVacantes, VacanteEquipo, VacanteWrapper } from './categoriasStyles';
import { useEquipos } from '../../../hooks/useEquipos';
import { fetchFases } from '../../../redux/ServicesApi/fasesSlice';
import { checkEquipoPlantel, getEtapas, getIdPartidosZona, getPartidosCategoria, getPartidosZona, insertarFase } from '../../../utils/dataFetchers';
import useFetchData from './useFetchData';
import Switch from '../../../components/UI/Switch/Switch';

const CategoriasFormato = () => {
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const equiposList = useSelector((state) => state.equipos.data);
    const zonas = useSelector((state) => state.zonas.data);
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
        posicion_previa: null,
        etapa: null,
        vacante: null,
        id_edicion: edicionFiltrada.id_edicion,
        terminada: 'N',
        campeon: 'N',
        equipo_campeon: null,
    });

    //Modales
    const [isAsignarEquipoZona, setAsignarEquipoZona] = useState(false);
    const [isAsignarVacantePlayOff, setAsignarVacantePlayOff] = useState(false);
    const [isEliminarVacante, setEliminarVacante] = useState(false);
    const [isVaciarVacante, setVaciarVacante] = useState(false);
    const [isCheckPlantel, setCheckPlantel ] = useState(false);
    const [isDeleteFase, setDeleteFase] = useState(false);

    const [numeroVacante, setNumeroVacante] = useState('');
    const [id_zona, setIdZona] = useState('');

    const [zonaExpandida, setZonaExpandida] = useState(null);
    const [crearEquipo, setCrearEquipo] = useState(false);
    // const [vacantePlayOff, setVacantePlayOff] = useState(false);
    const [faseActual, setFaseActual] = useState(null);
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

    const openCheckPlantel = () => setCheckPlantel(true);
    const closeCheckPlantel = () => setCheckPlantel(false);

    const openDeleteFase = () => setDeleteFase(true);
    const closeDeleteFase = () => setDeleteFase(false);

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
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true); // Activar el estado de carga
        dispatch(fetchFases(id_categoria)).finally(() => {
            setLoading(false); // Desactivar el estado de carga cuando finalice la acción
        });
    }, [id_categoria, dispatch]);

    const { data: partidosCategoria, loading: loadingPartidosCategoria, error: errorPartidosCategoria } = useFetchData(
        () => getPartidosCategoria(id_categoria), 
        [id_categoria, triggerFetch]
    );

    const verificarVacante = (id_zona, vacante) => {
        // Verificar en temporadas si existe la vacante
        const vacanteTemporada = temporadas.find((t) => t.id_zona == id_zona && t.vacante == vacante || t.pos_zona_previa);

        if (vacanteTemporada && vacanteTemporada.id_equipo) {
            return true;
        }

        const vacantePosicion = temporadas.find((t) => t.id_zona == id_zona && t.pos_zona_previa);

        if (vacantePosicion) {
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
        `${URL}/admin/actualizar-zona`, [fetchZonas, fetchTemporadas], 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const openModalUpdate = (zona) => {
        const etapaEncontrada = etapas.find(e => e.id_etapa == zona.id_etapa);

        const zonaDefault = {
            id_zona: zona.id_zona,
            nombre_zona: zona.nombre_zona,
            tipo_zona: zona.tipo_zona,
            etapa: etapaEncontrada.id_etapa,
            cantidad_equipos: zona.cantidad_equipos,
            campeon: zona.campeon !== 'N' ? 'S' : 'N',
            equipo_campeon: zona.id_equipo_campeon,
            terminada: zona.terminada,
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
            formState.etapa == initialZona.etapa &&
            formState.campeon == initialZona.campeon &&
            formState.equipo_campeon == null &&
            formState.terminada == initialZona.terminada
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
        const cantidadEquiposTemporada = temporadas.filter((t) => t.id_zona == zonaId && t.id_equipo != null).length;
    
        // Usamos un Set para evitar contar duplicados
        const partidosContados = new Set();
    
        const cantidadEquiposPartidos = partidosCategoria.reduce((count, partido) => {
            if (partido.id_zona === zonaId) {
                // Si el partido tiene un id_partido_previo_local o id_partido_previo_visita no duplicado
                if (partido.id_partido_previo_local && !partidosContados.has(partido.id_partido_previo_local)) {
                    partidosContados.add(partido.id_partido_previo_local);  // Marcamos como contado
                    count += 1;
                }
                if (partido.id_partido_previo_visita && !partidosContados.has(partido.id_partido_previo_visita)) {
                    partidosContados.add(partido.id_partido_previo_visita);  // Marcamos como contado
                    count += 1;
                }
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

        if (
            (formState.tipo_zona === 'eliminacion-directa' || formState.tipo_zona === 'eliminacion-directa-ida-vuelta') &&
            parseInt(formState.cantidad_equipos) % 2 !== 0
        ) {
            toast.error("En zonas de eliminación directa o eliminación directa ida y vuelta el número de equipos debe ser par.");
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

        if (
            (formState.tipo_zona === 'eliminacion-directa' || formState.tipo_zona === 'eliminacion-directa-ida-vuelta') &&
            parseInt(formState.cantidad_equipos) % 2 !== 0
        ) {
            toast.error("El número de equipos debe ser par.");
            return;
        }
        
        const data = {
            id_zona: formState.id_zona,
            nombre_zona: formState.nombre_zona,
            tipo_zona: formState.tipo_zona,
            etapa: formState.etapa,
            cantidad_equipos: formState.cantidad_equipos,
            tipo: tipoActualizacion,
            campeon: formState.campeon,
            id_equipo_campeon: formState.campeon === 'N' ? null : formState.equipo_campeon,
            terminada: formState.terminada,
        };
        
        await actualizar(data);
        closeUpdateModal();
        resetForm();
    };

    // CREAR
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-zona-vacantes-partidos`, fetchZonas
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

        if (
            (formState.tipo_zona === 'eliminacion-directa' || formState.tipo_zona === 'eliminacion-directa-ida-vuelta') &&
            parseInt(formState.cantidad_equipos) % 2 !== 0
        ) {
            toast.error("El número de equipos debe ser par");
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
            campeon: formState.campeon
        };

        await crear(data);
        closeCreateModal();
        resetForm()
    };

    // CREAR
    const { crear: guardarEquipo, isSaving: isSavingCrearEquipo } = useCrud(
        `${URL}/user/crear-equipo`, fetchTemporadas
    );

    // Para el segundo formulario de creación
    const { crear: asignarTemporada, isSaving: isSavingAsignacionEquipo } = useCrud(
        `${URL}/user/insertar-equipo-temporada`,
        fetchTemporadas
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
        `${URL}/admin/guardar-vacante-play-off`, fetchTemporadas
    );

    const agregarPlayOffVacante = async () => {
        let data;
    
        // Caso 1: Si `posicion_previa` es true
        if (formState.posicion_previa) {
            data = {
                id_categoria: id_categoria,
                id_edicion: formState.id_edicion,
                id_zona: formState.id_zona,
                id_zona_previa: formState.zonas_select,
                posicion_previa: formState.posicion_previa,
                vacante: numeroVacante,
            };
        } else {
            // Validar que `id_partido_previo` no esté vacío
            if (!formState.id_partido_previo) {
                toast.error("El ID del partido previo no puede estar vacío.");
                return;
            }
    
            // Extraer `id_partido_previo` y `resultado`
            const id_partido_previo = formState.id_partido_previo.split('-')[1];
            const resultado = formState.id_partido_previo.split('-')[0];
    
            // Validar que `resultado` no esté vacío
            if (!resultado) {
                toast.error("El resultado no puede estar vacío.");
                return;
            }
    
            // Caso 2: Si `posicion_previa` no es true pero `id_partido_previo` es válido
            data = {
                id_partido: partidosZona[0].id_partido,
                id_partido_previo: id_partido_previo,
                resultado: resultado,
                vacante: numeroVacante,
            };
        }
    
        console.log(data);
        
        // Simular guardar los datos (descomenta estas líneas para ejecutar la lógica real)
        await guardarVacantePlayOff(data);
        closeAsignarVacantePlayOff();
        resetForm();
        
        // Trigger para actualizar la vista
        setTriggerFetch((prev) => !prev);
    };
    
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
            window.location.reload();
    
        } catch (error) {
            console.error('Error al vaciar vacante:', error);
        }
    };

    // ELIMINAR VACANTE
    const { eliminarPorData , isDeleting: isDeletingVacante} = useCrud(
        `${URL}/admin/eliminar-zona`, fetchZonas
    );

    // ELIMINAR
    const eliminarZona = (id_zona) => {
        const partidosVacante = contarVacantesOcupadas(id_zona)

        const idPartidoAsociado = partidosCategoria.filter((partido) => {
            const idPartidoPrevioLocal = partido.id_partido_previo_local;
            const idPartidoPrevioVisita = partido.id_partido_previo_visita;
    
            return (
                (idPartidoPrevioLocal && partidosCategoria.some(p => p.id_partido === idPartidoPrevioLocal && p.id_zona === id_zona)) ||
                (idPartidoPrevioVisita && partidosCategoria.some(p => p.id_partido === idPartidoPrevioVisita && p.id_zona === id_zona))
            );
        });
    
        if (!id_zona) {
            toast.error('Falta el ID de la zona');
            return;
        }

        if (partidosVacante > 0) {
            toast.error('Debe vaciar las vacantes de la zona antes de eliminarla');
            return;
        }

        if (idPartidoAsociado.length > 0) {
            toast.error('No se puede eliminar la zona porque tiene partidos asociados');
            return;
        }

        openDeleteModal()
        setFormState({
            ...formState,
            id_zona: id_zona
        })
    }

    const { eliminarPorId , isDeleting} = useCrud(
        `${URL}/admin/eliminar-zona`, fetchZonas
    );

    const eliminarRegistros = async () => {
        const id_zona = formState.id_zona;

        try {
            await eliminarPorId(id_zona);
            closeAndClearForm(closeDeleteModal);
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

        if (isAsignarEquipoZona) {
            // Cada vez que se abra el modal, resetear el estado a false
            setCrearEquipo(false);
            resetForm()
        }
    }, [isAsignarEquipoZona]);

    // Agregar equipo a la vacante
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
        } else if (zonaFiltrada.tipo_zona === 'eliminacion-directa' || zonaFiltrada.tipo_zona === 'eliminacion-directa-ida-vuelta') {

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
        await checkTeamToAddPlantel(id_equipo, edicionFiltrada.id_edicion);
    };

    // Función para manejar la expansión
    const toggleExpandido = (id_zona) => {
        // Si la zona seleccionada ya está expandida, la contraemos; si no, la expandimos.
        setZonaExpandida(zonaExpandida === id_zona ? null : id_zona);
    };

    const manejarCrearEquipo = () => {
        setCrearEquipo(true);
    };

    const insertarNuevaFase = async () => {
        const data = {
            id_categoria: id_categoria,
            numero_fase: fases.length + 1,
        };
        await insertarFase(data);
        dispatch(fetchFases(id_categoria));
    }

    const agregarVacantePlayOff = async (fase, vacante, id_zona) => {
        if (!vacante) return; // Verificar si vacante es válido antes de continuar
    
        openAsignarVacantePlayOff();
        
        setNumeroVacante(vacante);
        setFaseActual(fase);

        setFormState((prevState) => ({
            ...prevState,
            id_zona: id_zona,
        }))
    
        const partidosZonaFetch = await getPartidosZona(id_zona, vacante); // Usar `vacante` directamente
        setPartidosZona(partidosZonaFetch);
    };
    
    const obtenerResultadoYEtiquetaVacante = (numeroZona, numeroVacante) => {
        const partidosFiltrados = partidosCategoria.filter(partido => partido.id_zona == numeroZona);
    
        const partidoRelaciondo = partidosFiltrados.find(partido => 
            partido.vacante_local === numeroVacante || partido.vacante_visita === numeroVacante
        );
    
        // Inicializar valores predeterminados
        let resultado = null;
        let etiqueta = null;
        let etiquetaPos = null;
    
        if (partidoRelaciondo) {
            const esLocal = partidoRelaciondo.vacante_local === numeroVacante;
            const resultadoPrevio = esLocal ? partidoRelaciondo.res_partido_previo_local : partidoRelaciondo.res_partido_previo_visita;
            const idPartidoPrevio = esLocal ? partidoRelaciondo.id_partido_previo_local : partidoRelaciondo.id_partido_previo_visita;
            const partidoPrevio = partidosCategoria.find(p => p.id_partido == idPartidoPrevio);
    
            const zonaAnterior = partidoPrevio?.id_zona;
            const zonaFiltrada = zonas.find(z => z.id_zona == zonaAnterior);
    
            // Determinar el resultado
            resultado = resultadoPrevio === 'G' ? 'Ganador' : resultadoPrevio === 'P' ? 'Perdedor' : null;
    
            if (resultado) {
                const letraFase = String.fromCharCode(64 + zonaFiltrada?.fase);
                etiqueta = `${letraFase}${partidoPrevio?.vacante_local}-${letraFase}${partidoPrevio?.vacante_visita}`;
            }
        }
    
        // Calcular la etiqueta de posición si es posible
        const posicionesTemporadas = temporadas.filter((t) => 
            t.id_zona == numeroZona && 
            t.id_categoria == id_categoria && 
            t.id_edicion == edicionFiltrada.id_edicion && 
            t.pos_zona_previa
        );
    
        const posicion = posicionesTemporadas.find((p) => p.vacante == numeroVacante);
        const nombreZona = zonas.find((z) => z.id_zona == posicion?.id_zona_previa)?.nombre_zona;
        etiquetaPos = posicion ? `Posicion ${posicion.pos_zona_previa} - ${nombreZona}` : null;

        // console.log("EtiquetaPos:", temporadas);

        // Retornar todos los valores calculados
        return {
            resultado,
            etiqueta,
            etiquetaPos
        };
    };
    
    const [dataEquipo, setDataEquipo] = useState([]);

    const checkTeamToAddPlantel = async (id_equipo, id_edicion) => {
        try {
            const response = await checkEquipoPlantel(id_equipo, id_edicion);
    
            if (!response || response.data === undefined) {
                console.error("Error en la consulta:", response?.mensaje || "Error desconocido");
                return;
            }
    
            if (response.data.length === 0) {
                return;
            }
    
            // Si hay datos, abre el check para el plantel
            const data = response.data.map((r) => {
                return {
                    id_equipo: id_equipo,
                    id_categoria: parseInt(id_categoria),
                    id_categoria_previo: r.id_categoria,
                    id_edicion: r.id_edicion,
                    nombre_edicion: r.nombre_edicion,
                    jugadores: r.total_jugadores,
                }
            });

            setDataEquipo(data)
            openCheckPlantel();
        } catch (error) {
            console.error("Error al verificar el plantel:", error);
        }
    };
    
    // CREAR
    const { crear: asignar, isSaving: asignando } = useCrud(
        `${URL}/admin/copiar-planteles-temporada`
    );
    
    const asignarPlantel = async (dataEquipo) => {

        const {id_equipo, id_categoria_previo, id_categoria} = dataEquipo;
        const id_edicion = edicionFiltrada.id_edicion;

        if (!id_equipo || !id_categoria_previo || !id_categoria || !id_edicion) {
            toast.error("Faltan datos importantes");
            return;
        }

        const data = {
            id_equipo: id_equipo,
            id_categoria_previo: id_categoria_previo,
            id_categoria: id_categoria,
            id_edicion: id_edicion,
        };

        asignar(data);
        closeCheckPlantel();
        resetForm();
    }

    // ELIMINAR FASE
    const { eliminarPorId: deleteFase, isDeleting: isDeletingFase} = useCrud(
        `${URL}/admin/eliminar-fase`, fetchCategorias
    );

    const setEliminarFase = (numero_fase) => {
        const isZonasinFase = zonas.some((z) => z.id_categoria == id_categoria && z.fase == numero_fase)

        if (!id_categoria || !numero_fase) {
            toast.error('Error al eliminar la fase');
            return;
        }

        if (isZonasinFase) {
            toast.error('Debes eliminar las zonas asociadas a esta fase antes de eliminarla');
            return;
        }

        setFormState({
            ...formState,
            fase: numero_fase
        })

        openDeleteFase();

    }

    const eliminarFase = async () => {

        if (!id_categoria || !formState.fase) {
            toast.error('Error al eliminar la fase');
            return;
        }

        const data = {
            id_categoria: id_categoria,
            numero_fase: formState.fase
        }
        
        await deleteFase(data);
        resetForm();
        closeDeleteFase();
        dispatch(fetchFases(id_categoria));

    }

    const filtrarEquiposZona = (id_zona) => {
        const equiposData = [{
            nombre: 'Seleccione un equipo',
            id_equipo: null,
        }];
        const equiposTemporada = temporadas.filter((t) => t.id_equipo != null && t.id_zona == id_zona);

        equiposTemporada.forEach((e) => {
            const equipo = equiposList.find((eq) => eq.id_equipo == e.id_equipo);
            if (equipo) {
                equiposData.push({
                    id_equipo: e.id_equipo,
                    nombre: equipo.nombre,
                });
            }
        })
        return equiposData;
    }
    
    const zonaFiltrada = zonas.find((z) => z.id_zona == formState.zonas_select)
    const equiposZona = Array.from({ length: temporadas.filter((e) => e.id_zona == formState.zonas_select).length }, (_, i) => i + 1);

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
                { !loading && fases.length > 0 ? (
                    fases.map((fase) => (
                        <div key={`fase-${fase.numero_fase}`}>
                            <FormatoFaseWrapper>
                                <FormatoFaseTitulo>
                                    Fase {fase.numero_fase}
                                    <div className='relative' onClick={(e) => e.stopPropagation()}>
                                        <GoKebabHorizontal className='kebab' />
                                        <div className='modales'>
                                            <div
                                                onClick={() => setEliminarFase(fase.numero_fase)}
                                                className='eliminar'>
                                                Eliminar
                                            </div>
                                        </div>
                                    </div>
                                </FormatoFaseTitulo>
                                <Button bg={'success'} onClick={() => handleSetFaseEstado(fase.numero_fase)}>
                                    Agregar zona
                                </Button>
                                <FormatoZonasWrapper>
                                    {zonas
                                        .filter((z) => z.fase === fase.numero_fase && z.id_categoria == fase.id_categoria)
                                        .map((z) => {
                                            // Primer conteo de vacantes ocupadas basándonos en temporadas
                                            const equiposAsignados = temporadas.filter((t) => t.id_zona === z.id_zona && t.id_equipo);
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
                                                            {z.tipo_zona === 'eliminacion-directa-ida-vuelta' && 'Eliminacion directa (Ida y Vuelta)'}

                                                            <span
                                                                className={
                                                                    completo
                                                                        ? 'completo'
                                                                        : 'incompleto'
                                                                }>
                                                                {`${vacantesOcupadas} / ${z.cantidad_equipos} vacantes ocupadas`}
                                                            </span>
                                                            {
                                                                z.tipo_zona === 'todos-contra-todos' && (
                                                                    <span
                                                                        className={
                                                                            z.terminada === 'S'
                                                                            ? 'completo'
                                                                            : 'sin-terminar'
                                                                        }
                                                                    >
                                                                        {
                                                                            z.terminada === 'N' ? (
                                                                                `Zona sin terminar`
                                                                            ) : (
                                                                                `Zona terminada`
                                                                            )
                                                                        }
                                                                    </span>
                                                                )
                                                            }
                                                            <span
                                                                className={
                                                                    z.id_equipo_campeon
                                                                    ? 'campeon'
                                                                    : 'sin-campeon'
                                                                }
                                                            >
                                                                {
                                                                    z.campeon === 'S' && (
                                                                        `Campeón: ${z.id_equipo_campeon ? nombresEquipos(z.id_equipo_campeon) : 'Sin definir'}`
                                                                    )
                                                                }
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

                                                        const { resultado, etiqueta, etiquetaPos } = obtenerResultadoYEtiquetaVacante(numeroZona, vacante);

                                                        const partidoAsignado = partidosCategoria.find((p) => {
                                                            if (vacante === p.vacante_local) {
                                                                return p.id_zona === z.id_zona && p.id_partido_previo_local !== null;
                                                            } else if (vacante === p.vacante_visita) {
                                                                return p.id_zona === z.id_zona && p.id_partido_previo_visita !== null;
                                                            }
                                                            return false;
                                                        });

                                                        return (
                                                                <VacanteWrapper
                                                                    key={`vacante-${index}`}
                                                                    className={[partidoAsignado ? 'cruce' : '', equipoAsignado ? 'equipo' : '', etiquetaPos ? 'posicion' : ''].join(' ')}
                                                                    onClick={() => {
                                                                        if (z.tipo_zona === 'todos-contra-todos') {
                                                                            agregarEquipoZona(z.id_zona, vacante);
                                                                        } else {
                                                                            agregarVacantePlayOff(z.fase, vacante, z.id_zona);
                                                                            closeCreateModal();
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
                                                                            {etiquetaPos ? ( 
                                                                                <VacanteEquipo>
                                                                                    {etiquetaPos}
                                                                                </VacanteEquipo>
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
                                                                        </>
                                                                    )}
                                                                    <div
                                                                        className={[partidoAsignado ? 'cruce' : '', equipoAsignado ? 'vacante-texto existe' : 'vacante-texto', etiquetaPos ? 'posicion' : ''].join(' ')}
                                                                    >
                                                                        {vacante}
                                                                    </div>
                                                                    <div
                                                                        className='relative'
                                                                        onClick={(e) => e.stopPropagation()}>
                                                                        <GoKebabHorizontal className='kebab' />
                                                                        <div className='modales'>
                                                                            <div className='editar' onClick={() => agregarEquipoZona(z.id_zona, vacante, 'update')}>
                                                                                Reemplazar equipo
                                                                            </div>
                                                                            {
                                                                                (partidoAsignado || equipoAsignado || etiquetaPos) && (
                                                                                    <div
                                                                                        onClick={() => openModalVaciarVacante(z.id_zona, vacante)}
                                                                                        className='vaciar'>
                                                                                        Vaciar vacante
                                                                                    </div>                                                              
                                                                                )
                                                                            }
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
                ) : (
                    ''
                )}

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
                                <Button color={"success"} onClick={agregarPlayOffVacante} disabled={isSavingVacantePlayOff}>
                                    {isSavingVacantePlayOff ? (
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
                                    {
                                        zonaFiltrada && zonaFiltrada.tipo_zona === 'todos-contra-todos' ? (
                                        <ModalFormInputContainer>
                                            Seleccionar posición
                                            <Select
                                                name="posicion_previa"
                                                type="text"
                                                placeholder="Seleccionar posición"
                                                value={formState.posicion_previa}
                                                icon={<BsCalendar2Event className="icon-select" />}
                                                column="posicion_previa"
                                                data={
                                                    equiposZona.map((pos) => ({
                                                        posicion_previa: pos,
                                                        nombre_fase: `Posición ${pos}`
                                                    }))
                                                }
                                                id_="posicion_previa"
                                                disabled={!formState.zonas_select || loadingIdPartidos}
                                                onChange={handleFormChange}
                                            />
                                        </ModalFormInputContainer>
                                        ) : (
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
                                        )
                                    }
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
                                            // {
                                            //     id_tipo_zona: 'eliminacion-directa-ida-vuelta',
                                            //     tipo_zona: "Eliminación Directa (Ida y Vuelta)"
                                            // },
                                            {
                                                id_tipo_zona: 'todos-contra-todos',
                                                tipo_zona: "Todos Contra Todos"
                                            },
                                            // {
                                            //     id_tipo_zona: 'todos-contra-todos-ida-vuelta',
                                            //     tipo_zona: "Todos Contra Todos (Ida y Vuelta)"
                                            // },
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
                                    ¿La zona tendrá campeon?
                                    <Switch
                                        isChecked={formState.campeon === 'S'}
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'campeon', value: e.target.checked ? 'S' : 'N' }
                                        })}
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
                                                            {isSavingAsignacionEquipo ? (
                                                                <>
                                                                    <LoaderIcon size="small" color='green' />
                                                                    Agregando
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <IoCheckmark />
                                                                    Seleccionar
                                                                </>
                                                            )}
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
                                `¿Estas seguro que quieres eliminar la zona? Esta acción eliminara tambien todos los partidos asociados a esta zona.`}
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
                                <Button color={"success"} onClick={actualizarRegistro} disabled={isUpdating || !isValid}>
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
                                            // {
                                            //     id_tipo_zona: 'eliminacion-directa-ida-vuelta',
                                            //     tipo_zona: "Eliminación Directa (Ida y Vuelta)"
                                            // },
                                            {
                                                id_tipo_zona: 'todos-contra-todos',
                                                tipo_zona: "Todos Contra Todos"
                                            },
                                            // {
                                            //     id_tipo_zona: 'todos-contra-todos-ida-vuelta',
                                            //     tipo_zona: "Todos Contra Todos (Ida y Vuelta)"
                                            // },
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
                                    ¿La zona tendrá campeón?
                                    <Switch
                                        isChecked={formState.campeon !== 'N'}
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'campeon', value: e.target.checked ? 'S' : 'N' }
                                        })}
                                    />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Zona finalizada
                                    <Switch
                                        isChecked={formState.terminada === 'S'}
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'terminada', value: e.target.checked ? 'S' : 'N' }
                                        })}
                                    />
                                </ModalFormInputContainer>
                                {
                                    formState.campeon === 'S' && (
                                        <ModalFormInputContainer>
                                            Seleccione un campeón
                                            <Select
                                                name={'equipo_campeon'}
                                                data={filtrarEquiposZona(formState.id_zona)}
                                                icon={<IoShieldHalf className='icon-select' />}
                                                id_={"id_equipo"}
                                                column='nombre'
                                                value={formState.equipo_campeon}
                                                onChange={handleFormChangeWithValidation}
                                            />
                                        </ModalFormInputContainer>
                                    )
                                }
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
            {
                isCheckPlantel && ( 
                    <>
                        <ModalCreate initial={{ opacity: 0 }}
                            animate={{ opacity: isCheckPlantel ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            title={`Asignar plantel`}
                            onClickClose={() => closeAndClearForm(closeCheckPlantel)}
                            buttons={
                                <Button color={"danger"} onClick={() => closeAndClearForm(closeCheckPlantel)}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                            }
                            texto={
                                <>
                                    <p>Hemos detectado que el equipo ya tiene un plantel en el torneo. ¿Quieres agregarlo?</p>
                                    {
                                        dataEquipo.length > 0 && (
                                            <>
                                                {dataEquipo.map((d) => (
                                                    <>
                                                        <EquipoExisteItem key={d.id_edicion}>
                                                            <EquipoExisteEscudo>
                                                                <img src={`${URLImages}${escudosEquipos(dataEquipo[0].id_equipo)}`} alt={nombresEquipos(dataEquipo[0].id_equipo)} />
                                                                <p>Edición: <span>{d.nombre_edicion}</span> <br />Total jugadores: <span>{d.jugadores}</span></p>
                                                            </EquipoExisteEscudo>
                                                            <Button color={'success'} onClick={() => asignarPlantel(d)}>
                                                                {
                                                                    asignando ? (
                                                                        <LoaderIcon size="small" color='green' />
                                                                    ) : (
                                                                        <>
                                                                            <IoCheckmark />
                                                                            Asignar plantel
                                                                        </>
                                                                    )
                                                                }
                                                            </Button>
                                                        </EquipoExisteItem>
                                                    </>
                                                ))}
                                            </>
                                        )
                                    }
                                </>
                            }
                        />
                        <Overlay onClick={() => closeAndClearForm(closeCheckPlantel)} />
                    </>
                )
            }
            {
                isDeleteFase && (
                    <>
                        <ModalDelete
                            text={
                                `¿Estas seguro que quieres eliminar la fase?`}
                            animate={{ opacity: isDeleteFase ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={closeDeleteFase}
                            buttons={
                                <>
                                    <Button color={"danger"} onClick={closeDeleteFase}>
                                        <IoClose />
                                        No
                                    </Button>
                                    <Button color={"success"} onClick={eliminarFase} disabled={''}>
                                        {isDeletingFase ? (
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
        </Content>
    );
};

export default CategoriasFormato;
