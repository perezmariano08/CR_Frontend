import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Content from '../../../components/Content/Content'
import { ContentTitle } from '../../../components/Content/ContentStyles'
import { ActionsCrudButtons } from '../../../components/ActionsCrud/ActionsCrudStyles'
import { FiPlus } from 'react-icons/fi';
import Button from '../../../components/Button/Button'
import ActionsCrud from '../../../components/ActionsCrud/ActionsCrud';
import { ButtonsContaier, NoticiaImagen, NoticiaInfoContainer, NoticiasActions, NoticiasActionsContainer, NoticiasCategoriasContainer, NoticiasContainer, NoticiasContainerStyled, NoticiasFecha, NoticiasTextoContainer, NoticiaTexto, NoticiaTitulo, Button as ButtonStyled } from './NoticiasStyles';
import { FaEye, FaTrash, FaPencilAlt } from "react-icons/fa";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaRegNewspaper } from "react-icons/fa6";
import ModalNoticias from './ModalNoticias';
import { MdOutlineImage } from 'react-icons/md';
import Overlay from '../../../components/Overlay/Overlay';
import { ModalFormInputContainer, ModalFormInputImg } from '../../../components/Modals/ModalsStyles';
import Input from '../../../components/UI/Input/Input';
import { CheckboxContainer, CheckboxLabel, ModalFormLeft, ModalFormRight, StyledCheckbox } from './ModalNoticiasStyles';
import useFetch from '../../../hooks/useFetch';
import { createNoticia, eliminarNoticia, getCategorias, getNoticias, updateNoticia, uploadFile } from '../../../utils/dataFetchers';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { formatDate, formatedDate, URLImages } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { FaArrowDownWideShort } from "react-icons/fa6";
import ModalDelete from '../../../components/Modals/ModalDelete/ModalDelete';
import { CiWarning } from "react-icons/ci";
import imageCompression from 'browser-image-compression';
import { GoSortAsc, GoSortDesc } from "react-icons/go";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Noticias = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const [refresh, setRefresh] = useState(false);

    const { data: categorias, loading: categoriasLoading, error: categoriasError } = useFetch(getCategorias);
    const { data: noticias, loading: noticiasLoading, error: noticiasError } = useFetch(getNoticias, null, refresh);

    const [loading, setLoading] = useState(false)

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const [idNoticia, setIdNoticia] = useState(null);
    const [categoriasSelected, setCategoriasSelected] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [oldImage, setOldImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [img, setImg] = useState("");
    const [error, setError] = useState(false);

    const [originalTitle, setOriginalTitle] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [originalCategoriasSelected, setOriginalCategoriasSelected] = useState([]);
    const [originalOldImage, setOriginalOldImage] = useState('');

    const [isDisabledButtonEdit, setIsDisabledButtonEdit] = useState(true);

    const [limitNew, setLimitNew] = useState(1);

    const viewMore = () => {
        setLimitNew(prev => prev + 1);
    }

    const viewLess = () => {
        setLimitNew(prev => Math.max(1, prev - 1));
    }

    const [sortOrder, setSortOrder] = useState(true);

    const toggleSortOrder = () => {
        setSortOrder(prev => !prev);
    }

    useEffect(() => {
        const hasChanges =
            title !== originalTitle ||
            content !== originalContent ||
            previewImage !== originalOldImage ||
            JSON.stringify(categoriasSelected) !== JSON.stringify(originalCategoriasSelected);
    
            setIsDisabledButtonEdit(!hasChanges);
    }, [title, content, previewImage, categoriasSelected, originalTitle, originalContent, originalOldImage, originalCategoriasSelected]);
    

    const openCreateModal = () => {
        setOpenModalCreate(true)
    }

    const closeCreateModal = () => {
        setOpenModalCreate(false);

        setPreviewImage("");
        setImg("");
        setTitle('');
        setContent('');
        setCategoriasSelected([]);
    }

    const openDeleteModal = (id_noticia) => {
        setOpenModalDelete(true)
        setIdNoticia(id_noticia)
    }

    const closeDeleteModal = () => {
        setOpenModalDelete(false);
        setIdNoticia(null)
    }

    const openEditModal = (id_noticia) => {
        setOpenModalEdit(true);
        setIdNoticia(id_noticia);
    
        const noticia = noticias.find((noticia) => noticia.id_noticia === id_noticia);
    
        const categorias = noticia.categorias.split(',').map((categoria) => {
            const [id] = categoria.split('_');
            return id.toString();
        });
    
        setTitle(noticia.noticia_titulo);
        setContent(noticia.noticia_contenido);
        setCategoriasSelected(categorias);
        setPreviewImage(noticia.noticia_img);
        setOldImage(noticia.noticia_img);
    
        // Guardar los valores originales
        setOriginalTitle(noticia.noticia_titulo);
        setOriginalContent(noticia.noticia_contenido);
        setOriginalCategoriasSelected(categorias);
        setOriginalOldImage(noticia.noticia_img);
    };
    
    const closeEditModal = () => {
        setOpenModalEdit(false);
        setIdNoticia(null)

        setTitle('');
        setContent('');
        setPreviewImage("");
        setImg("");
        setOldImage('');
        setCategoriasSelected([]);
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {

                // Configuración de la compresión
                const options = {
                    maxSizeMB: 1, // Tamaño máximo del archivo en MB
                    maxWidthOrHeight: 800, // Dimensiones máximas
                    useWebWorker: true, // Usar un worker para mejorar el rendimiento
                };
    
                // Comprimir la imagen
                const compressedFile = await imageCompression(file, options);
    
                // Tamaño comprimido en MB
                const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);

                if (compressedSizeMB > MAX_FILE_SIZE) {
                    toast.error("El tamaño de la imagen no debe superar los 5 MB.");
                    setError(true);
                    return;
                }

                // Actualiza el estado con la imagen comprimida
                setImg(compressedFile);
    
                // Generar vista previa de la imagen
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(compressedFile);
    
                setError(false);
            } catch (error) {
                console.error("Error al comprimir la imagen:", error);
                toast.error("Error al procesar la imagen. Intente nuevamente.");
                setError(true);
            }
        }
    };
    
    const onChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    const onChangeCategoria = (event) => {
        const value = event.target.value;
        if (categoriasSelected.includes(value)) {
            setCategoriasSelected(categoriasSelected.filter(item => item !== value));
        } else {
            setCategoriasSelected([...categoriasSelected, value]);
        }
    };

    const isDisabledButton = title.trim().length === 0 ||categoriasSelected.length === 0 ||previewImage.length === 0 || !content.replace(/<(.|\n)*?>/g, '').trim();

    const handleSaveNew = async () => {
        try {
            setLoading(true);
            if (isDisabledButton) {
                toast.error("Debe completar todos los campos para crear la noticia");
                return;
            }

            const uploadResponse = await uploadFile(img, 'Noticias');
            if (!uploadResponse || !uploadResponse.path) {
                toast.error("Error al subir la imagen. Intente nuevamente.");
                return;
            }

            const data = {
                title,
                content,
                categorias: categoriasSelected,
                img: `/uploads/Noticias/${img.name}`
            };

            const res = await createNoticia(data, token);
            setRefresh(prev => !prev);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.mensaje);
            }
        } catch (error) {
            console.error("Error al guardar la noticia:", error);
            toast.error("Ocurrió un error inesperado. Intente nuevamente más tarde.");
        } finally {
            setLoading(false);
            closeCreateModal();
        }
    };

    const deleteNoticia = async () => { 
        try {
            setLoading(true);
            const res = await eliminarNoticia(idNoticia, token);
            setRefresh(prev => !prev);

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.mensaje);
            }
        } catch (error) {
            console.error("Error al eliminar la noticia:", error);
            toast.error("Ocurrió un error inesperado. Intente nuevamente más tarde.");
        } finally {
            closeDeleteModal();
            setLoading(false);
        }
    }

    const editNoticia = async () => {
        try {
            setLoading(true);
            if (isDisabledButtonEdit || isDisabledButton) {
                toast.error("Debe completar todos los campos para editar la noticia");
                return;
            }

            if (previewImage !== originalOldImage) {
                const uploadResponse = await uploadFile(img, 'Noticias');
                if (!uploadResponse || !uploadResponse.path) {
                    toast.error("Error al subir la imagen. Intente nuevamente.");
                    return;
                }
            }

            const data = {
                id_noticia: idNoticia,
                title,
                content,
                categorias: categoriasSelected,
                img: img ? `/uploads/Noticias/${img.name}` : `/uploads/Noticias/${img.previewImage}`
            };

            const res = await updateNoticia(data, token);
            setRefresh(prev => !prev);

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.mensaje);
            }
        } catch (error) {
            console.error("Error al guardar la noticia:", error);
            toast.error("Ocurrió un error inesperado. Intente nuevamente más tarde.");
        } finally {
            setLoading(false);
            closeEditModal();
        }
    };

    const goToNew = (id_noticia) => {
        navigate(`/admin/noticias/${id_noticia}`);
    };

    if (noticiasLoading) {
        return (
            <Content>
                <ActionsCrud>
                    <ActionsCrudButtons>
                        <Button>
                        <Skeleton width="10rem" height='2rem'></Skeleton>
                        </Button>

                        <Button>
                        <Skeleton width="5rem" height='2rem'></Skeleton>
                        </Button>
                    </ActionsCrudButtons>
                </ActionsCrud>
                <NoticiasContainerStyled>
                    <NoticiasContainer>
                    <NoticiaInfoContainer>
                        <Skeleton size="7.5rem"></Skeleton>
                        <NoticiasTextoContainer>
                            <NoticiasFecha> <Skeleton width="5rem" height='1rem'></Skeleton> </NoticiasFecha>
                            <NoticiaTitulo>  <Skeleton width="10rem" height='3rem'></Skeleton> </NoticiaTitulo>
                            <NoticiasCategoriasContainer>
                                <Skeleton width="5rem" height='1rem'></Skeleton>
                                <Skeleton width="5rem" height='1rem'></Skeleton>
                                <Skeleton width="5rem" height='1rem'></Skeleton>
                            </NoticiasCategoriasContainer>
                        </NoticiasTextoContainer>
                    </NoticiaInfoContainer>
                    <NoticiasActionsContainer>
                        <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
                        <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
                        <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
                    </NoticiasActionsContainer>
                </NoticiasContainer>
                </NoticiasContainerStyled>
            </Content>
        )
    }

    const sortedNews = noticias.sort((a, b) => {
        const timeA = new Date(a.noticia_fecha_creacion);
        const timeB = new Date(b.noticia_fecha_creacion);
        return sortOrder ? timeB - timeA : timeA - timeB;
    });

    return (
        <Content>
            <ContentTitle>Noticias</ContentTitle>
            <ActionsCrud>
                <ActionsCrudButtons>
                    <Button bg="success" color="white" onClick={openCreateModal}>
                        <FiPlus />
                        <p>Nueva noticia</p>
                    </Button>
                    <Button bg="export" color="white" onClick={toggleSortOrder}>
                        {
                            sortOrder ? (
                                <GoSortDesc />
                            ) : (
                                <GoSortAsc />
                            )
                        }
                        <p>Ordenar por fecha</p>
                    </Button>
                </ActionsCrudButtons>
            </ActionsCrud>
            <NoticiasContainerStyled>
                {
                    noticias && noticias.length === 0 && (
                        <>No hay noticias disponibles</>
                    )
                }
                {
                    sortedNews
                    .slice(0, limitNew)
                    .map((noticia) => (
                        <NoticiasContainer key={noticia.id_noticia}>
                            <NoticiaInfoContainer>
                                <NoticiaImagen src={`${URLImages}${noticia.noticia_img}`} />
                                <NoticiasTextoContainer>
                                    <NoticiasFecha>{formatedDate(noticia.noticia_fecha_creacion)}</NoticiasFecha>
                                    <NoticiaTitulo>{noticia.noticia_titulo}</NoticiaTitulo>
                                    <NoticiasCategoriasContainer>
                                        {
                                            noticia.categorias.split(',').map((categoria) => {
                                                const [id, nombre] = categoria.split('_');
                                                return (
                                                    <NoticiaTexto key={id}>{nombre}</NoticiaTexto>
                                                );
                                            })
                                        }
                                    </NoticiasCategoriasContainer>
                                </NoticiasTextoContainer>
                            </NoticiaInfoContainer>
                            <NoticiasActionsContainer>
                                <NoticiasActions className='eye'
                                    onClick={() => goToNew(noticia.id_noticia)}
                                > <FaEye /> </NoticiasActions>
                                <NoticiasActions className='pencil' onClick={() => openEditModal(noticia.id_noticia)}> <FaPencilAlt /> </NoticiasActions>
                                <NoticiasActions className='trash' onClick={() => openDeleteModal(noticia.id_noticia)}> <FaTrash /> </NoticiasActions>
                            </NoticiasActionsContainer>
                        </NoticiasContainer>
                    ))
                }
                <ButtonsContaier>
                    {
                        limitNew > 1 && (
                            <ButtonStyled onClick={viewLess} className='less'>Ver menos</ButtonStyled>
                        )
                    }
                    {
                        noticias && noticias.length > limitNew && (
                            <ButtonStyled onClick={viewMore} className='more'>Ver mas</ButtonStyled>
                        )
                    }
                </ButtonsContaier>
            </NoticiasContainerStyled>

            {
                openModalCreate && <>
                    <ModalNoticias initial={{ opacity: 0 }}
                        animate={{ opacity: openModalCreate ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        title={`Crea una noticia`}
                        closeModal={closeCreateModal}
                        buttons={
                            <>
                                <Button color={"danger"} onClick={closeCreateModal}>
                                    <IoClose />
                                    Cancelar
                                </Button>
                                <Button color={"success"} disabled={isDisabledButton} onClick={handleSaveNew}>
                                    {loading ? (
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
                                <ModalFormLeft>
                                    <ModalFormInputContainer>
                                        Seleccione una imagen
                                        <ModalFormInputImg>
                                            {previewImage && <img src={previewImage} alt="Vista previa" style={{ width: '80px', height: '80px' }} />}
                                            <Input
                                                type='file'
                                                accept="image/*"
                                                onChange={(event) => handleImageUpload(event)}
                                                icon={<MdOutlineImage className='icon-input' />}
                                            />
                                        </ModalFormInputImg>
                                        {
                                            error && (
                                                <p className="error"> <CiWarning /> El tamaño de la imagen no debe superar los 5 MB.</p>
                                            )
                                        }
                                    </ModalFormInputContainer>
                                    <ModalFormInputContainer>
                                        Titulo
                                        <Input
                                            type='text'
                                            placeholder="Escriba el titulo para la noticia"
                                            value={title}
                                            onChange={onChangeTitle}
                                            icon={<FaRegNewspaper className='icon-input' />}
                                        />
                                    </ModalFormInputContainer>

                                    <ModalFormInputContainer className='categoria'>
                                        Seleccione la/las categoria/s
                                        {
                                            categorias && categorias.map((categoria) => (
                                                <CheckboxContainer key={categoria.id_categoria}>
                                                    <StyledCheckbox
                                                        type="checkbox"
                                                        name={categoria.nombre}
                                                        id={categoria.id_categoria}
                                                        value={categoria.id_categoria}
                                                        onChange={onChangeCategoria}
                                                    />
                                                    <CheckboxLabel>{categoria.nombre}-{categoria.genero}</CheckboxLabel>
                                                </CheckboxContainer>
                                            ))
                                        }
                                    </ModalFormInputContainer>
                                </ModalFormLeft>

                                <ModalFormRight>
                                    <ModalFormInputContainer>
                                        Contenido de la noticia
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            placeholder="Escribe aquí el contenido de la noticia..."
                                            style={{ height: '200px' }}
                                        />
                                    </ModalFormInputContainer>
                                </ModalFormRight>

                            </>
                        }
                    />
                    <Overlay onClick={closeCreateModal} />
                </>
            }
            {
                openModalDelete && <>
                <ModalDelete initial={{ opacity: 0 }}
                    animate={{ opacity: openModalDelete ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    text={`¿Estas seguro que deseas eliminar esta noticia?`}
                    onClickClose={closeDeleteModal}
                    buttons={
                        <>
                            <Button color={"danger"} onClick={closeDeleteModal}>
                                <IoClose />
                                No
                            </Button>
                            <Button color={"success"} onClick={deleteNoticia}>
                                {
                                    loading ? (
                                        <>
                                            <LoaderIcon size="small" color='green' />
                                        </>
                                    ) : (
                                        <>
                                            <IoCheckmark />
                                            Si
                                        </>
                                    )
                                }
                            </Button>
                        </>
                    }
                />
                <Overlay onClick={closeDeleteModal} />
                </>
            }
            {
                openModalEdit && <>
                <ModalNoticias initial={{ opacity: 0 }}
                    animate={{ opacity: openModalEdit ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    title={`Crea una noticia`}
                    closeModal={closeEditModal}
                    buttons={
                        <>
                            <Button color={"danger"} onClick={closeEditModal}>
                                <IoClose />
                                Cancelar
                            </Button>
                            <Button color={"success"} disabled={isDisabledButton || isDisabledButtonEdit} onClick={editNoticia}>
                                {loading ? (
                                    <>
                                        <LoaderIcon size="small" color='green' />
                                        Actualizando
                                    </>
                                ) : (
                                    <>
                                        <IoCheckmark />
                                        Actualizar
                                    </>
                                )}
                            </Button>
                        </>
                    }
                    form={
                        <>
                            <ModalFormLeft>
                                <ModalFormInputContainer>
                                    Seleccione una imagen
                                    <ModalFormInputImg>
                                        {img ? <img src={previewImage} alt="Vista previa" style={{ width: '80px', height: '80px' }} />
                                            : <img src={`${URLImages}${oldImage}`} alt="Vista previa" style={{ width: '80px', height: '80px' }} />
                                        }
                                        <Input
                                            type='file'
                                            accept="image/*"
                                            onChange={(event) => handleImageUpload(event)}
                                            icon={<MdOutlineImage className='icon-input' />}
                                        />
                                    </ModalFormInputImg>
                                    {
                                        error && (
                                            <p className="error"> <CiWarning /> El tamaño de la imagen no debe superar los 5 MB.</p>
                                        )
                                    }
                                </ModalFormInputContainer>
                                <ModalFormInputContainer>
                                    Titulo
                                    <Input
                                        type='text'
                                        placeholder="Escriba el titulo para la noticia"
                                        value={title}
                                        onChange={onChangeTitle}
                                        icon={<FaRegNewspaper className='icon-input' />}
                                    />
                                </ModalFormInputContainer>

                                <ModalFormInputContainer>
                                    Seleccione la/las categoria/s
                                    {
                                        categorias && categorias.map((categoria) => (
                                            <CheckboxContainer key={categoria.id_categoria}>
                                                <StyledCheckbox
                                                    type="checkbox"
                                                    name={categoria.nombre}
                                                    id={categoria.id_categoria}
                                                    value={categoria.id_categoria}
                                                    onChange={onChangeCategoria}
                                                    checked={categoriasSelected.includes(categoria.id_categoria.toString())}
                                                />
                                                <CheckboxLabel>{categoria.nombre}-{categoria.genero}</CheckboxLabel>
                                            </CheckboxContainer>
                                        ))
                                    }
                                </ModalFormInputContainer>
                            </ModalFormLeft>

                            <ModalFormRight>
                                <ModalFormInputContainer>
                                    Contenido de la noticia
                                    <ReactQuill
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        placeholder="Escribe aquí el contenido de la noticia..."
                                        style={{ height: '200px' }}
                                    />
                                </ModalFormInputContainer>
                            </ModalFormRight>

                        </>
                    }
                />
                <Overlay onClick={closeEditModal} />
                </>
            }
            <Toaster />
        </Content>
    )
}

export default Noticias