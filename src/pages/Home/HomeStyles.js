import styled from 'styled-components';

export const HomeContainerStyled = styled.div`
    /* General styles */
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
    max-width: 1200px; /* Ajusta este valor si necesitas un ancho máximo */
    margin: 0 auto; /* Centra horizontalmente el contenedor */

    /* Estilos para pantallas de 600px o más */
    @media (min-width: 600px) {
        /* Centrar todo el contenido dentro de la pantalla */
        align-items: center;
    }
`;

export const HomeWrapper = styled.div`
    flex-direction: column;
    gap: 40px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto; /* Centra el contenedor horizontalmente */

    /* Estilos para pantallas de 600px o más */
    @media (min-width: 600px) {
        /* Centrar el contenedor dentro de su contenedor padre */
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const CardsMatchesContainer = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: hidden;
    padding-bottom: 20px;
    width: 100%;

    @media (min-width: 600px) {
        margin: 0 auto;
    }
`;

export const CardsMatchesWrapper = styled.div`
    display: flex;
    gap: 20px;
    height: 100%;
    overflow-x: auto;
    padding: 0px 0 15px 0;
    width: 100%;

    @media (min-width: 600px) {
        margin: 0 auto;
    }
`;

export const ViewMore = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & a {
        color: var(--gray-200);
    }
    
    & a:hover {
        color: var(--gray-300);
    }
`;
