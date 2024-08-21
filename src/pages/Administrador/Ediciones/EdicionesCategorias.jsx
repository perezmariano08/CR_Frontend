import React, { useEffect } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf } from 'react-icons/io5';
import Table from '../../../components/Table/Table';
import { ContentNavWrapper, MenuContentTop } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import Overlay from '../../../components/Overlay/Overlay';
import { URL } from '../../../utils/utils';
import { LoaderIcon, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { CategoriasEdicionEmpty } from './edicionesStyles';
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';

import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';

const EdicionesCategorias = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams(); // Obtenemos el id desde la URL
    
    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_edicion: id_page,
        nombre_categoria: '',
        genero: 'B',
        tipo_futbol: 7,
        duracion_tiempo: '',
        duracion_entretiempo: '',
    });
    const isFormEmpty = !formState.nombre_categoria.trim() || !formState.duracion_tiempo || !formState.duracion_entretiempo;

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { isCreateModalOpen, openCreateModal, closeCreateModal } = useModalsCrud();

    // Constantes del modulo
    const id = "id_categoria"

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    
    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
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

        
        
        if (formState.duracion_tiempo < 5 ) {
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
    
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == id_page);
    const categoriasEdicion = categoriasList.filter(categoria => categoria.id_edicion == id_page)
    const categoriasListLink = categoriasEdicion.map(categoria => ({
        ...categoria,
        link: `/admin/categorias/resumen/${categoria.id_categoria}`, 
    }));

    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <div>{edicionFiltrada.nombre_temporada}</div>
            </MenuContentTop>
            <ContentNavWrapper>
                <li><NavLink to={`/admin/ediciones/categorias/${id_page}`}>Categorias</NavLink></li>
                <li><NavLink to={`/admin/ediciones/config/${id_page}`}>Configuración</NavLink></li>
            </ContentNavWrapper>
            {
                categoriasEdicion.length > 0 ? (
                    <>
                        <Table
                            data={categoriasListLink}
                            dataColumns={dataCategoriasColumns}
                            arrayName={'Categorias'}
                            paginator={false}
                            selection={false}
                            id_={id}
                            urlClick={`/admin/categorias/resumen/`}
                            rowClickLink
                        />
                        <Button bg="success" color="white" onClick={openCreateModal}>
                            <FiPlus />
                            <p>Agregar categoría</p>
                        </Button>
                    </>
                ) : (
                    <CategoriasEdicionEmpty>
                        <h2>¡Ya podés empezar a crear categorías!</h2>
                        <Button bg="success" color="white" onClick={openCreateModal}>
                            <FiPlus />
                            <p>Nueva categoría</p>
                        </Button>
                    </CategoriasEdicionEmpty>
                )
            }
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear categoría`}
                        onClickClose={closeCreateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={agregarRegistro} disabled={isSaving || isFormEmpty}>
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
                                        name='nombre_categoria'
                                        type='text' 
                                        placeholder="Nombre" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.nombre_categoria}
                                        onChange={handleFormChange}
                                    />
                                    <p>
                                        Ejemplos de nombres: <span>Primera Masculino, Femenino F5, Infantiles F11, B Veteranos</span>
                                    </p>
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
                            </>
                        }
                    />
                    <Overlay onClick={closeCreateModal} />
                </>
            }
        </Content>
    );
};

export default EdicionesCategorias;