import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFases } from "../../../redux/ServicesApi/fasesSlice";
import { insertarFase } from "../../../utils/dataFetchers";
import { toast } from "react-hot-toast";

export const useCategoriaFormato = (
  id_categoria,
  zonas,
  temporadas,
  partidosCategoria
) => {
  const dispatch = useDispatch();
  const fases = useSelector((state) => state.fases.data);

  const [faseEstado, setFaseEstado] = useState(null);
  const [zonaExpandida, setZonaExpandida] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    dispatch(fetchFases(id_categoria));
  }, [id_categoria, dispatch]);

  const handleSetFaseEstado = (numero_fase, openModal) => {
    setFaseEstado(numero_fase);
    openModal(); // normalmente openCreateModal()
  };

  const insertarNuevaFase = async () => {
    const data = {
      id_categoria,
      numero_fase: fases.length + 1,
    };
    await insertarFase(data);
    dispatch(fetchFases(id_categoria));
  };

  const contarVacantesOcupadas = (zonaId) => {
    const zona = zonas.find((z) => z.id_zona == zonaId);
    if (!zona) return 0;

    const cantidadEquiposZona = zona.cantidad_equipos;

    const cantidadEquiposTemporada = temporadas.filter(
      (t) => t.id_zona == zonaId && t.id_equipo != null
    ).length;
    const cantidadPosZonaPrevia = temporadas.filter(
      (t) => t.id_zona == zonaId && t.pos_zona_previa !== null
    ).length;

    const partidosContados = new Set();
    const cantidadEquiposPartidos = partidosCategoria.reduce(
      (count, partido) => {
        if (partido.id_zona === zonaId) {
          if (
            partido.id_partido_previo_local &&
            !partidosContados.has(partido.id_partido_previo_local)
          ) {
            partidosContados.add(partido.id_partido_previo_local);
            count += 1;
          }
          if (
            partido.id_partido_previo_visita &&
            !partidosContados.has(partido.id_partido_previo_visita)
          ) {
            partidosContados.add(partido.id_partido_previo_visita);
            count += 1;
          }
        }
        return count;
      },
      0
    );

    const vacantesOcupadas =
      cantidadEquiposTemporada +
      cantidadPosZonaPrevia +
      cantidadEquiposPartidos;
    return Math.min(vacantesOcupadas, cantidadEquiposZona);
  };

  const toggleExpandido = (id_zona) => {
    setZonaExpandida(zonaExpandida === id_zona ? null : id_zona);
  };

  return {
    fases,
    faseEstado,
    zonaExpandida,
    triggerFetch,
    setTriggerFetch,
    handleSetFaseEstado,
    insertarNuevaFase,
    contarVacantesOcupadas,
    toggleExpandido,
  };
};
