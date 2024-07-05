import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import Select from '../../../components/Select/Select';
import Input from '../../../components/Input/Input';
import { IoCheckmark, IoClose } from "react-icons/io5";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import { HiOutlineEllipsisVertical } from 'react-icons/hi2';
import Overlay from '../../../components/Overlay/Overlay';
import { dataTorneos } from '../../../Data/Torneos/DataTorneos';
import { dataAños } from '../../../Data/Años/DataAños';
import { dataCategorias } from '../../../Data/Categorias/Categorias';
import { dataTemporadas, dataTemporadasColumns } from '../../../Data/Temporadas/DataTemporadas';
import Axios from 'axios';
import { URL } from '../../../utils/utils';

const Temporadass = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Torneos
    const [torneo, setTorneo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [año, setAño] = useState("");
    const [sede, setSede] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const add = () => {

        if (
            torneo != "" &&
            categoria != "" &&
            año != "" &&
            sede != "" 
        ) {
            Axios.post(`${URL}/admin/crear-temporada`, {
                torneo,
                categoria,
                año,
                sede,
                descripcion
            }).then(()=>{
                alert("Temporada registrada")
            })
            closeCreateModal()
            getTemporadas()
        } else {
            alert("Completa los campos")
        }
    }

    const [temporadasList, setTemporadas] = useState([])
    const getTemporadas = () => {
        Axios.get(`${URL}/admin/get-temporadas`).then((response)=>{
            setTemporadas(response.data)
        })
    }
    getTemporadas()

    // Torneos
    const [torneosList, setTorneos] = useState([])
    const getTorneos = () => {
        Axios.get(`${URL}/torneos`).then((response)=>{
            setTorneos(response.data)
        })
    }
    getTorneos()

    // Categorias
    const [categoriasList, setCategorias] = useState([])
    const getCategorias = () => {
        Axios.get(`${URL}/categorias`).then((response)=>{
            setCategorias(response.data)
        })
    }
    getCategorias()

    // Sedes
    const [sedesList, setSedes] = useState([])
    const getSedes = () => {
        Axios.get(`${URL}/sedes`).then((response)=>{
            setSedes(response.data)
        })
    }
    getSedes()

    //Años
    const [añosList, setAños] = useState([])
    const getAños = () => {
        Axios.get(`${URL}/anios`).then((response)=>{
            setAños(response.data)
        })
    }
    getAños()



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
        // Aquí puedes manejar la lógica para leer el archivo CSV
    };
    
    return (
        <Content>
            <ContentTitle>Temporadas</ContentTitle>
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
            <Table data={temporadasList} dataColumns={dataTemporadasColumns} arrayName={"Temporadas"}/>
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                        animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title="Crear temporada"
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
                                    Torneo
                                    <Select
                                        data={torneosList}
                                        placeholder="Seleccionar torneo"
                                        onChange={(event) => { setTorneo(event.target.value)}}
                                        id_={"id_torneo"}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Categoría
                                    <Select
                                        data={categoriasList}
                                        placeholder="Seleccionar categoria"
                                        onChange={(event) => { setCategoria(event.target.value)}}
                                        id_={"id_categoria"}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Año
                                    <Select 
                                        data={añosList}
                                        column={"año"}
                                        placeholder="Seleccionar año"
                                        onChange={(event) => { setAño(event.target.value)}}
                                        id_={"id_año"}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Sede
                                    <Select 
                                        data={sedesList}
                                        placeholder="Seleccionar sede"
                                        onChange={(event) => { setSede(event.target.value)}}
                                        id_={"id_sede"}
                                    >
                                    </Select>
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Añadir descripción (Opcional)
                                    <Input type='text' placeholder="Escriba aqui..."
                                    onChange={(event) => { setDescripcion(event.target.value)}} />
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
                    message={"las temporadas"}
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

export default Temporadass;
