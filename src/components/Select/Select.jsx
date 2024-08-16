import React from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';
import { VscTriangleDown } from "react-icons/vsc";

const Select = ({ data, placeholder, column = "nombre", onChange, id_, icon, value, disabled, name }) => {
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        onChange({
            target: {
                name,
                value: selectedValue,
            }
        });
    };

    return (
        <SelectContainerStyled>
            <SelectWrapper onChange={handleSelectChange} value={value} disabled={disabled} name={name}>
                {placeholder && <option value=''>{placeholder}</option>}
                {data.map((item, index) => (
                    <option key={index} value={item[id_]}>
                        {item[column]}
                    </option>
                ))}
            </SelectWrapper>
            <VscTriangleDown className='arrow' />
            {icon}
        </SelectContainerStyled>
    );
};

export default Select;
