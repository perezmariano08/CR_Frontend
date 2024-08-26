// useCrud.js
import { useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export const useCrud = (url, fetchAction, successMessage, errorMessage) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dispatch = useDispatch();

    const crear = async (data) => {
        setIsSaving(true);
        try {
            await Axios.post(url, data);
            toast.success(successMessage);
            dispatch(fetchAction())
        } catch (error) {
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const actualizar = async (data) => {
        // if (!isUpdated(data, img, originalValues)) {
        //     setIsSaving(false);
        //     toast.info("No se realizaron cambios.");
        //     return;
        // }
        setIsUpdating(true);
        try {
            const response = await Axios.put(url, data);
            if (response.status === 200) {
                setIsUpdating(false);
                toast.success(successMessage);
                dispatch(fetchAction());
            }
        } catch (error) {
            setIsUpdating(false);
            console.error(`Error al verificar o agregar.`, error);
            toast.error(errorMessage);
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
            await Axios.post(url, {id} );
            toast.success('Registro eliminado correctamente.');
            dispatch(fetchAction());
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const eliminarPorData = async (data) => {
        setIsDeleting(true);
        try {
            await Axios.post(url, data);
            toast.success('Registro eliminado correctamente.');
            dispatch(fetchAction());
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };
    

    return { crear, actualizar, eliminar, importar, eliminarPorId, eliminarPorData, isImporting, isDeleting, isSaving, isUpdating};
};
