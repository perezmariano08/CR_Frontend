import styled from "styled-components";

export const SwitchContainer = styled.label`
  display: inline-block;
  position: relative;
  width: 60px;
  height: 34px;
`;

export const SwitchInput = styled.input`
  opacity: 0;  /* Lo ocultamos visualmente, para solo mostrar el slider */
  width: 0;
  height: 0;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; /* Bloquea el clic, pero mantiene la visibilidad */
`;

export const SwitchSlider = styled.span`
  position: absolute;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => 
    props.disabled ? "var(--gray-600)" : 
    props.checked ? "var(--green)" : "var(--gray-200)"
  };  /* Si está deshabilitado, se pone de color gris oscuro */
  transition: 0.4s;
  border-radius: 50px;

  &::before {
    content: "";
    position: absolute;
    height: 26px;
    width: 26px;
    border-radius: 50%;
    left: ${(props) => (props.checked ? "30px" : "4px")};
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
  }
`;


