import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { FaEye } from "react-icons/fa";
import { Button, ButtonsContaier, NoticiaImagen, NoticiaInfoContainer, NoticiasActions, NoticiasActionsContainer, NoticiasCategoriasContainer, NoticiasContainer, NoticiasContainerStyled, NoticiasFecha, NoticiasTextoContainer, NoticiasUserContainer, NoticiaTexto, NoticiaTitulo } from '../../Administrador/Noticias/NoticiasStyles';
import { formatedDate, URLImages } from '../../../utils/utils';
import useFetch from '../../../hooks/useFetch';
import { getNoticias } from '../../../utils/dataFetchers';

const Noticias = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();

    const { data: noticias, loading: noticiasLoading } = useFetch(getNoticias);
    const [visibleNoticias, setVisibleNoticias] = useState(1);

    const goToNew = (id_noticia) => {
        navigate(`/noticias/${id_noticia}`, { state: { from: location.pathname } });
    };

    const handleLoadMore = () => {
        setVisibleNoticias((prev) => prev + 1);
    };

    const handleShowLess = () => {
        setVisibleNoticias((prev) => Math.max(1, prev - 1));
    };

    if (noticiasLoading) {
        return (
            <NoticiasUserContainer>
                <NoticiasContainerStyled className='user'>
                    {[...Array(3)].map((_, index) => (
                        <NoticiasContainer key={index}>
                            <NoticiaInfoContainer>
                                <Skeleton size="7.5rem"></Skeleton>
                                <NoticiasTextoContainer>
                                    <NoticiasFecha>
                                        <Skeleton width="5rem" height='1rem'></Skeleton>
                                    </NoticiasFecha>
                                    <NoticiaTitulo>
                                        <Skeleton width="10rem" height='3rem'></Skeleton>
                                    </NoticiaTitulo>
                                    <NoticiasCategoriasContainer>
                                        <Skeleton width="5rem" height='1rem'></Skeleton>
                                        <Skeleton width="5rem" height='1rem'></Skeleton>
                                        <Skeleton width="5rem" height='1rem'></Skeleton>
                                    </NoticiasCategoriasContainer>
                                </NoticiasTextoContainer>
                            </NoticiaInfoContainer>
                            <NoticiasActionsContainer>
                                <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
                            </NoticiasActionsContainer>
                        </NoticiasContainer>
                    ))}
                </NoticiasContainerStyled>
            </NoticiasUserContainer>
        );
    }

    return (
        <NoticiasUserContainer>
            <NoticiasContainerStyled className='user'>
                {
                    noticias && noticias.length === 0 && (
                        <>No hay noticias disponibles</>
                    )
                }
                {
                    noticias &&
                    noticias
                        .slice(0, visibleNoticias) // Mostrar solo las noticias visibles según el estado
                        .map((noticia) => (
                            <NoticiasContainer key={noticia.id_noticia} className='user'>
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
                                <NoticiasActionsContainer className='user'>
                                    <NoticiasActions className='eye' onClick={() => goToNew(noticia.id_noticia)}> <FaEye /> </NoticiasActions>
                                </NoticiasActionsContainer>
                            </NoticiasContainer>
                        ))
                }
                <ButtonsContaier>
                    {
                        visibleNoticias > 1 && (
                            <Button onClick={handleShowLess}>
                                Ver menos
                            </Button>
                        )
                    }
                    {
                        noticias && visibleNoticias < noticias.length && (
                            <Button onClick={handleLoadMore} className='more'>
                                Ver más
                            </Button>
                        )
                    }
                </ButtonsContaier>
            </NoticiasContainerStyled>
        </NoticiasUserContainer>
    );
};

export default Noticias;
