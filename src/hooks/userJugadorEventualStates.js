import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const userJugadorEventualStates = () => {
    const [dorsalValue, setDorsalValue] = useState('');
    const [dniValue, setDniValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [surNameValue, setSurNameValue] = useState('');

    const handleInputChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    };

    const handleInputChangeDni = (value) => {
        if (/^\d{0,8}$/.test(value) || value === '') {
            setDniValue(value);
        }
    };

    const handleInputName = (value) => {
        if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
            setNameValue(value);
        }
    };

    const handleInputSurName = (value) => {
        if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
            setSurNameValue(value);
        }
    };

    const isAnyValueEmpty = () => {
        return !dorsalValue?.trim() || !dniValue?.trim() || !nameValue?.trim() || !surNameValue?.trim();
    };

    const validateFields = () => {
        const trimmedName = nameValue.trim();
        const trimmedSurName = surNameValue.trim();
        const trimmedDni = dniValue.trim();
        const trimmedDorsal = dorsalValue.trim();

        if (!/^\d{7,9}$/.test(trimmedDni)) {
            toast.error('El DNI debe tener entre 7 y 8 dígitos.');
            return false;
        }

        if (!/^\d{1,3}$/.test(trimmedDorsal)) {
            toast.error('El dorsal debe ser de hasta 3 dígitos.');
            return false;
        }

        if (!trimmedName || !trimmedSurName) {
            toast.error('Nombre y Apellido no pueden estar vacíos.');
            return false;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmedName) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmedSurName)) {
            toast.error('Nombre y Apellido solo pueden contener letras, espacios y caracteres acentuados.');
            return false;
        }
        

        return true;
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    return {
        dorsalValue,
        setDorsalValue,
        dniValue,
        setDniValue,
        nameValue,
        setNameValue,
        surNameValue,
        setSurNameValue,
        handleInputChange,
        handleInputChangeDni,
        handleInputName,
        handleInputSurName,
        isAnyValueEmpty,
        validateFields,
        capitalizeFirstLetter
    };
};

export default userJugadorEventualStates;