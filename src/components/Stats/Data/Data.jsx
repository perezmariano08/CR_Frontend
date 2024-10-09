import { IoIosFootball } from "react-icons/io";
import { LuRectangleVertical } from "react-icons/lu";
import { GiSoccerKick } from "react-icons/gi";
import { color } from "framer-motion";

export const dataPlantelColumns = [
    {field: 'nombre_completo', header: "Nombre"},
    {field: 'PJ', header: "PJ"},
    {field: 'G', header: <IoIosFootball/>},
    {field: 'A', header: <GiSoccerKick/>},
    {field: 'Am', header: <LuRectangleVertical/>},
    {field: 'R', header: <LuRectangleVertical/>},
]

export const dataPosicionesTemporadaColumns = [
    {field: 'pos', header: "#"},
    {field: 'equipo', header: "Equipo"},
    {field: 'PTS', header: "PTS"},
    {field: 'PJ', header: "PJ"},
    {field: 'PG', header: "PG"},
    {field: 'PE', header: "PE"},
    {field: 'PP', header: "PP"},
    {field: 'GF', header: "GF"},
    {field: 'GC', header: "GC"},
    {field: 'DIF', header: "DIF"}
];

export const dataPosicionesTemporadaColumnsMinus = [
    {field: 'pos', header: "#"},
    {field: 'nombre', header: "Equipo"},
    {field: 'PTS', header: "PTS"},
    {field: 'PJ', header: "PJ"},
    {field: 'DIF', header: "DIF"}
];

export const dataGoleadoresTemporadaColumns = [
    {field: 'nombre_completo', header: "Nombre"},
    {field: 'G', header: "Goles"},
    {field: 'Pen', header: "Penal"},
]

export const dataAsistenciasTemporadaColumns = [
    {field: 'nombre_completo', header: "Nombre"},
    {field: 'Asistencias', header: "A"},
]

export const dataRojasTemporadaColumns = [
    {field: 'nombre_completo', header: "Nombre"},
    {field: 'Rojas', header: "R"},
]

export const dataAmarillasTemporadaColumns = [
    {field: 'nombre_completo', header: "Nombre"},
    {field: 'Amarillas', header: "A"},
]

export const dataSancionesColumns = [
    {field: 'jugador', header: "Nombre"},
    {field: 'categoria', header: "Categoria"},
    {field: 'fechas', header: "Fechas"},
    {field: 'fechas_restantes', header: "Fechas restantes"},
    // {field: 'multa', header: "Multa"},
]

export const dataFormatoSerieA = [
    {pos: 1, color: 'var(--green)'},
    {pos: 2, color: 'var(--green)'},
    {pos: 3, color: 'var(--orange)'},
    {pos: 4, color: 'var(--orange)'},
    {pos: 5, color: 'var(--orange)'},
    {pos: 6, color: 'var(--orange)'},
    {pos: 7, color: 'var(--orange)'},
    {pos: 8, color: 'var(--orange)'},
    {pos: 9, color: 'var(--orange)'},
    {pos: 10, color: 'var(--orange)'},
]