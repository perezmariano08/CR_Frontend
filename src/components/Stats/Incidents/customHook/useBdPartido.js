import { useSelector } from "react-redux";

const useBdPartido = (idPartido) => {
    const descToMatch = useSelector((state) => state.planillero.planilla.descripcionPartido);
    const penales = useSelector((state) => state.planillero.penales);

    const bd_partido = {
        id_partido: idPartido,
        pen_local: penales?.penal_local,
        pen_visita: penales?.penal_visita,
        descripcion: descToMatch,
    };
    
    return { bd_partido };
}

export default useBdPartido
