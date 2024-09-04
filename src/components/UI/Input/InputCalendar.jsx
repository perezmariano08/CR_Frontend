import React from "react";
import { Calendar } from 'primereact/calendar';
import { InputContainerStyled } from "./InputSyles";
import { AiOutlineCalendar } from "react-icons/ai";
import { locale, addLocale } from 'primereact/api';

// Configuración de la localización en español
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

locale('es'); // Establece la localización predeterminada

export default function InputCalendar({placeholder, id, name, value, onChange, isError}) {
    return (
        <InputContainerStyled>
            <Calendar 
                dateFormat="dd/mm/yy" 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                id={id} 
                name={name}
                touchUI
                locale="es"
            />
            <AiOutlineCalendar className='icon-input'/>
            {isError && <span>Este campo es obligatorio</span>}
        </InputContainerStyled>
    )
}
