import styled from 'styled-components';

export const Container = styled.div`
  display: flex; /* Flexbox para centrar */
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  position: relative;
  width: 200px;
  height: 300px;
  overflow: hidden; /* Por si el SVG excede el tamaño del contenedor */
`;

export const SvgWrapper = styled.div`
  display: flex; /* Flexbox para centrar el SVG */
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const TextOverlay = styled.div`
  position: absolute;
  bottom: 13%; /* Ajusta según el diseño deseado */
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  width: 50%; /* Control del ancho */
`;

export const ImageOverlay = styled.img`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 80px; /* Tamaño de la imagen */
  height: auto;
`;
