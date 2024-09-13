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
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/Input/Input';
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
import { fetchExpulsados } from '../../../redux/ServicesApi/expulsadosSlice';
import { dataExpulsadosColumn } from '../../../Data/Expulsados/DataExpulsados';
import { EquipoBodyTemplate } from '../../../components/Table/TableStyles';
import { BiMessageDetail, BiSolidEdit } from 'react-icons/bi';
import { TablaExpulsadosWrapper } from './ExpulsadosStyles';
import useModalsCrud from '../../../hooks/useModalsCrud';
import useForm from '../../../hooks/useForm';
import { useCrud } from '../../../hooks/useCrud';
import { BsCalendar2Event } from 'react-icons/bs';

const Expulsados = () => {
    const dispatch = useDispatch();
    const { 
        isCreateModalOpen, openCreateModal, closeCreateModal, 
        isDeleteModalOpen, openDeleteModal, closeDeleteModal,
        isUpdateModalOpen, openUpdateModal, closeUpdateModal,
    } = useModalsCrud();

    // Manejo del form
    const [formState, handleFormChange, resetForm, setFormState] = useForm({ 
        id_partido: '',
        id_jugador: '',
        id_equipo: '',
        id_categoria: '',
        minuto: '',
        descipcion: '',
        motivo: '',
        estado: '',
        fechas: '',
        fechas_restantes: '',
        multa: '',
        id_expulsion: ''
    })

    const handleEdicionChange = (e) => {
        const { name, value } = e.target;

        // Reseteamos categoría, equipo y jugador cuando se cambia la edición
        setFormState({
            ...formState,
            [name]: value,
            id_categoria: '',  // Reset categoría
            id_equipo: '',     // Reset equipo
            id_jugador: ''     // Reset jugador
        });
    };

    const handleCategoriaChange = (e) => {
        const { name, value } = e.target;

        // Reseteamos equipo y jugador cuando se cambia la categoría
        setFormState({
            ...formState,
            [name]: value,
            id_equipo: '',     // Reset equipo
            id_jugador: ''     // Reset jugador
        });
    };

    const handleEquipoChange = (e) => {
        const { name, value } = e.target;

        // Reseteamos el jugador cuando se cambia el equipo
        setFormState({
            ...formState,
            [name]: value,
            id_jugador: ''     // Reset jugador
        });
    };

    // Estado del el/los Listado/s que se necesitan en el modulo
    const equiposList = useSelector((state) => state.equipos.data);
    const expulsadosList = useSelector((state) => state.expulsados.data);
    
    const ediciones = useSelector((state) => state.ediciones.data);

    const categorias = useSelector((state) => state.categorias.data);
    const categoriasEdicion = categorias.filter((c) => c.id_edicion == formState.id_edicion) 

    const temporadas = useSelector((state) => state.temporadas.data);
    const equiposCategoria = temporadas.filter((t) => t.id_categoria == formState.id_categoria)

    const planteles = useSelector((state) => state.planteles.data);
    const jugadoresEquipo = planteles.filter((p) => p.id_equipo == formState.id_equipo) 
    
    const expulsados = expulsadosList.map((expulsado) => {
        // Buscar el equipo correspondiente en equiposList
        const equipo = equiposList.find(e => e.id_equipo === expulsado.id_equipo);
    
        // Si se encuentra el equipo, asignar el nombre y la imagen
        const nombreEquipo = equipo ? equipo.nombre : 'Equipo no encontrado';
        const imagenEquipo = equipo.img ? `${URLImages}/${equipo.img}` : `${URLImages}/uploads/Equipos/team-default.png`;
    
        return {
            ...expulsado,
            acciones: (
                <div style={{display: "flex", gap: "10px"}}>
                    <Button bg={"danger"}>
                        <IoTrashOutline />
                    </Button>
                    <Button bg={"import"} onClick={() => editarSuspension(expulsado.id_expulsion)}>
                        <BiSolidEdit />
                    </Button>
                </div>
            ),
            id_equipo: (
                <EquipoBodyTemplate>
                    <img src={imagenEquipo} alt={nombreEquipo} />
                    <span>{nombreEquipo}</span>
                </EquipoBodyTemplate>
            ),
            fechas: (
                <>
                    {
                        `${expulsado.fechas - expulsado.fechas_restantes} / ${expulsado.fechas}`
                    }
                </>
            ),
            multa: (
                <>
                    {
                        expulsado.multa === 'S' ? (
                            `SI`
                        ) : (
                            `NO`
                        )
                    }
                </>
            ),
        };
    });

    const editarSuspension = (id_expulsion) => {
        const expulsionAEditar = expulsadosList.find((e) => e.id_expulsion === id_expulsion)
        if (expulsionAEditar) {
            setFormState({
                id_expulsion: expulsionAEditar.id_expulsion,
                fechas: expulsionAEditar.fechas,
            });
            openUpdateModal()
        }
        openUpdateModal()
    }

    const { actualizar, isUpdating } = useCrud(
        `${URL}/user/actualizar-expulsion`, fetchExpulsados, 'Registro actualizado correctamente.', "Error al actualizar el registro."
    );

    const actualizarDato = async () => {
        const data = { 
            fechas: formState.fechas,
            id_expulsion: formState.id_expulsion,
        }
        await actualizar(data);
        closeUpdateModal()
    };

    useEffect(() => {
        dispatch(fetchExpulsados());
    }, []);

    return (
        <Content>
            <Button bg={'success'} onClick={openCreateModal}>
                <FiPlus />
                Agregar expulsión
            </Button>
            <TablaExpulsadosWrapper>
                <h2>Suspensiones activas</h2>
                <Table 
                    data={expulsados.filter((e) => e.fechas_restantes > 0)} 
                    dataColumns={dataExpulsadosColumn} 
                    paginator={false}
                    selection={false}
                    sortable={false}
                />
            </TablaExpulsadosWrapper>
            <TablaExpulsadosWrapper>
                <h2>Suspensiones cumplidas</h2>
                <Table 
                    data={expulsados.filter((e) => e.fechas_restantes === 0)} 
                    dataColumns={dataExpulsadosColumn} 
                    selection={false}
                    sortable={false}
                />
            </TablaExpulsadosWrapper>
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear expulsión`}
                        onClickClose={closeCreateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={'agregarDato'} disabled={'isSaving'}>
                                    <>
                                        <IoCheckmark />
                                        Guardar
                                    </>
                                </Button>
                            </>
                        }
                        form={
                            <>
                                <ModalFormInputContainer>
                                    Edición
                                    <Select 
                                        name={'id_edicion'}
                                        data={ediciones}
                                        placeholder={'Seleccionar edicion'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_edicion"}
                                        column='nombre_temporada'
                                        value={formState.id_edicion}
                                        onChange={handleEdicionChange}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Categoria
                                    <Select 
                                        name={'id_categoria'}
                                        data={categoriasEdicion}
                                        placeholder={'Seleccionar categoria'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_categoria"}
                                        column='nombre'
                                        value={formState.id_categoria}
                                        onChange={handleCategoriaChange}
                                        disabled={!formState.id_edicion}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Equipo
                                    <Select 
                                        name={'id_equipo'}
                                        data={equiposCategoria}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_equipo"}
                                        column='nombre_equipo'
                                        value={formState.id_equipo}
                                        onChange={handleEquipoChange}
                                        disabled={!formState.id_categoria}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Jugador
                                    <Select 
                                        name={'id_jugador'}
                                        data={jugadoresEquipo}
                                        placeholder={'Seleccionar equipo'}
                                        icon={<IoShieldHalf className='icon-select'/>}
                                        id_={"id_jugador"}
                                        column='jugador'
                                        value={formState.id_jugador}
                                        onChange={handleFormChange}
                                        disabled={!formState.id_equipo}
                                    >
                                    </Select>
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
                isUpdateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isUpdateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Editar suspensión`}
                        onClickClose={closeUpdateModal}
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
                                    Fechas de suspensión
                                    <Input 
                                        name='fechas'
                                        type='number' 
                                        placeholder="Ejemplo: 1" 
                                        icon={<BsCalendar2Event className='icon-input'/>} 
                                        value={formState.fechas}
                                        onChange={handleFormChange}
                                    />
                                </ModalFormInputContainer>
                            </>
                        }
                    />
                    <Overlay onClick={closeUpdateModal} />
                </>
            }
        </Content>
    );
};

export default Expulsados;
