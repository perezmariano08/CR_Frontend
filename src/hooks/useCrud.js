// useCrud.js
import { useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export const useCrud = (url, fetchActions, successMessage, errorMessage) => {
    const token = localStorage.getItem('token');

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dispatch = useDispatch();

    const executeFetchActions = () => {
        if (Array.isArray(fetchActions)) {
            fetchActions.forEach(action => dispatch(action()));
        } else if (fetchActions) {
            dispatch(fetchActions());
        }
    };

    const crear = async (data) => {
        setIsSaving(true);
        try {
            const response = await Axios.post(url, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                const mensaje = response.data.mensaje;
                toast.success(mensaje || successMessage);
                executeFetchActions();
            }
        } catch (error) {
            const errorMensaje = error.response?.data?.mensaje || errorMessage;
            toast.error(errorMensaje);
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const actualizar = async (data) => {
        setIsUpdating(true);
        try {
            const response = await Axios.put(url, data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                const mensaje = response.data.mensaje;
                toast.success(mensaje || successMessage);
                executeFetchActions();
            }
        } catch (error) {
            const errorMensaje = error.response?.data?.mensaje || errorMessage;
            toast.error(errorMensaje);
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const importar = async (fileData, divisionesList) => {
        const datosExistentes = divisionesList.map(a => a.nombre);
        const nuevosDatos = fileData.filter(row => !datosExistentes.includes(row.nombre));

        if (nuevosDatos.length > 0) {
            setIsImporting(true);
            try {
                await Axios.post(url, nuevosDatos);
                toast.success(`Se importaron ${nuevosDatos.length} registros correctamente.`);
                executeFetchActions();
            } catch (error) {
                toast.error("Error al importar los datos.");
                console.error(error);
            } finally {
                setIsImporting(false);
            }
        } else {
            toast.error(`Todos los datos del archivo ya existen.`);
        }
    };

    const eliminar = async (ids) => {
        setIsDeleting(true);
        try {
            await Promise.all(ids.map(id => Axios.post(url, { id })));
            toast.success(`${ids.length} registros eliminados correctamente.`);
            executeFetchActions();
        } catch (error) {
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const eliminarPorId = async (id) => {
        setIsDeleting(true);
        try {
            const response = await Axios.post(url, {id}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
            } );
            const mensaje = response.data.mensaje;
            toast.success(mensaje);
            dispatch(fetchActions());
        } catch (error) {
            const errorMensaje = response?.data?.mensaje;
            console.error("Delete error:", error);
            toast.error(errorMensaje || errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const eliminarPorData = async (data) => {
        setIsDeleting(true);
        try {
            const response = await Axios.post(url, data);
            const mensaje = response.data.mensaje;
            toast.success(mensaje || 'Registro eliminado correctamente.');
            dispatch(fetchActions());
        } catch (error) {
            const errorMensaje = error.response.data.mensaje;
            console.error("Delete error:", error);
            toast.error(errorMensaje || errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    return { crear, actualizar, eliminar, importar, eliminarPorId, eliminarPorData, isImporting, isDeleting, isSaving, isUpdating};
};
