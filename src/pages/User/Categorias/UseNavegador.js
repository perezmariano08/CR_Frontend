import { useNavigate } from "react-router-dom";

const UseNavegador = () => {
    const navigate = useNavigate();
    
    const GoToCategorias = (ruta) => {
      navigate(ruta);
    };
  
    return {
        GoToCategorias
    }
  };
  
export default UseNavegador;