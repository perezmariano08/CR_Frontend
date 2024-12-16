import { useEffect, useState } from "react";
import { getZonas } from "../../utils/dataFetchers";

export const useZonaPartido = (id_zona) => {
    const [zona, setZona] = useState([]);
    
    useEffect(() => {
        getZonas()
            .then((data) => {
                const zonaCorrecta = data.find(z => z.id_zona === id_zona); // Usamos find en vez de filter para obtener un objeto
                setZona(zonaCorrecta || null); // Si no hay coincidencia, seteamos null
            })
            .catch((error) => console.error('Error fetching zonas:', error));
    }, []);

    return { zona };
}