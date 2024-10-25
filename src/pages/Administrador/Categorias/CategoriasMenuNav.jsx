import React from 'react';
import { ContentNavWrapper } from '../../../components/Content/ContentStyles';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategoriasMenuNav = ({ id_categoria, children }) => {
    const temporadas = useSelector((state) => state.temporadas.data);
    // Filtrar los equipos de la temporada y asegurarse de que no haya duplicados por id_equipo
    const equiposTemporada = temporadas
    .filter((t) => t.id_categoria == id_categoria)
    .filter(
        (equipo, index, self) =>
            index === self.findIndex((e) => e.id_equipo === equipo.id_equipo)
    );    
    
    const partidos = useSelector((state) => state.partidos.data); // Suponiendo que tienes los partidos en el estado
    // Filtrar partidos para obtener los que pertenecen a la categoría actual
    const partidosCategoria = partidos.filter((partido) => partido.id_categoria == id_categoria);
    // Obtener la última fecha de la jornada
    const fechas = partidosCategoria.map(partido => partido.jornada); // Ajusta según tu estructura de datos
    const ultimaFecha = Math.max(...fechas); // Obtener la última fecha

    return (
        <ContentNavWrapper>
            <li><NavLink to={`/admin/categorias/resumen/${id_categoria}`}>Resumen</NavLink></li>
            <li><NavLink to={`/admin/categorias/formato/${id_categoria}`}>Formato</NavLink></li>
            <li><NavLink to={`/admin/categorias/fixture/${id_categoria}?jornada=${ultimaFecha}`}>Fixture / DreamTeam</NavLink></li>
            <li><NavLink to={`/admin/categorias/estadisticas/${id_categoria}`}>Estadisticas</NavLink></li>
            <li><NavLink to={`/admin/categorias/equipos/${id_categoria}`}>Equipos ({equiposTemporada.length})</NavLink></li>
            <li><NavLink to={`/admin/categorias/config/${id_categoria}`}>Configuración</NavLink></li>
            {children}
        </ContentNavWrapper>
    );
};

export default CategoriasMenuNav;
