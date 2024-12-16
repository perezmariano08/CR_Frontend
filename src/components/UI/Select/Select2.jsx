import React, { useState } from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';

const Select2 = ({ data, placeHolder, onSelect }) => {
    const [selectedValue, setSelectedValue] = useState('0'); // Valor inicial para el `placeHolder`.

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value); // Actualiza el valor seleccionado.
        if (onSelect) onSelect(value); 
    };

    return (
        <SelectContainerStyled>
            <SelectWrapper value={selectedValue} onChange={handleSelectChange}>
                <option value="0" disabled>{placeHolder}</option> {/* `disabled` evita su selección después. */}
                {data.map(player => (
                    <option key={player.id_jugador} value={player.id_jugador}>
                        {player.nombre} {player.apellido} - {player.dorsal}
                    </option>
                ))}
            </SelectWrapper>
        </SelectContainerStyled>
    );
};

export default Select2;
