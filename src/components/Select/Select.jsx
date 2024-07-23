import React from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';
import { VscTriangleDown } from "react-icons/vsc";

const Select = ({ data, placeholder, column = "nombre", onChange, id_, icon, value }) => {
    return (
        <SelectContainerStyled>
            <SelectWrapper onChange={onChange} value={value}>
                <option value='0'>{placeholder}</option>
                {data.map((item, index) => (
                    <option key={index + 1} value={item[id_]}>
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