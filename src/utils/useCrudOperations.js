import { useState, useEffect } from 'react';
import Axios from 'axios';
import { toast } from 'react-hot-toast';
import { URL } from '../utils/utils';

export const useCrudOperations = (endpoint) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const getItems = async () => {
        try {
            setLoading(true);
            const response = await Axios.get(`${URL}/admin/get-${endpoint}`);
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(`Error al obtener los ${endpoint}:`, error);
        }
    };

    const addItem = async (item) => {
        try {
            await Axios.post(`${URL}/admin/crear-${endpoint}`, item);
            toast.success(`${endpoint.slice(0, -1)} registrado correctamente.`);
            getItems();
        } catch (error) {
            toast.error(`No se pudo registrar el ${endpoint.slice(0, -1)}.`);
            console.error(`Error al agregar el ${endpoint.slice(0, -1)}:`, error);
        }
    };

    const deleteItems = async (selectedItems) => {
        if (selectedItems.length > 0) {
            try {
                const deletePromises = selectedItems.map(item =>
                    Axios.post(`${URL}/admin/delete-${endpoint.slice(0, -1)}`, { id: item.id })
                );
                await Promise.all(deletePromises);
                toast.success(`${endpoint.slice(0, -1)}(s) eliminados correctamente.`);
                getItems();
            } catch (error) {
                toast.error(`No se pudieron eliminar los ${endpoint}.`);
                console.error(`Error al eliminar los ${endpoint}:`, error);
            }
        } else {
            toast.error(`No hay ${endpoint} seleccionados.`);
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return { items, loading, addItem, deleteItems };
};
