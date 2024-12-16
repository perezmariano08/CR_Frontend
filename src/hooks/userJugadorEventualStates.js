import { useState } from 'react'; 

const userJugadorEventualStates = () => {

    const [dorsalValue, setDorsalValue] = useState('');
    const [dniValue, setDniValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [surNameValue, setSurNameValue] = useState('');

    const handleDorsalChange = (value) => {
        if (/^\d{0,3}$/.test(value) || value === '') {
            setDorsalValue(value);
        }
    }

    const handleDniChange = (value) => {
        if (/^\d{0,9}$/.test(value) || value === '') {
            setDniValue(value);
        }
    }

    const handleNameChange = (value) => {
        if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
            setNameValue(value);
        }
    }

    const handleSurNameChange = (value) => {
        if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
            setSurNameValue(value);
        }
    }

    return {
        dorsalValue,
        setDorsalValue,
        dniValue,
        setDniValue,
        nameValue,
        setNameValue,
        surNameValue,
        setSurNameValue,
        handleDorsalChange,
        handleDniChange,
        handleNameChange,
        handleSurNameChange
    }
};

export default userJugadorEventualStates;