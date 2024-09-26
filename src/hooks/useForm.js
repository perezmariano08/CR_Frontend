import { useState } from 'react';

const useForm = (initialState) => {
    const [formState, setFormState] = useState(initialState);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: name === 'fechas' || name === 'fechas_restantes' ? Number(value) : value,
        }));
    };
    
    const resetForm = () => {
        setFormState(initialState);
    };

    return [formState, handleChange, resetForm, setFormState];
};

export default useForm;
