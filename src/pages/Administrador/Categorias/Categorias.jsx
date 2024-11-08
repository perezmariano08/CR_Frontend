import React, { useEffect, useRef, useState } from 'react';
import Content from '../../../components/Content/Content';
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoAlert, IoCheckboxSharp, IoShieldHalf, IoTrashOutline } from 'react-icons/io5';
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
import { BsCalendar2Event, BsCheck } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice';
import CategoriasMenuNav from './CategoriasMenuNav';
import { EquiposDetalle, PublicarCategoriaContainer, ResumenItemDescripcion, ResumenItemsContainer, ResumenItemTitulo, ResumenItemWrapper, VacantesEstado } from './categoriasStyles';
import { fetchJugadores } from '../../../redux/ServicesApi/jugadoresSlice';
import { fetchPlanteles } from '../../../redux/ServicesApi/plantelesSlice';
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';

const Categorias = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL
    
    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_edicion: id_categoria,
        nombre_categoria: '',
        genero: 'M',
        tipo_futbol: 7,
        duracion_tiempo: '',
        duracion_entretiempo: '',
    });
    const isFormEmpty = !formState.nombre_categoria.trim();

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { isUpdateModalOpen, openUpdateModal, closeUpdateModal } = useModalsCrud();


    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);

    const zonas = useSelector((state) => state.zonas.data);
    // Filtra las zonas y acumula la cantidad total de equipos para el `id_categoria`
    const zonasFiltradas = zonas.filter((z) => z.id_categoria == id_categoria);
    const totalEquipos = zonasFiltradas.reduce((acc, z) => acc + z.cantidad_equipos, 0);

    const planteles = useSelector((state) => state.planteles.data);
    const jugadoresCategoria = planteles.filter((p) => p.id_categoria == id_categoria)

    const partidos = useSelector((state) => state.partidos.data);
    const partidosCategoria = partidos.filter((p) => p.id_categoria == id_categoria)
    
    const temporadas = useSelector((state) => state.temporadas.data);
    const temporadasVacantes = temporadas.filter((t) => t.id_categoria == id_categoria && t.id_equipo)
    
    const equiposCategoria = temporadas.filter((t) => t.id_categoria == id_categoria)
    
    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
        dispatch(fetchTemporadas());
        dispatch(fetchJugadores());
        dispatch(fetchPlanteles());
        dispatch(fetchZonas());
    }, []);

    
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const categoriasEdicion = categoriasList.filter(categoria => categoria.id_edicion == id_categoria)
    const categoriasListLink = categoriasEdicion.map(categoria => ({
        ...categoria,
        link: `/admin/ediciones/categorias/resumen/${categoria.id_categoria}`, 
    }));

    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    
     // ACTUALIZAR
    const [idEditar, setidEditar] = useState(null) 

    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/publicar-categoria`, fetchCategorias, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        const data = { 
            id_categoria: id_categoria,
            publicada: 'S',
        }
        await actualizar(data);
        closeUpdateModal()
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
            {
                zonas.find((z) => z.id_categoria == id_categoria) 
                ? <>
                    {
                        categoriaFiltrada.publicada === "N" && (
                            <PublicarCategoriaContainer>
                                <span>Publicar categoría</span>
                                <p>Cuando estés listo, publicá tu categoria para que sea visible en la <a href="https://coparelampago.com">pagina web del torneo</a>.</p>
                                <Button bg={'success'} onClick={() => openUpdateModal()}>
                                    Publicar Categoría
                                </Button>
                            </PublicarCategoriaContainer>
                        )
                    }
                    <ResumenItemsContainer>
                        {/* <ResumenItemWrapper>
                            <ResumenItemTitulo>
                                <p>Estado de Categoria</p>
                                <span>HABILITADO</span>
                            </ResumenItemTitulo>
                            <ResumenItemDescripcion>
                                {
                                    partidosCategoria.filter((p) => p.estado === "F").length
                                }
                                /
                                {
                                    partidosCategoria.length
                                }
                            </ResumenItemDescripcion>
                        </ResumenItemWrapper> */}
                        <ResumenItemWrapper>
                            <ResumenItemTitulo>
                                vacantes
                                <IoShieldHalf />
                            </ResumenItemTitulo>
                            <ResumenItemDescripcion>
                                <VacantesEstado>
                                    {
                                    totalEquipos > 0 
                                        ? 
                                        <>
                                            <IoAlert />
                                            <p>Tenés {totalEquipos - temporadasVacantes.length} vacantes sin ocupar</p> 
                                        </>
                                        : 
                                        <>
                                            <IoCheckmark />
                                            <p>No tenes vacantes sin ocupar</p> 
                                        </>
                                    }
                                </VacantesEstado>
                                
                            </ResumenItemDescripcion>
                        </ResumenItemWrapper>
                        <ResumenItemWrapper>
                            <ResumenItemTitulo>
                                equipos
                                <IoShieldHalf />
                            </ResumenItemTitulo>
                            <ResumenItemDescripcion>
                                <EquiposDetalle>
                                    <h3>{equiposCategoria.length}</h3>
                                    <p>Total</p>
                                </EquiposDetalle>
                                <EquiposDetalle>
                                    <h3>{equiposCategoria.filter((e) => e.id_zona === null).length}</h3>
                                    <p>Sin vacante</p>
                                </EquiposDetalle>
                                <NavLink to={`/admin/categorias/equipos/${id_categoria}`}>
                                    Ir a equipos
                                </NavLink>
                            </ResumenItemDescripcion>
                        </ResumenItemWrapper>
                        <ResumenItemWrapper>
                            <ResumenItemTitulo>
                                jugadores
                                <IoShieldHalf />
                            </ResumenItemTitulo>
                            <ResumenItemDescripcion>
                                <EquiposDetalle>
                                    <h3>{jugadoresCategoria.length}</h3>
                                    <p>Total</p>
                                </EquiposDetalle>
                            </ResumenItemDescripcion>
                        </ResumenItemWrapper>
                    </ResumenItemsContainer>
                </>
                
                : <PublicarCategoriaContainer>
                    <span>Definir formato</span>
                    <p>Para continuar debes definir el formato de tu torneo.</p>
                    <Button bg={'success'} onClick={() => navigate(`/admin/categorias/formato/${id_categoria}`)}>
                        Definir formato
                    </Button>
                </PublicarCategoriaContainer>
            }
            
            {
                isUpdateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Publicar categoria`}
                        onClickClose={closeUpdateModal}
                        texto={
                            `Si estás listo, publicá tu categoría para que sea visible en la app TIMBO Player y en la página web de tu torneo.
Esta acción sólo se puede deshacer mientras no haya resultados confirmados de partidos.`
                        }
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeUpdateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={actualizarDato} disabled={isUpdating}>
                                    {isUpdating ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                            Publicando
                                        </>
                                    ) : (
                                        <>
                                            <IoCheckmark />
                                            Publicar Categoria
                                        </>
                                    )}
                                </Button>
                            </>
                        }
                    />
                    <Overlay onClick={closeUpdateModal} />
                </>
            }
        </Content>
    );
    
};

export default Categorias;
