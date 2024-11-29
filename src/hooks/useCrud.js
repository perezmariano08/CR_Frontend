// useCrud.js
import { useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export const useCrud = (url, fetchAction, successMessage, errorMessage) => {

    const token = localStorage.getItem('token')

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dispatch = useDispatch();

    const crear = async (data) => {
        setIsSaving(true);
        try {
            const response = await Axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const mensaje = response.data.mensaje;
                toast.success(mensaje || successMessage);
                dispatch(fetchAction())
            }
        } catch (error) {
            const errorMensaje = error.response.data.mensaje;
            toast.error(errorMensaje || errorMessage);
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const actualizar = async (data) => {
        setIsUpdating(true);
        try {
            const response = await Axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setIsUpdating(false);
                const mensaje = response.data.mensaje;
                toast.success(mensaje || successMessage);
                dispatch(fetchAction());
            }
        } catch (error) {
            setIsUpdating(false);
            const errorMensaje = error.response.data.mensaje;
            console.error(`Error al verificar o agregar.`, error);
            toast.error(errorMensaje || errorMessage);
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
                dispatch(fetchAction());
                setIsImporting(false);
            } catch (error) {
                toast.error("importErrorMessage");
                console.error(error);
                setIsImporting(false);
            }
        } else {
            toast.error(`Todos los del archivo ya existen.`);
            setIsImporting(false);
        }
    };

    const eliminar = async (ids) => {
        setIsDeleting(true);
        try {
            await Promise.all(ids.map(id => Axios.post(url, { id })));
    
            const recordCount = ids.length;
            const message = recordCount === 1
                ? '1 registro eliminado correctamente.'
                : `${recordCount} registros eliminados correctamente.`;

            toast.success(message);
            dispatch(fetchAction());
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(errorMessage);
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
            dispatch(fetchAction());
        } catch (error) {
            const errorMensaje = response.data.mensaje;
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
            dispatch(fetchAction());
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
