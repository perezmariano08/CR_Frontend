import styled, { keyframes }  from 'styled-components';
import { NavLink } from 'react-router-dom';

export const HomeContainerStyled = styled.div`
    display: flex;
    justify-content: center;
    gap: 40px;
    width: 100%;
`;

export const HomeWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: start;
    gap: 16px;
    justify-content: space-between;
    max-width: 1260px;
    padding: 24px 30px;
    
    &.planilla {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    @media (max-width: 1160px) {
        gap: 20px;
        flex-direction: column;
    }  

    @media (max-width: 568px) {
        padding: 20px;
    }
`;

export const HomeLeftWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
    @media (max-width: 1160px) {
        width: 30%;
    }  
    @media (max-width: 968px) {
        display: none;
    }  
`;

export const HomeMediumWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 500px;
    gap: 20px;
    @media (max-width: 1160px) {
        width: 70%;
        max-width: 100%;
    }  

    @media (max-width: 968px) {
        width: 100%;
        min-width: auto;
    }  
`;

export const HomeWrapperPlanillero = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 500px;
    gap: 20px;
    @media (max-width: 1160px) {
        width: 70%;
        max-width: 100%;
    }  

    @media (max-width: 968px) {
        width: 100%;
        min-width: auto;
    }  
`;

// Definir la animación
const pulseAnimation = keyframes`
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
`;

export const CircleLive = styled.span`
    margin-left: 5px;
    margin-bottom: 1px;
    display: inline-block;
    width: 6px; /* Ajusta el tamaño del círculo */
    height: 6px; /* Ajusta el tamaño del círculo */
    border-radius: 50%; /* Hace el elemento un círculo */
    background-color: red; /* Color del círculo */
    animation: ${pulseAnimation} 1s infinite; /* Aplicar la animación */
`;

export const HomeRightWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 40px;
    h2 {
        display: none
    }
    @media (max-width: 1160px) {
        width: 100%;
        h2 {
            display: flex;
        }
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

export const ViewMoreWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ViewMore = styled.a`
    display: flex;
    align-items: center;
    width: fit-content;
    justify-content: center;
    background-color: var(--green);
    padding: 8px 16px;
    border-radius: 20px;
    transition: all .1s ease-in-out;
    cursor: pointer;
    color: var(--black);

    &.menos {
        background-color: transparent;
        border: 1px solid var(--white);
        color: var(--white);
    }
    &:hover {
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const TopContainer = styled.div`
    display: flex;
    width: 100%;
    /* justify-content: space-between; */
    gap: 20px;
    align-items: center;

    .toggle-switch {
        position: relative;
        width: 50px;
        height: 24px;
    }

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--green);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Opcional: Estilo para hacerlo redondo */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

`

export const CategoriasListaWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--black-900);
    border-radius: 20px;
    overflow: hidden;
`

export const CategoriasListaTitulo = styled.div`
    padding: 16px 24px;
    border-bottom: 1px solid var(--black-800);
    display: flex;
    flex-direction: column;
    gap: 5px;
    p {
        font-weight: 700;
    }

    span {
        font-size: 12px;
        color: var(--green);
        text-transform: uppercase;
    }
`

export const CategoriasItemsWrapper = styled.div`
    padding: 8px 0;
    display: flex;
    flex-direction: column;
`

export const CategoriasItem = styled(NavLink)`
    padding: 8px 24px;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: var(--white);
    &:hover {
        background-color: var(--black-800);
    }
`

export const SectionHome = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 20px;
    
    &.planilla {
        width: 100%;
    }
`

export const SectionHomeTitle = styled.div`
    display: flex;
    padding: 16px 24px;
    font-weight: 700;
    background-color: var(--black-800);
    gap: 5px;
    span {
        color: var(--black-300);
    }
`

export const CardPartidosDia = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    background-color: var(--black-900);
`

export const CardPartidosDiaTitle = styled.div`
    padding: 16px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--black-800);
    font-weight: 600;
`

export const PartidosDiaFiltrosWrapper = styled.div`
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 10px;
`

export const PartidosDiaFiltro = styled.button`
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    background-color: var(--black-800);
    border: none;
    cursor: pointer;
    transition: all .1s ease-in-out;

    &.active {
        background-color: var(--black-50);
        color: var(--black-950);
    }

    &:hover {
        background-color: var(--black-700);

        &.active {
            background-color: var(--black-50);
        }
    }
`