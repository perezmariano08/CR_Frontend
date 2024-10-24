import styled, { keyframes }  from 'styled-components';

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
    gap: 30px;
    justify-content: space-between;
    max-width: 1260px;
    padding: 40px 30px;
    
    &.planilla {
        flex-direction: column;
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
    min-width: 20%;
    gap: 40px;
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
    max-width: 50%;
    gap: 40px;
    @media (max-width: 1160px) {
        width: 70%;
        max-width: 100%;
    }  

    @media (max-width: 968px) {
        width: 100%;
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
    min-width: 20%;
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