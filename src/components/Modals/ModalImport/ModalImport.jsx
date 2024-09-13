import React from 'react';
import { ModalButtons, ModalContainerStyled, ModalExample, ModalHeader } from '../ModalsStyles';
import { IoClose } from "react-icons/io5";
import { PiExport } from "react-icons/pi";

const ModalImport = ({ title, buttons, onClickClose, initial, animate, exit, transition, fileName, select, exampleFile }) => {
    // Función para descargar el archivo de ejemplo
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = exampleFile; // Ruta del archivo
        link.download = 'ejemplo.xlsx'; // Nombre del archivo para descargar
        document.body.appendChild(link); // Agregar el enlace al DOM
        link.click(); // Simular el clic para iniciar la descarga
        document.body.removeChild(link); // Eliminar el enlace del DOM después de la descarga
    };
    return (
        <ModalContainerStyled
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
        >
            <ModalHeader>
                <p>{title}</p>
                <IoClose onClick={onClickClose} />
            </ModalHeader>
            <p>Antes de cargar tus archivos a continuación, asegúrate de que tu archivo sea listo para importarse.</p>
            
            {fileName ? <>
                <p>Archivo seleccionado: {fileName}</p>
                <div style={{width: '50%'}}>{select}</div>
            </> : <ModalExample>
                    <a href="public/ejemplo_partidos.csv" download="ejemplo.csv" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Descargar Hoja de Cálculo de Ejemplo <PiExport />
                    </a>
            </ModalExample>
            }
            <ModalButtons>
                {buttons}
            </ModalButtons>
        </ModalContainerStyled>
    );
}

export default ModalImport;
