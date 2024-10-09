import React, { useState, useEffect } from "react";
import { ChatContainer, ChatWrapper, Counter, ChatBox, ChatMessage, ChatHeader, ChatIcon } from "./ChatNovedadesStyles";
import { FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { traerNovedades } from '../../utils/dataFetchers';
import { useAuth } from '../../Auth/AuthContext';
import IsotipoCR from "/Logos/CR-Logo.png";

const ChatNovedades = () => {
  const [novedades, setNovedades] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { id_rol } = useAuth();

  // Define una función para obtener el rol o un valor por defecto
  const returnRole = (rol) => rol || 3;

  // Efecto para cargar novedades al inicializar y cada vez que cambia id_rol
  useEffect(() => {
    const fetchData = async () => {
      try {
        const novedadesData = await traerNovedades(returnRole(id_rol));
        setNovedades(novedadesData);

        // Actualiza el conteo de mensajes no leídos solo si el chat está cerrado
        if (!isOpen) {
          setUnreadMessages(novedadesData.length); // Considera todos los mensajes como no leídos
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id_rol, isOpen]);

  // Alterna el estado del chat
  const toggleChat = () => {
    setIsOpen(prevState => {
      if (!prevState) {
        // Si se abre el chat, marca todos los mensajes como leídos
        setUnreadMessages(0); // Restablece el contador de mensajes no leídos a 0
      }
      return !prevState;
    });
  };

  // Obtiene el ícono según el tipo de novedad
  const getIconByType = (tipo) => {
    switch (tipo) {
      case "I": return <FaInfoCircle style={{ color: 'var(--green)' }} />;
      case "A": return <FaExclamationTriangle style={{ color: 'var(--green)' }} />;
      default: return <FaExclamationCircle style={{ color: 'var(--green)' }} />;
    }
  };

  return (
    <ChatContainer>
      {/* <ChatWrapper onClick={toggleChat} isOpen={isOpen}>
        <img src={IsotipoCR} alt="Logo" />
        {!isOpen && <Counter><FaExclamationTriangle/></Counter>}
      </ChatWrapper>

      <ChatBox isOpen={isOpen}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ChatHeader>Novedades</ChatHeader>
        </div>

        {novedades?.map((novedad, index) => (
          <ChatMessage key={index}>
            <ChatIcon>
              {getIconByType(novedad.tipo)}
            </ChatIcon>
            {novedad.mensaje}
          </ChatMessage>
        ))}
      </ChatBox> */}
    </ChatContainer>
  );
};

export default ChatNovedades;
