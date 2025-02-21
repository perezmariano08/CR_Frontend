import styled from "styled-components";

// Contenedor principal
export const LayoutContainerStyled = styled.main`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

// Contenedor privado que utiliza flexbox para alinear el contenido
export const PrivateLayoutContainerStyled = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 100vh;
`;

// Contenedor auxiliar para el layout (puedes agregar contenido aquí)
export const LayoutAuxContainerStyled = styled.main`
    width: 100%;
    padding-top: 20px;
    flex-grow: 1; /* Esto hace que el contenido ocupe el espacio disponible */
`;

// Contenedor para el layout admin
export const LayoutAdminContainerStyled = styled.main`
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
`;

// Estilo del footer
export const Footer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: var(--gray-200);
    height: 60px;
    font-size: 14px;
    padding: 0 20px;
    text-align: center;
    margin-top: auto;

    @media (max-width: 968px) {
        font-size: 12px;
        padding-top: 20px;
    }
`
