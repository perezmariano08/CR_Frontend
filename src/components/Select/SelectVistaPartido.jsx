import React, { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { 
  SelectVistaPartidoWrapper, 
  SelectVistaPartidoHeader, 
  SelectVistaPartidoIcon, 
  SelectVistaPartidoOptions, 
  SelectVistaPartidoOption 
} from './SelectStyles';

const SelectVistaPartido = ({ vistaSeleccionada, setVistaSeleccionada, partidosDia }) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el menú

  const handleVistaChange = (value) => {
    setVistaSeleccionada(value);
    setIsOpen(false); // Cerrar el menú cuando se selecciona una opción
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Alternar el estado de apertura/cierre
  };

   return (
         <SelectVistaPartidoWrapper>
            {partidosDia.length > 0 ? (
            <SelectVistaPartidoHeader onClick={toggleMenu}>
               <span>{vistaSeleccionada === "dia" ? "Partidos de hoy" : "Ültima semana en CR"}</span>
               <SelectVistaPartidoIcon>
                  <BsFillCaretDownFill />
               </SelectVistaPartidoIcon>
            </SelectVistaPartidoHeader>
            ) : (
            <SelectVistaPartidoHeader>
               Ültima semana en CR
            </SelectVistaPartidoHeader>
            )}

            {/* Mostrar las opciones solo si el menú está abierto */}
            <SelectVistaPartidoOptions isOpen={isOpen}>
            <SelectVistaPartidoOption
               className={vistaSeleccionada === "dia" ? "selected" : ""}
               onClick={() => handleVistaChange("dia")}
            >
               Hoy
            </SelectVistaPartidoOption>
            <SelectVistaPartidoOption
               className={vistaSeleccionada === "semana" ? "selected" : ""}
               onClick={() => handleVistaChange("semana")}
            >
               Última semana
            </SelectVistaPartidoOption>
            </SelectVistaPartidoOptions>
         </SelectVistaPartidoWrapper>
   );
};

export default SelectVistaPartido;
