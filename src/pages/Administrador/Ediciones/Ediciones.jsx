import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Importa los estilos de Skeleton
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import Table from '../../../components/Table/Table';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Select from '../../../components/Select/Select';
import Input from '../../../components/UI/Input/Input';
import Overlay from '../../../components/Overlay/Overlay';
import { DataItemTemplate, EstadoBodyTemplate, LinkBodyTemplate } from '../../../components/Table/TableStyles';
import { URL } from '../../../utils/utils';
import { LoaderIcon, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { TablasTemporadaContainer, TablaTemporada } from './edicionesStyles';
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf } from 'react-icons/io5';
import { TbNumber, TbShirtSport } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { CiViewList } from 'react-icons/ci';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import useForm from '../../../hooks/useForm';
import { edicionesListColumns } from '../../../Data/Ediciones/edicionesListColumns';

const Ediciones = () => {
    const dispatch = useDispatch();
    const { loading, data: edicionesList } = useSelector((state) => state.ediciones);

    const edicionesListLink = edicionesList.map(edicion => ({
        ...edicion,
        estado: (
            <>
                {edicion.estado === "JUGANDO" ? (
                    <EstadoBodyTemplate $bg={"import"}>{edicion.estado}</EstadoBodyTemplate>
                ) : (
                    <EstadoBodyTemplate $bg={"gray-200"}>{edicion.estado}</EstadoBodyTemplate>
                )}
            </>
        ),
        jugadores: (
            <DataItemTemplate to={`/admin/jugadores`}>
                <TbShirtSport />
                {edicion.jugadores}
            </DataItemTemplate>
        ),
        equipos: (
            <DataItemTemplate to={`/admin/equipos`}>
                <IoShieldHalf />
                {edicion.equipos}
            </DataItemTemplate>
        ),
        categorias: (
            <DataItemTemplate to={`/admin/categorias`}>
                <CiViewList />
                {edicion.categorias}
            </DataItemTemplate>
        ),
        link: (
            <LinkBodyTemplate to={`/admin/ediciones/categorias/${edicion.id_edicion}`}>
                Ingresar
            </LinkBodyTemplate>
        ),
    }));
    
    // Estado del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        nombre_edicion: '',
        id_torneo: '',
        temporada: new Date().getFullYear(),
        mes_inicio: '',
        mes_finalizacion: '',
        cantidad_eventuales: 5,
        partidos_eventuales: 1,
        apercibimientos: 5,
        puntos_descuento: 1,
    });
    const isFormEmpty = !formState.nombre_edicion.trim();

    // Manejar los modulos de CRUD
    const { isCreateModalOpen, openCreateModal, closeCreateModal } = useModalsCrud();
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-edicion`, fetchEdiciones, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {
        const nombre_temporada = `${formState.nombre_edicion.trim()} ${formState.temporada}`;
        if (!nombre_temporada.trim()) {
            toast.error("Completá los campos.");
            return;
        }
        if (edicionesList.some(a => a.nombre_temporada === nombre_temporada.trim())) {
            toast.error(`La edición ya existe.`);
            return;
        } 
        const data = {
            nombre: formState.nombre_edicion.trim(),
            temporada: formState.temporada,
            cantidad_eventuales: formState.cantidad_eventuales,
            partidos_eventuales: formState.partidos_eventuales,
            apercibimientos: formState.apercibimientos,
            puntos_descuento: formState.puntos_descuento,
        };
        console.log(data);

        await crear(data);
        closeCreateModal();
        resetForm();
    };

    // Ordenar las temporadas de más reciente a más antigua
    const temporadas = [...new Set(edicionesList.map(edicion => edicion.temporada))]
    .sort((a, b) => b - a);

    useEffect(() => {
        dispatch(fetchEdiciones());
    }, [dispatch]);

    return (
        <Content>
            <Button bg="success" color="white" onClick={openCreateModal}>
                <FiPlus />
                <p>Agregar nueva edición</p>
            </Button>
            {
                loading ? 
                <>
                    <Skeleton 
                        count={1} 
                        height={30} 
                        width={250} 
                        baseColor="#1A1B1B" 
                        highlightColor="#2D2F30" 
                        borderRadius={20} 
                    />
                    <Skeleton 
                        count={1} 
                        height={100} 
                        width={'100%'} 
                        baseColor="#1A1B1B" 
                        highlightColor="#2D2F30" 
                        borderRadius={20}  
                    />
                    <Skeleton 
                        count={1} 
                        height={30} 
                        width={250} 
                        baseColor="#1A1B1B" 
                        highlightColor="#2D2F30" 
                        borderRadius={20} 
                    />
                    <Skeleton 
                        count={1} 
                        height={100} 
                        width={'100%'} 
                        baseColor="#1A1B1B" 
                        highlightColor="#2D2F30" 
                        borderRadius={20}  
                    />
                </>
                : <TablasTemporadaContainer>
                {temporadas.map(temporada => (
                    <TablaTemporada key={temporada}>
                        <h2>Temporada {temporada}</h2>
                        <Table 
                            data={edicionesListLink.filter(edicion => edicion.temporada === temporada)} 
                            dataColumns={edicionesListColumns} 
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={'id_edicion'}
                            path={'/admin/ediciones/categorias'}
                            rowField={'id_edicion'}
                        />
                    </TablaTemporada>
                ))}
            </TablasTemporadaContainer>
            } 
            
            {isCreateModalOpen && <>
                <ModalCreate initial={{ opacity: 0 }}
                    animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    title={`Crear edición`}
                    onClickClose={closeCreateModal}
                    buttons={
                        <>
                            <Button color={"danger"} onClick={closeCreateModal} disabled={isSaving}>
                                <IoClose />
                                Cancelar
                            </Button>
                            <Button color={"success"} onClick={agregarRegistro} disabled={isFormEmpty || isSaving}>
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
                                {
                                    formState.nombre_edicion && (
                                        <p>
                                            La edición se mostrará con el nombre: <span>{formState.nombre_edicion} {formState.temporada}</span>
                                        </p>
                                    )
                                }
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Temporada
                                    <Select 
                                        name={'temporada'}
                                        data={[
                                            { temporada: 2023, nombre: "Temporada 2023" },
                                            { temporada: 2024, nombre: "Temporada 2024" },
                                            { temporada: 2025, nombre: "Temporada 2025" }
                                        ]}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"temporada"}
                                        column='nombre'
                                        value={formState.temporada}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                                </ModalFormWrapper>
                                
                                <ModalFormWrapper>
                                    <ModalFormInputContainer>
                                    Eventuales por equipo
                                    <Select 
                                        name={'cantidad_eventuales'}
                                        data={[
                                            { cantidad_eventuales: 0, nombre: "1 jugador" },
                                            { cantidad_eventuales: 1, nombre: "2 jugadores" },
                                            { cantidad_eventuales: 2, nombre: "3 jugadores" },
                                            { cantidad_eventuales: 4, nombre: "4 jugadores" },
                                            { cantidad_eventuales: 5, nombre: "5 jugadores" },
                                            { cantidad_eventuales: 6, nombre: "6 jugadores" },
                                        ]}
                                        icon={<TbNumber className='icon-select'/>}
                                        id_={"cantidad_eventuales"}
                                        column='nombre'
                                        value={formState.cantidad_eventuales}
                                        onChange={handleFormChange}
                                    />
                                    </ModalFormInputContainer>
                                    <ModalFormInputContainer>
                                    Partidos como eventuales
                                    <Select 
                                        name={'partidos_eventuales'}
                                        data={[
                                            { partidos_eventuales: 0, nombre: "Sin limite" },
                                            { partidos_eventuales: 1, nombre: "1 partido" },
                                            { partidos_eventuales: 2, nombre: "2 partidos" },
                                            { partidos_eventuales: 3, nombre: "3 partidos" },
                                            { partidos_eventuales: 4, nombre: "4 partidos" },
                                            { partidos_eventuales: 5, nombre: "5 partidos" },
                                            { partidos_eventuales: 6, nombre: "6 partidos" },
                                        ]}
                                        icon={<TbNumber className='icon-select'/>}
                                        id_={"partidos_eventuales"}
                                        column='nombre'
                                        value={formState.partidos_eventuales}
                                        onChange={handleFormChange}
                                    />
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
                            </>
                        }
                    />
                    <Overlay onClick={isSaving ? null : closeCreateModal} disabled={isSaving} />
            </>
            }
        </Content>
    );
};

export default Ediciones;
