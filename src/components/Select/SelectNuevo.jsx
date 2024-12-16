import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Arrow, Logo, Option, OptionsList, SelectContainer, Selected } from "./SelectStyles";
import { URLImages } from "../../utils/utils";
import { BsFillCaretDownFill } from "react-icons/bs";
import { useEquipos } from "../../hooks/useEquipos";

const SelectNuevo = ({
    options,
    onChange,
    valueKey = "id", // Clave para el valor (por defecto "id")
    labelKey = "nombre", // Clave para el nombre (por defecto "nombre")
}) => {
    const { escudosEquipos } = useEquipos();
    const equipoSeleccionado = useSelector((state) => state.newUser.equipoSeleccionado); // Equipo seleccionado del store

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null); // Estado inicial como null

    const selectedOptionRef = useRef(null); // Referencia para la opción seleccionada

    // Agregar opción inicial "No seleccionar equipo"
    const augmentedOptions = [{ [valueKey]: null, [labelKey]: "No seleccionar equipo" }, ...options];

    // Efecto para inicializar el estado con el equipo guardado en el store
    useEffect(() => {
        if (equipoSeleccionado) {
            const initialOption = augmentedOptions.find(
                (option) => option[valueKey] === equipoSeleccionado
            );
            if (initialOption) {
                setSelectedOption(initialOption);
            }
        }
    }, [equipoSeleccionado, augmentedOptions, valueKey]);

    // Efecto para desplazar la lista a la opción seleccionada cuando se abre
    useEffect(() => {
        if (isOpen && selectedOptionRef.current) {
            selectedOptionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [isOpen]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) onChange(option[valueKey]); // Retorna el valor según la clave
    };

    return (
        <SelectContainer>
            <Selected onClick={() => setIsOpen(!isOpen)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Si no hay opción seleccionada, muestra el texto "Seleccionar equipo" */}
                    {!selectedOption || !selectedOption[valueKey] ? (
                        <span>Seleccionar equipo</span>
                    ) : (
                        <>
                            <Logo
                                src={`${URLImages}/${escudosEquipos(selectedOption[valueKey])}`}
                                alt="logo"
                            />
                            {selectedOption[labelKey]}
                        </>
                    )}
                </div>
                <Arrow isOpen={isOpen}>
                    <BsFillCaretDownFill />
                </Arrow>
            </Selected>
            <OptionsList isOpen={isOpen}>
                {augmentedOptions.map((option, index) => (
                    <Option
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        ref={
                            selectedOption?.[valueKey] === option[valueKey]
                                ? selectedOptionRef
                                : null
                        }
                        className={
                            selectedOption?.[valueKey] === option[valueKey] ? "active" : ""
                        }
                    >
                        {/* Mostrar el logo solo si no es la opción "No seleccionar equipo" */}
                        {option[valueKey] ? (
                            <Logo
                                src={`${URLImages}/${escudosEquipos(option[valueKey])}`}
                                alt="logo"
                            />
                        ) : null}
                        {option[labelKey]}
                    </Option>
                ))}
            </OptionsList>
        </SelectContainer>
    );
};

export default SelectNuevo;
