import { useSelector } from "react-redux";

const useGenerarBdDreamTeam = (idPartido) => {
    // Obtén la información del partido
    const matchState = useSelector((state) => state.match);
    const match = matchState.find((match) => match.ID === idPartido);

    // Obtén los jugadores destacados del estado
    const selectedStar = useSelector((state) => state.planillero.timeMatch.jugador_destacado || []);

    // Generar el array de jugadores para el dream team
    const generarBdDreamTeam = (jugadores, idPartido, idCategoria) => {
        return jugadores.map(jugador => ({
            id_partido: idPartido,
            id_equipo: jugador.id_equipo,
            id_jugador: jugador.id_jugador,
            id_categoria: idCategoria
        }));
    };

    // Extrae la categoría del partido
    const idCategoria = match ? match.id_categoria : null;

    // Genera el array de jugadores del dream team
    const bd_dreamTeam = generarBdDreamTeam(selectedStar, idPartido, idCategoria);

    return { bd_dreamTeam };
};

export default useGenerarBdDreamTeam;
