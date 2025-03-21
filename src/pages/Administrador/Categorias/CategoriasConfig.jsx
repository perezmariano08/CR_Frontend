import React, { useEffect, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { IoShieldHalf } from 'react-icons/io5';
import { ContentDividerOpcionesAvanzadas, ContentNavWrapper, ContentOpcionesAvanzadas, ContentTitle } from '../../../components/Content/ContentStyles';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { URL } from '../../../utils/utils';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { ConfigForm, ConfigFormWrapper, MenuContentTop } from '../../../components/Content/ContentStyles';
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import CategoriasMenuNav from './CategoriasMenuNav';

const EdicionesConfig = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id_categoria } = useParams(); // Obtenemos el id desde la URL
    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    // const equiposList = useSelector((state) => state.equipos.data);

    // Filtrar las categorías para excluir la categoría actual
    const categoriasSinActual = categoriasList.filter(categoria => categoria.id_categoria != id_categoria);
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_categoria);
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    // const categoriaEquipos = equiposList.filter((equipo) => equipo.id_categoria == id_categoria)
    
    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_categoria: id_categoria,
        nombre_categoria: categoriaFiltrada.nombre,
        genero: categoriaFiltrada.genero,
        tipo_futbol: categoriaFiltrada.tipo_futbol,
        duracion_tiempo: categoriaFiltrada.duracion_tiempo,
        duracion_entretiempo: categoriaFiltrada.duracion_entretiempo,
        puntos_victoria: categoriaFiltrada.puntos_victoria,
        puntos_empate: categoriaFiltrada.puntos_empate,
        puntos_derrota: categoriaFiltrada.puntos_derrota,
    });

    const isFormEmpty = !formState.nombre_categoria.trim();

    const isFormChanges = 
        formState.nombre_categoria !== categoriaFiltrada.nombre ||
        formState.genero != categoriaFiltrada.genero ||
        formState.tipo_futbol != categoriaFiltrada.tipo_futbol ||
        formState.duracion_tiempo != categoriaFiltrada.duracion_tiempo ||
        formState.duracion_entretiempo != categoriaFiltrada.duracion_entretiempo ||
        formState.puntos_victoria != categoriaFiltrada.puntos_victoria ||
        formState.puntos_empate != categoriaFiltrada.puntos_empate ||
        formState.puntos_derrota != categoriaFiltrada.puntos_derrota

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const { isDeleteModalOpen, openDeleteModal, closeDeleteModal } = useModalsCrud();

    useEffect(() => {
        if (categoriasList.length === 0) dispatch(fetchCategorias());
        if (edicionesList.length === 0) dispatch(fetchEdiciones());
    }, [dispatch, categoriasList.length, edicionesList.length]);

    
    // ACTUALIZAR
    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/actualizar-categoria`, fetchCategorias, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        if (!formState.nombre_categoria.trim() || !formState.duracion_tiempo || !formState.duracion_entretiempo) {
            toast.error("Completá los campos.");
            return;
        }

        if (formState.duracion_tiempo < 5 ) {
            toast.error("La duración de cada tiempo debe tener al menos 5.");
            return;
        }
        
        if (categoriasSinActual.some(a => a.nombre === formState.nombre_categoria.trim() && a.id_edicion == categoriaFiltrada.id_edicion)) {
            toast.error(`La categoría ya existe en esta edición.`);
            return;
        }

        const data = {
            nombre: formState.nombre_categoria.trim(),
            genero: formState.genero,
            tipo_futbol: formState.tipo_futbol,
            duracion_tiempo: formState.duracion_tiempo,
            duracion_entretiempo: formState.duracion_entretiempo,
            id_categoria: id_categoria,
            puntos_victoria: formState.puntos_victoria,
            puntos_empate: formState.puntos_empate,
            puntos_derrota: formState.puntos_derrota
        }
        console.log(data);

        await actualizar(data);
    };

    // ELIMINAR
    const { eliminarPorId, isDeleting } = useCrud(
        `${URL}/user/eliminar-categoria`, fetchCategorias, 'Registro eliminado correctamente.', "Error al eliminar el registro."
    );

    const eliminarRegistros = async () => {
        try {
            await eliminarPorId(id_categoria);
        } catch (error) {
            console.error("Error eliminando años:", error);
        } finally {
            closeDeleteModal()
            navigate(`/admin/ediciones/categorias/${categoriaFiltrada.id_edicion}`); // Redirige a la página de ediciones
        }
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
            <ConfigFormWrapper>
                <h2>Configuración de la edición {categoriaFiltrada.nombre}</h2>
                <ConfigForm>
                    <ModalFormInputContainer>
                        nombre
                        <Input 
                            name='nombre_categoria'
                            type='text' 
                            placeholder="Nombre" 
                            icon={<BsCalendar2Event className='icon-input'/>} 
                            value={formState.nombre_categoria}
                            onChange={handleFormChange}
                        />
                    </ModalFormInputContainer>
                    <ModalFormWrapper>
                        <ModalFormInputContainer>
                            genero
                            <Select 
                                name={'genero'}
                                data={[
                                    {
                                        genero: 'B',
                                        nombre: "Mixto",
                                    },
                                    {
                                        genero: 'M',
                                        nombre: "Masculino",
                                    },
                                    {
                                        genero: 'F',
                                        nombre: "Femenino",
                                    }
                                ]}
                                icon={<IoShieldHalf className='icon-select'/>}
                                id_={"genero"}
                                column='nombre'
                                value={formState.genero}
                                onChange={handleFormChange}
                            >
                            </Select>
                        </ModalFormInputContainer>
                        
                        <ModalFormInputContainer>
                            tipo de futbol
                            <Select 
                                name={'tipo_futbol'}
                                data={[
                                    {
                                        tipo_futbol: 7,
                                        nombre: "Futbol 7",
                                    },
                                    {
                                        tipo_futbol: 8,
                                        nombre: "Futbol 8",
                                    },
                                    {
                                        tipo_futbol: 9,
                                        nombre: "Futbol 9",
                                    },
                                    {
                                        tipo_futbol: 11,
                                        nombre: "Futbol 11",
                                    },
                                    {
                                        tipo_futbol: 1,
                                        nombre: "Otro",
                                    }
                                ]}
                                icon={<IoShieldHalf className='icon-select'/>}
                                id_={"tipo_futbol"}
                                column='nombre'
                                value={formState.tipo_futbol}
                                onChange={handleFormChange}
                            >
                            </Select>
                        </ModalFormInputContainer>
                    </ModalFormWrapper>
                    <ModalFormWrapper>
                        <ModalFormInputContainer>
                            puntos victoria
                            <Select 
                                name={'puntos_victoria'}
                                data={[
                                    { puntos_victoria: 0, nombre: "0 puntos" },
                                    { puntos_victoria: 1, nombre: "1 punto" },
                                    { puntos_victoria: 2, nombre: "2 puntos" },
                                    { puntos_victoria: 3, nombre: "3 puntos" },
                                    { puntos_victoria: 4, nombre: "4 puntos" },
                                    { puntos_victoria: 5, nombre: "5 puntos" },
                                    { puntos_victoria: 6, nombre: "6 puntos" }
                                ]}
                                icon={<TbNumber className='icon-select'/>}
                                id_={"puntos_victoria"}
                                column='nombre'
                                value={formState.puntos_victoria}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            puntos empate
                            <Select 
                                name={'puntos_empate'}
                                data={[
                                    { puntos_empate: 0, nombre: "0 puntos" },
                                    { puntos_empate: 1, nombre: "1 punto" },
                                    { puntos_empate: 2, nombre: "2 puntos" },
                                    { puntos_empate: 3, nombre: "3 puntos" },
                                    { puntos_empate: 4, nombre: "4 puntos" },
                                    { puntos_empate: 5, nombre: "5 puntos" },
                                    { puntos_empate: 6, nombre: "6 puntos" }
                                ]}
                                icon={<TbNumber className='icon-select'/>}
                                id_={"puntos_empate"}
                                column='nombre'
                                value={formState.puntos_empate}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            puntos derrotas
                            <Select 
                                name={'puntos_derrota'}
                                data={[
                                    { puntos_derrota: 0, nombre: "0 puntos" },
                                    { puntos_derrota: 1, nombre: "1 punto" },
                                    { puntos_derrota: 2, nombre: "2 puntos" },
                                    { puntos_derrota: 3, nombre: "3 puntos" },
                                    { puntos_derrota: 4, nombre: "4 puntos" },
                                    { puntos_derrota: 5, nombre: "5 puntos" },
                                    { puntos_derrota: 6, nombre: "6 puntos" }
                                ]}
                                icon={<TbNumber className='icon-select'/>}
                                id_={"puntos_derrota"}
                                column='nombre'
                                value={formState.puntos_derrota}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                    </ModalFormWrapper>
                    <ModalFormWrapper>
                        <ModalFormInputContainer>
                            duración de cada tiempo
                            <Input 
                                name='duracion_tiempo'
                                type='number' 
                                placeholder="45" 
                                icon={<BsCalendar2Event className='icon-input'/>} 
                                value={formState.duracion_tiempo}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            duración del entretiempo
                            <Input 
                                name='duracion_entretiempo'
                                type='number' 
                                placeholder="5" 
                                icon={<BsCalendar2Event className='icon-input'/>} 
                                value={formState.duracion_entretiempo}
                                onChange={handleFormChange}
                            />
                        </ModalFormInputContainer>
                    </ModalFormWrapper>
                    <Button bg={"success"} onClick={actualizarDato} disabled={isUpdating || isFormEmpty || !isFormChanges}>
                        {isUpdating ? (
                            <>
                                <LoaderIcon size="small" color='green' />
                                Actualizando
                            </>
                        ) : (
                            <>
                                Actualizar edición
                            </>
                        )}
                    </Button>
                    <ContentDividerOpcionesAvanzadas />
                    <ContentOpcionesAvanzadas>
                        <div bg={"info"} onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                            {showAdvancedOptions ? '- Opciones avanzadas' : '+ Opciones avanzadas'}
                        </div>
                        <AnimatePresence>
                            {showAdvancedOptions && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }} 
                                    transition={{ duration: 0.3 }}
                                >
                                    <Button bg={"danger"} onClick={openDeleteModal} disabled={isDeleting}>
                                        Eliminar edición
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                    </ContentOpcionesAvanzadas>
                </ConfigForm>
            </ConfigFormWrapper>
            {
                isDeleteModalOpen && (
                    <>
                        <ModalDelete
                            text={
                            `¿Estas seguro que quieres eliminar la categoria ${categoriaFiltrada.nombre}?`}
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
        </Content>
    );
};

export default EdicionesConfig;
