import Content from '../../../components/Content/Content'
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud'
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles'
import Button from '../../../components/Button/Button'
import { FiPlus } from 'react-icons/fi'
import { IoCheckmark, IoClose, IoShieldHalf, IoTrashOutline } from 'react-icons/io5'
import { LuDownload, LuUpload } from 'react-icons/lu'
import Table from '../../../components/Table/Table'
import { ContentTitle } from '../../../components/Content/ContentStyles'
import { HiOutlineEllipsisVertical } from 'react-icons/hi2'
import { useEffect, useState } from 'react'
import ModalCreate from '../../../components/Modals/ModalCreate/ModalCreate'
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles'
import Select from '../../../components/Select/Select'
import Input from '../../../components/Input/Input'
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete'
import Overlay from '../../../components/Overlay/Overlay'
import BasicFilterDemo from '../../../components/Table/Table'
import { dataEquipos, dataEquiposColumns } from '../../../Data/Equipos/DataEquipos'
import { dataCategorias } from '../../../Data/Categorias/Categorias'
import Axios from 'axios'
import { URL } from '../../../utils/utils'

const Equipos = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [equiposList, setEquipos] = useState([])
    const [categoriasList, setCategorias] = useState([])

    const [nombre, setNombre] = useState("");
    const [id_categoria, setIdCategoria] = useState("");
    const [img, setImg] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const crearEquipo = () => {
        if (nombre != "" && id_categoria != "") {
            Axios.post(`${URL}/admin/crear-equipo`, {
                nombre,
                id_categoria,
                descripcion,
                img
            }).then(()=>{
                alert("Categoria registrada")
            })
            closeCreateModal()
            getCategorias()
        } else {
            alert("Completa los campos")
        }
    }

    const getEquipos = () => {
        Axios.get(`${URL}/admin/get-equipos`)
            .then((response) => {
                setEquipos(response.data);
                console.log(equiposList);
            })
            .catch((error) => {
                console.error("Error al obtener los datos de equipos:", error);
            });
    };

    const getCategorias = () => {
        Axios.get(`${URL}/admin/get-categorias`)
            .then((response) => {
                setCategorias(response.data);
                console.log(equiposList);
            })
            .catch((error) => {
                console.error("Error al obtener los datos de equipos:", error);
            });
    };

    useEffect(() => {
        getEquipos();
        getCategorias()
    }, []);

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

    return (
        <Content>
            <ContentTitle>
                Equipos
            </ContentTitle>
            <ActionsCrud>
                <ActionsCrudButtons>
                    <Button bg="success" color="white" onClick={openCreateModal}>
                        <FiPlus />
                        Nuevo
                    </Button>
                    <Button bg="danger" color="white" onClick={openDeleteModal}>
                        <IoTrashOutline />
                        Eliminar
                    </Button>
                </ActionsCrudButtons>
                <ActionsCrudButtons>
                    <Button bg="import" color="white">
                        <LuUpload />
                        Importar
                    </Button>
                    <Button bg="export" color="white">
                        <LuDownload />
                        Descargar
                    </Button>
                </ActionsCrudButtons>
            </ActionsCrud>
            <Table data={equiposList} dataColumns={dataEquiposColumns} arrayName={"Equipos"}/>
            {
                isCreateModalOpen && <>
                    <ModalCreate initial={{ opacity: 0 }}
                    animate={{ opacity: isCreateModalOpen ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    title="Crear equipo"
                    onClickClose={closeCreateModal}
                    buttons={ <>
                            <Button color={"danger"} onClick={closeCreateModal}>
                                <IoClose/>
                                Cancelar
                            </Button>
                            <Button color={"success"} onClick={crearEquipo}>
                                <IoCheckmark/>
                                Guardar
                            </Button>
                        </>
                    }
                    form={ <>
                            <ModalFormInputContainer>
                                Nombre
                                <Input type='text' placeholder="Escriba el nombre..."
                                onChange={(event) => { setNombre(event.target.value)}}/>
                            </ModalFormInputContainer>
                            <ModalFormInputContainer>
                                Imagen
                                <Input type='text' placeholder="example.png"
                                onChange={(event) => { setImg(event.target.value)}} />
                            </ModalFormInputContainer>
                            <ModalFormInputContainer>
                                Categoría
                                <Select
                                    data={categoriasList}
                                    placeholder="Seleccionar categoría"
                                    icon={<IoShieldHalf className='icon-select'/>}
                                    id_={"id_categoria"}
                                    onChange={(event) => { setIdCategoria(event.target.value)}}
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
                    message={"los equipos"}
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
    )
}

export default Equipos