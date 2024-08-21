import React, { useEffect, useState } from 'react';
import Content from '../../../components/Content/Content';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoShieldHalf } from 'react-icons/io5';
import Table from '../../../components/Table/Table';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer, ModalFormWrapper } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import Overlay from '../../../components/Overlay/Overlay';
import { URL } from '../../../utils/utils';
import { LoaderIcon, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { TablasTemporadaContainer, TablaTemporada } from './edicionesStyles';
import useForm from '../../../hooks/useForm';
import Select from '../../../components/Select/Select';

import { TbNumber } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { edicionesListColumns } from '../../../Data/Ediciones/edicionesListColumns';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';

const Ediciones = () => {
    const dispatch = useDispatch();

    // Estado del el/los Listado/s que se necesitan en el modulo
    const edicionesList = useSelector((state) => state.ediciones.data);
    const edicionesListLink = edicionesList.map(edicion => ({
    ...edicion,
    link: `/admin/ediciones/categorias/${edicion.id_edicion}`,  // Aquí construyes el enlace basado en el id u otros datos
    }));

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        nombre_edicion: '',
        id_torneo: '',
        temporada: new Date().getFullYear(),
        mes_inicio: '',
        mes_finalizacion: '',
        puntos_victoria: 3,
        puntos_empate: 1,
        puntos_derrota: 0,
    });
    const isFormEmpty = !formState.nombre_edicion.trim();

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { isCreateModalOpen, openCreateModal, closeCreateModal } = useModalsCrud();

    // CREAR - AGREGAR REGISTRO
    const { crear, isSaving } = useCrud(
        `${URL}/user/crear-edicion`, fetchEdiciones, 'Registro creado correctamente.', "Error al crear el registro."
    );

    const agregarRegistro = async () => {
        const nombre_temporada = `${formState.nombre_edicion.trim()} ${formState.temporada}`
        if (!nombre_temporada.trim()) {
            toast.error("Completá los campos.");
            return;
        }
        if (edicionesList.some(a => a.nombre_temporada === nombre_temporada.trim())) {
            toast.error(`La edición ya existe.`);
            return
        } 
        const data = {
            nombre: formState.nombre_edicion.trim(),
            temporada: formState.temporada,
            puntos_victoria: formState.puntos_victoria,
            puntos_empate: formState.puntos_empate,
            puntos_derrota: formState.puntos_derrota
        };
        await crear(data);
        closeCreateModal();
        resetForm()
    };
    
    const temporadas = [...new Set(edicionesList.map(edicion => edicion.temporada))]
    .sort((a, b) => b - a); // Ordena las temporadas de más reciente a más antigua

    useEffect(() => {
        dispatch(fetchEdiciones());
    }, []);

    return (
        <Content>
            <Button bg="success" color="white" onClick={openCreateModal}>
                <FiPlus />
                <p>Agregar nueva edición</p>
            </Button>
            <TablasTemporadaContainer>
                {temporadas.map(temporada => (
                    <TablaTemporada key={temporada}>
                        <h2>Temporada {temporada}</h2>
                        <Table 
                            data={edicionesListLink.filter(edicion => edicion.temporada === temporada)} 
                            dataColumns={edicionesListColumns} 
                            arrayName={'Ediciones'} 
                            paginator={false}
                            selection={false}
                            sortable={false}
                            id_={'id_edicion'}
                            urlClick={'/admin/ediciones/categorias/'}
                            rowClickLink
                        />
                    </TablaTemporada>
                ))}
            </TablasTemporadaContainer>
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crear edición`}
                        onClickClose={closeCreateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
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
                                
                            </>
                        }
                    />
                    <Overlay onClick={closeCreateModal} />
                </>
            }
        </Content>
    );
};

export default Ediciones;