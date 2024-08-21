import { useState } from 'react';

const useModalsCrud = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Funciones para manejar la apertura y cierre de los modales
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const openUpdateModal = () => setIsUpdateModalOpen(true);
    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    return {
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        isUpdateModalOpen,
        openUpdateModal,
        closeUpdateModal,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
    };
};

export default useModalsCrud;
