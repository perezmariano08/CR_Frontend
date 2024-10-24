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

const EdicionesConfig = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id_edicion } = useParams(); // Obtenemos el id desde la URL
    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    
    const edicionFiltrada  = edicionesList.find(edicion => edicion.id_edicion == id_edicion);
    
    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        nombre_edicion: edicionFiltrada.nombre,
        temporada: edicionFiltrada.temporada,
        puntos_victoria: edicionFiltrada.puntos_victoria,
        puntos_empate: edicionFiltrada.puntos_empate,
        puntos_derrota: edicionFiltrada.puntos_derrota,
        apercibimientos: edicionFiltrada.apercibimientos,
        puntos_descuento: edicionFiltrada.puntos_descuento,
    });

    const isFormEmpty = !formState.nombre_edicion.trim();

    const isFormChanges = 
        formState.nombre_edicion !== edicionFiltrada.nombre ||
        formState.temporada != edicionFiltrada.temporada ||
        formState.puntos_victoria != edicionFiltrada.puntos_victoria ||
        formState.puntos_empate != edicionFiltrada.puntos_empate ||
        formState.puntos_derrota != edicionFiltrada.puntos_derrota ||
        formState.apercibimientos != edicionFiltrada.apercibimientos ||
        formState.puntos_descuento != edicionFiltrada.puntos_descuento

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const { isDeleteModalOpen, openDeleteModal, closeDeleteModal } = useModalsCrud();

    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
    }, []);

    
    // ACTUALIZAR
    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/actualizar-edicion`, fetchEdiciones, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        const nombre_temporada = `${formState.nombre_edicion.trim()} ${formState.temporada}`

        if (!nombre_temporada.trim()) {
            toast.error("Completá los campos.");
            return;
        }

        if (edicionesList.some(a => a.nombre_temporada === nombre_temporada.trim())) {
            toast.error(`No se puede actualizar, esa edición ya existe.`);
            return
        }

        const data = {
            nombre: formState.nombre_edicion,
            temporada: formState.temporada,
            puntos_victoria: formState.puntos_victoria,
            puntos_empate: formState.puntos_empate,
            puntos_derrota: formState.puntos_derrota,
            id_edicion: id_edicion,
            apercibimientos: formState.apercibimientos,
            puntos_descuento: formState.puntos_descuento,
        }
        await actualizar(data);
    };

    // ELIMINAR
    const { eliminarPorId, isDeleting } = useCrud(
        `${URL}/user/eliminar-edicion`, fetchEdiciones, 'Registro eliminado correctamente.', "Error al eliminar el registro."
    );

    const eliminarRegistros = async () => {
        try {
            await eliminarPorId(id_edicion);
        } catch (error) {
            console.error("Error eliminando años:", error);
        } finally {
            closeDeleteModal()
            navigate('/admin/ediciones'); // Redirige a la página de ediciones
        }
    };

    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <div>{edicionFiltrada.nombre_temporada}</div>
            </MenuContentTop>
            <ContentNavWrapper>
                <li><NavLink to={`/admin/ediciones/categorias/${id_edicion}`}>Categorias</NavLink></li>
                <li><NavLink to={`/admin/ediciones/config/${id_edicion}`}>Configuración</NavLink></li>
            </ContentNavWrapper>
            <ConfigFormWrapper>
                <h2>Configuración de la edición {edicionFiltrada.nombre}</h2>
                <ConfigForm>
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

                    <ModalFormWrapper>
                        <ModalFormInputContainer>
                        apercibimientos
                        <Select 
                            name={'apercibimientos'}
                            data={[
                                { apercibimientos: 0, nombre: "No se otorgan" },
                                { apercibimientos: 1, nombre: "1 apercibimiento" },
                                { apercibimientos: 2, nombre: "2 apercibimientos" },
                                { apercibimientos: 3, nombre: "3 apercibimientos" },
                                { apercibimientos: 4, nombre: "4 apercibimientos" },
                                { apercibimientos: 5, nombre: "5 apercibimientos" },
                            ]}
                            icon={<TbNumber className='icon-select'/>}
                            id_={"apercibimientos"}
                            column='nombre'
                            value={formState.apercibimientos}
                            onChange={handleFormChange}
                        />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                        puntos por apercibimientos
                        <Select 
                            name={'puntos_descuento'}
                            data={[
                                { puntos_descuento: 0, nombre: "No se otorgan" },
                                { puntos_descuento: 1, nombre: "1 punto" },
                                { puntos_descuento: 2, nombre: "2 puntos" },
                                { puntos_descuento: 3, nombre: "3 puntos" }
                            ]}
                            icon={<TbNumber className='icon-select'/>}
                            id_={"puntos_descuento"}
                            column='nombre'
                            value={formState.puntos_descuento}
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
                            `¿Estas seguro que quieres eliminar la edición ${edicionFiltrada.nombre}?`}
                            animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClickClose={closeDeleteModal}
                            title={`Eliminar edición ${edicionFiltrada.nombre}?`}
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
