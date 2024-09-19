import styled from "styled-components";

export const ChatContainer = styled.div`
  width: 100%;
  padding: 0 50px 20px 10px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: end;
  cursor: pointer;
  z-index: 100;
`;

export const ChatWrapper = styled.div`
  background-color: ${({ isOpen }) => (isOpen ? "var(--gray-500)" : "var(--green)")}; /* Cambio de color cuando se clickea */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ small }) => (small ? "40px" : "70px")};
  height: ${({ small }) => (small ? "40px" : "70px")};
  padding: 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: ${({ isOpen }) => (isOpen ? "360px" : "30px")}; /* Se ajusta para elevar el círculo dentro de la caja */
  right: 20px;
  transition: bottom 0.4s ease-in-out, background-color 0.3s ease-in-out;
  z-index: 101;
  @media (max-width: 968px) {
      right: 10px;
      bottom: 22px;
      width: ${({ small }) => (small ? "40px" : "60px")};
      height: ${({ small }) => (small ? "40px" : "60px")};
    }
  img {
    width: ${({ small }) => (small ? "20px" : "40px")};
  }
`;

export const Counter = styled.div`
  position: absolute;
  top: -5px;
  right: 10px;
  background-color: var(--white);
  color: var(--green-400);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
`;

export const ChatBox = styled.div`
  position: absolute;
  bottom: 30px;
  right: 20px;
  width: 300px;
  height: 400px; /* Alto fijo */
  max-height: ${({ isOpen }) => (isOpen ? "400px" : "0")};
  overflow: hidden;
  background-color: var(--gray-300);
  border-radius: 15px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out;
  padding: ${({ isOpen }) => (isOpen ? "20px" : "0")};
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto; /* Habilita el scroll si es necesario */
  z-index: 100;
`;

/* Encabezado "Novedades" */
export const ChatHeader = styled.div`
  background-color: var(--gray-400);
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: var(--gray-100);
  margin-bottom: 10px;
  flex: 1;
`;

/* Estilo para cada mensaje */
export const ChatMessage = styled.div`
  background-color: var(--gray-400);
  color: var(--gray-100);
  padding: 10px;
  border-radius: 0px 15px 15px 15px;
  font-size: 14px;
  max-width: 80%;
  align-self: flex-start;
  position: relative;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  /* Solapa de mensaje */
  &:before {
    content: "";
    position: absolute;
    top: 10px;
    left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent var(--gray-400) transparent transparent;
  }

  &:after {
    content: 'Sistema';
    font-size: 12px;
    position: absolute;
    top: -18px;
    left: 10px;
    color: var(--green);
  }
`;

/* Estilo para el ícono de cada mensaje */
export const ChatIcon = styled.div`
  margin-right: 10px;
  color: var(--green); /* Cambia el color del ícono */
  font-size: 18px;
`;
