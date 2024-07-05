import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Content from '../../../components/Content/Content'
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles';
import Button from '../../../components/Button/Button';
import { FiPlus } from 'react-icons/fi';
import { IoTrashOutline } from 'react-icons/io5';
import { LuDownload, LuUpload } from 'react-icons/lu';
import Table from '../../../components/Table/Table';
import { ContentTitle } from '../../../components/Content/ContentStyles';
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate';
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import Overlay from '../../../components/Overlay/Overlay';
import { dataCategoriasColumns } from '../../../Data/Categorias/Categorias';
import { URL } from '../../../utils/utils';

const Categorias = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [nombre, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [categoriasList, setCategorias] = useState([])


    const getCategorias =  () => {
        axios.get(`${URL}/admin/get-categorias`)
        .then((response)=>{
            setCategorias(response.data)
        })
        .catch((error) => {
            console.error("Error en la solicitud HTTP:", error);
        });
    }

    const add = () => {
        if (nombre !== "") {
            axios.post(`${URL}/admin/crear-categoria`, {
                nombre,
                descripcion
            }).then(()=>{
                alert("Categoria registrada")
            })
            closeCreateModal()
            getCategorias()
        } else {
            alert("Completa los campos")
        }
    }

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file);
    };

    getCategorias()
    return (
        <Content>
            <ContentTitle>Categorias</ContentTitle>
            <ActionsCrud>
                <ActionsCrudButtons>
                    <Button bg="success" color="white" onClick={openCreateModal}>
                        <FiPlus />
                        <p>Nuevo</p>
                    </Button>
                    <Button bg="danger" color="white" onClick={openDeleteModal}>
                        <IoTrashOutline />
                        <p>Eliminar</p>
                    </Button>
                </ActionsCrudButtons>
                <ActionsCrudButtons>
                    <label htmlFor="importInput" style={{ display: 'none' }}>
                        <input id="importInput" type="file" accept=".csv" onChange={handleFileChange} />
                    </label>
                    <Button bg="import" color="white" as="label" htmlFor="importInput">
                        <LuUpload />
                        <p>Importar</p>
                    </Button>
                    <Button bg="export" color="white">
                        <LuDownload />
                        <p>Descargar</p>
                    </Button>
                </ActionsCrudButtons>
            </ActionsCrud>
            <Table data={categoriasList} dataColumns={dataCategoriasColumns} arrayName={"Categorias"}/>
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title="Crear categoria"
                        onClickClose={closeCreateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose/>
                                    Cancelar
                                </Button>
                                <Button color={"success"} onClick={add}>
                                    <IoCheckmark/>
                                    Guardar
                                </Button>
                            </>
                        }
                        form={
                            <>
                                <ModalFormInputContainer>
                                    Nombre
                                    <Input 
                                        onChange={(event) => { setCategoria(event.target.value)}} 
                                        type='text' 
                                        placeholder="Escriba aqui el nombre de la categoría..." />
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Descripcion
                                    <Input 
                                        onChange={(event) => { setDescripcion(event.target.value)}} 
                                        type='text' 
                                        placeholder="Escriba aqui..." />
                                </ModalFormInputContainer>
                            </>
                        }
                    /> 
                    <Overlay onClick={closeCreateModal}/>
                </>
            }
            {
                isDeleteModalOpen && <>
                    <ModalDelete initial={{ opacity: 0 }}
                    animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    message={"las categorias"}
                    onClickClose={closeDeleteModal}
                    buttons={
                        <>
                            <Button color={"danger"}>
                                <IoClose/>
                                No
                            </Button>
                            <Button color={"success"}>
                                <IoCheckmark/>
                                Si
                            </Button>
                        </>
                    }
                    />
                    <Overlay onClick={closeDeleteModal}/>
                </>
            }
        </Content>
    );
};

export default Categorias;
