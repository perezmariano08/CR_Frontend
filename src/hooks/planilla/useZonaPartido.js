import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchZonas } from "../../redux/ServicesApi/zonasSlice";

export const useZonaPartido = (id_zona) => {

    const dispatch = useDispatch();
    const zonas = useSelector((state) => state.zonas.data);

    const [zona, setZona] = useState([]);
    useEffect(() => {
        if (!id_zona) {
            return;
        }

        if (zonas.length > 0) {
            return;
        }

        dispatch(fetchZonas());
        const zonaCorrecta = zonas.find(z => z.id_zona === id_zona);
        setZona(zonaCorrecta || null);

    }, []);

    return { zona };
}