import React from "react";
import { Calendar } from 'primereact/calendar';
import { InputContainerStyled } from "./InputSyles";
import { AiOutlineCalendar } from "react-icons/ai";

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
            />
            <AiOutlineCalendar className='icon-input'/>
            {isError && <span>Este campo es obligatorio</span>}
        </InputContainerStyled>
    )
}
