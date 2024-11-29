import React from "react";
import { SwitchContainer, SwitchInput, SwitchSlider } from "./SwitchStyles";

const Switch = ({ isChecked, onChange, disabled }) => {
    return (
        <SwitchContainer>
            <SwitchInput
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                disabled={disabled} // Pasa el prop disabled para bloquear la interacción
            />
            <SwitchSlider 
                checked={isChecked}
                disabled={disabled} // Pasa el prop disabled para aplicar el estilo deshabilitado visualmente
            />
        </SwitchContainer>
    );
};

export default Switch;
