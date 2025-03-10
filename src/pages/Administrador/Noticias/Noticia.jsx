import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import Content from '../../../components/Content/Content'
import { ContentTitle } from '../../../components/Content/ContentStyles'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getNoticiaId } from '../../../utils/dataFetchers';
import useFetch from '../../../hooks/useFetch';
import { BackContainer, Categorias, NoticiaBody, NoticiaCategorias, NoticiaContainer, NoticiaHero, NoticiasFecha, NoticiaTexto, NoticiaTitle } from './NoticiasStyles';
import { formatedDate, URLImages } from '../../../utils/utils';
import { FaArrowLeft } from "react-icons/fa";
import { Skeleton } from 'primereact/skeleton';
import DOMPurify from 'dompurify';

const Noticia = () => {
    const id_noticia = useParams().id_noticia
    const navigate = useNavigate();

    const { data: noticiaFetch, loading: noticiaLoading, error: noticiaError } = useFetch(getNoticiaId, id_noticia);
    const noticia = noticiaFetch?.[0];

    const backToNews = () => {
        navigate(`/admin/noticias`);
    }

    if (noticiaLoading) {
        return (
            <Content>
                <NoticiaContainer>
                    <BackContainer onClick={backToNews}> <FaArrowLeft /> <p>Volver</p> </BackContainer>
                    <NoticiaHero>
                        <Skeleton width="100%" height="250px" borderRadius='20px' color='var(--gray-400)'></Skeleton>
                        <NoticiaTitle> <Skeleton width="100%" height="3rem"></Skeleton> </NoticiaTitle>
                        <NoticiaCategorias>
                            <Skeleton width="5rem" height='1rem'></Skeleton>
                            <Skeleton width="5rem" height='1rem'></Skeleton>
                            <Skeleton width="5rem" height='1rem'></Skeleton>
                        </NoticiaCategorias>
                    </NoticiaHero>
                    <NoticiaBody>
                        <Skeleton width="100%" height="200px" borderRadius='20px'></Skeleton>
                    </NoticiaBody>
                </NoticiaContainer>
            </Content>
        )
    }

    return (    
        noticia && (
            <Content>
                <NoticiaContainer>
                    <BackContainer onClick={backToNews}> <FaArrowLeft /> <p>Volver</p> </BackContainer>
                    <NoticiaHero>
                        <img src={`${URLImages}${noticia.noticia_img}`} alt={noticia.noticia_titulo} />
                        <NoticiaTitle>{noticia.noticia_titulo}</NoticiaTitle>
                        <NoticiaCategorias>
                            {noticia.categorias.split(',').map((categoria) => {
                                const [id, nombre] = categoria.split('_');
                                return (
                                    <Categorias key={id}>{nombre}</Categorias>
                                );
                            })}
                        </NoticiaCategorias>
                    </NoticiaHero>
                    <NoticiaBody className='noticia-body'>
                        <NoticiasFecha>{formatedDate(noticia.noticia_fecha_creacion)}</NoticiasFecha>
                        <div 
                            dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(noticia.noticia_contenido) 
                            }} 
                        />
                    </NoticiaBody>
                </NoticiaContainer>
            </Content>
        )
    )
}

export default Noticia