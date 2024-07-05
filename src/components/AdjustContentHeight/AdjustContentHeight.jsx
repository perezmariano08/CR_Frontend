import { useEffect } from 'react';

// Función para detectar la altura de la barra de navegación
function getNavigationBarHeight() {
    const windowHeight = window.innerHeight;
    window.scrollTo(0, 1);
    const newWindowHeight = window.innerHeight;
    window.scrollTo(0, 0);
    return windowHeight - newWindowHeight;
}

// Función para ajustar la altura del contenido
function adjustContentHeight() {
    const navigationBarHeight = getNavigationBarHeight();
    const contentHeight = window.innerHeight - navigationBarHeight;
    return contentHeight;
}

// Componente funcional que ajusta la altura del contenido
const AdjustContentHeight = () => {
    useEffect(() => {
        const contentHeight = adjustContentHeight();
        document.getElementById('contenedor').style.height = `${contentHeight}px`;
    }, []);

    return null;
};

export default AdjustContentHeight;
