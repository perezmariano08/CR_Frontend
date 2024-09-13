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
import { BsCalendar2Event } from "react-icons/bs";
import { NavLink, useParams } from 'react-router-dom';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { useCrud } from '../../../hooks/useCrud';
import useModalsCrud from '../../../hooks/useModalsCrud';
import { fetchEquipos } from '../../../redux/ServicesApi/equiposSlice';
import { dataEquiposColumns } from '../../../Data/Equipos/DataEquipos';
import CategoriasMenuNav from './CategoriasMenuNav';

const CategoriasFormato = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams(); // Obtenemos el id desde la URL
    
    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        id_edicion: id_page,
        nombre_categoria: '',
        genero: 'M',
        tipo_futbol: 7,
        duracion_tiempo: '',
        duracion_entretiempo: '',
    });
    const isFormEmpty = !formState.nombre_categoria.trim();

    // Manejar los modulos de CRUD desde el Hook useModalsCrud.js
    const { isCreateModalOpen, openCreateModal, closeCreateModal } = useModalsCrud();

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
    const equiposList = useSelector((state) => state.equipos.data);
    
    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias());
        dispatch(fetchEquipos());
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

        if (formState.duracion_tiempo < 4 ) {
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
    
    const categoriaFiltrada = categoriasList.find(categoria => categoria.id_categoria == id_page);
    const categoriasEdicion = categoriasList.filter(categoria => categoria.id_edicion == id_page)
    const categoriasListLink = categoriasEdicion.map(categoria => ({
        ...categoria,
        link: `/admin/ediciones/categorias/resumen/${categoria.id_categoria}`, 
    }));

    const categoriaEquipos = equiposList.filter((equipo) => equipo.id_categoria == id_page)
    const edicionFiltrada = edicionesList.find(edicion => edicion.id_edicion == categoriaFiltrada.id_edicion);
    
    return (
        <Content>
            <MenuContentTop>
                <NavLink to={'/admin/ediciones'}>Ediciones</NavLink>
                /
                <NavLink to={`/admin/ediciones/categorias/${edicionFiltrada.id_edicion}`}>{edicionFiltrada.nombre_temporada}</NavLink>
                /
                <div>{categoriaFiltrada.nombre}</div>
            </MenuContentTop>
            <CategoriasMenuNav id_categoria={id_page}/>
            <p>EN PRODUCCIÓN</p>
        </Content>
    );
};

export default CategoriasFormato;
