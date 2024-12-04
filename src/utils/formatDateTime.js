export const formatPartidoDateTime = dateString => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '00-00-0000 00:00:00';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const formatearDiaSinAño= dateString => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '00-00-0000 00:00:00';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}`;
}

export const formatHour = timeString => {
    // Verificar si el formato es válido (hh:mm:ss)
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
        // Cortar los últimos tres caracteres ":ss"
        return timeString.slice(0, 5);
    }
    // Si no es un formato válido, devolver un valor por defecto
    return '00:00';
}

export const convertirFechaFormatoLong = fechaISO => {
    const opciones = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZoneName: 'short' };
    return new Date(fechaISO).toLocaleDateString('en-US', opciones).replace(',', '');
}

export const convertirFecha = (fecha) => {
    // Detectar si ya está en formato YYYY-MM-DD
    const formatoCorrecto = /^\d{4}-\d{2}-\d{2}$/;
    if (formatoCorrecto.test(fecha)) {
        return fecha; // Ya está en el formato correcto
    }

    // Si la fecha viene en formato DD/MM/YYYY, la convertimos
    const [dia, mes, anio] = fecha.split('/');
    return `${anio}-${mes}-${dia}`;
};

export const formatearFecha = (fecha) => {
    try {
        const opciones = { weekday: 'short', day: 'numeric', month: 'short' };
        // Crear un objeto Date desde el string ISO
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);

        // Reemplazar puntos y ajustar estilo
        return fechaFormateada.replace('.', '');
    } catch (error) {
        console.error("Error formateando fecha:", error);
        return "Fecha no disponible";
    }
};
