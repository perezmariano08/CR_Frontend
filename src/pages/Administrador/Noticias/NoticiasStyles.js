import styled from "styled-components";

export const NoticiasUserContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 1rem;
`

export const NoticiasContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: var(--gray-400);
    border-radius: 10px;
    gap: 1rem;

    &.user {
        background-color: transparent;
    }
`;

export const NoticiasContainer = styled.div`
    display: flex;
    align-items: stretch; /* Asegura que los hijos ocupen todo el alto del contenedor */
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
    background-color: var(--gray-300);
    border-radius: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    &.home {
        background-color: transparent;
        border-bottom: 1px solid var(--gray-300);
        border-radius: 0px;
        cursor: pointer;
        transition: all .2s ease-in-out;

        &:hover { 
            opacity: 0.5;
        }
    }

    &.user { 
    background-color: var(--gray-400);

    }
`;

export const NoticiaInfoContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 75%;
    gap: 20px;

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: column;
        align-items: start
    }

    &.home {
        width: 100%;
    }

    &.user { 
        margin-left: 10px;
    }
`;

export const NoticiasTextoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
`;

export const NoticiaImagen = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 10px;
    object-fit: cover;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const NoticiasFecha = styled.p`
    font-size: 12px;
    font-weight: 700;
    color: var(--gray-200);
`;

export const NoticiaTitulo = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-100);
    width: 60%;

    @media (max-width: 1025px) {
        width: 100%;
    }

    @media (max-width: 768px) {
        width: 100%;
        text-align: start;
    }

    &.home {
        font-size: 15px;
        width: 100%;
    }
`;

export const NoticiasCategoriasContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
`;

export const NoticiaTexto = styled.p`
    font-size: 12px;
    font-weight: 700;
    color: var(--gray-300);
    background-color: var(--green);
    padding: 8px 10px;
    border-radius: 19px;

    &.home {
        font-size: 10px;
        padding: 6px 8px;
    }
`;

export const NoticiasActionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;
    gap: 10px;

    @media (max-width: 768px) {
        align-items: end;
        justify-content: start;
        flex-direction: row;
        height: auto;
        width: 100%;
    }

    &.user { 
        align-items: center;
        justify-content: center;
    }
`;

export const NoticiasActions = styled.span`
    background-color: var(--gray-200);
    border-radius: 50%;
    width: 35px;
    height: 35px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.2s ease-in-out;

    &:hover {
        opacity: 0.7;
    }

    &.eye {
        background-color: var(--export);
    }
    &.pencil {
        background-color: var(--import);
    }
    &.trash {
        background-color: var(--danger);
    }
`;

export const NoticiaContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    &.user {
        padding: 50px;
    }
`

export const NoticiaHero = styled.div`
    width: 100%;
    height: 350px;
    object-fit: cover;
    position: relative;
    border-radius: 20px;

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
        border-radius: 20px;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
        border-radius: 20px;

    }

    @media (max-width: 768px) {
        width: 100%;
        /* height: auto; */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
`
export const NoticiaTitle = styled.h3`
    font-size: 40px;
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: start;
    width: 100%;
    padding: 0 80px;
    z-index: 2;
    font-weight: 700;

    @media (max-width: 768px) {
        width: 100%;
        font-size: 30px;
    }
`
export const NoticiaCategorias = styled.div`
    display: flex;
    gap: 10px;
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 100%;
    padding: 0 80px;
`;

export const Categorias = styled.div`
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    
    gap: 10px;
    font-size: 14px;
    background-color: var(--green);
    padding: 8px 10px;    
    border-radius: 19px;
    text-align: center;
    width: fit-content;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

export const NoticiaBody = styled.div`
    width: 100%;
    justify-content: start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px;

    &.noticia-body h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

&.noticia-body h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

&.noticia-body p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
}

&.noticia-body a {
    text-decoration: none;
}

&.noticia-body a:hover {
    text-decoration: underline;
}

&.noticia-body ul {
    padding-left: 20px;
}

&.noticia-body li {
    margin-bottom: 0.5rem;
}

&.noticia-body img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin: 1rem 0;
}
`
export const BackContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 0 10px;
    color: var(--green);
    cursor: pointer;
    transition: all .2s ease-in-out;
    margin-bottom: 20px;
    &:hover {
        opacity: 0.5;
    }

    p {
        font-size: 14px;
        font-weight: 400;
    }

    svg {
        font-size: 18px;
    }
`

export const ViewMoreNews = styled.a`
    width: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gray-200);
    padding: 10px 0;
    cursor: pointer;

    &:hover { 
        text-decoration: underline;
    }
`
export const ButtonsContaier = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
`

export const Button = styled.button`
    min-width: 100px;
    background-color: transparent;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 14px;
    color: var(--gray-100);
    cursor: pointer;
    border: 1px solid var(--gray-300);
    transition: all .2s ease-in-out;

    &:hover { 
        background-color: var(--gray-300);

    }

    &.more {
        background-color: var(--gray-300);
        border: 1px solid var(--gray-300);

        &:hover { 
            background-color: transparent;
        }
    }
`