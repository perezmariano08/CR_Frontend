import React from 'react'
import { FormatoZona, FormatoZonaContainer, FormatoZonaInfo, FormatoZonasWrapper, FormatoZonaVacantes, VacanteEquipo, VacanteWrapper } from './categoriasStyles'
import { LiaAngleDownSolid } from "react-icons/lia";
import { NavLink, useParams } from 'react-router-dom';
import { GoKebabHorizontal } from "react-icons/go";

const FormatoZonas = () => {
  return (
    <FormatoZonasWrapper>
        {zonas
            .filter((z) => z.fase === fase.numero_fase && z.id_categoria == fase.id_categoria)
            .map((z) => {
                // Primer conteo de vacantes ocupadas basándonos en temporadas
                const equiposAsignados = temporadas.filter((t) => t.id_zona === z.id_zona && t.id_equipo);
                let completo = false;
                const vacantesOcupadas = contarVacantesOcupadas(z.id_zona);
                
                completo = parseInt(vacantesOcupadas) === parseInt(z.cantidad_equipos);
                return (
                    <FormatoZonaContainer
                        key={z.id_zona}
                        className={zonaExpandida === z.id_zona ? '' : 'no-expandido'}>
                        <FormatoZona onClick={() => toggleExpandido(z.id_zona)}>
                            <LiaAngleDownSolid
                                className={zonaExpandida === z.id_zona ? 'icono-rotado' : ''}
                            />

                            <FormatoZonaInfo>
                                <p>
                                    {z.nombre_etapa}<span> {z.nombre_zona}</span>
                                </p>
                                {z.tipo_zona === 'todos-contra-todos' && 'Todos contra todos'}
                                {z.tipo_zona === 'eliminacion-directa' && 'Eliminacion directa'}
                                {z.tipo_zona === 'eliminacion-directa-ida-vuelta' && 'Eliminacion directa (Ida y Vuelta)'}

                                <span
                                    className={
                                        completo
                                            ? 'completo'
                                            : 'incompleto'
                                    }>
                                    {`${vacantesOcupadas} / ${z.cantidad_equipos} vacantes ocupadas`}
                                </span>
                                <span
                                    className={
                                        z.id_equipo_campeon
                                        ? 'campeon'
                                        : 'sin-campeon'
                                    }
                                >
                                    {
                                        z.campeon === 'S' && (
                                            `Campeón: ${z.id_equipo_campeon ? nombresEquipos(z.id_equipo_campeon) : 'Sin definir'}`
                                        )
                                    }
                                </span>
                            </FormatoZonaInfo>

                            <div className='relative' onClick={(e) => e.stopPropagation()}>
                                <GoKebabHorizontal className='kebab' />
                                <div className='modales'>
                                    <div
                                    onClick={() =>openModalUpdate(z)}
                                    >Editar</div>
                                    <div
                                        onClick={() => eliminarZona(z.id_zona)}
                                        className='eliminar'>
                                        Eliminar
                                    </div>
                                </div>
                            </div>
                        </FormatoZona>

                        <FormatoZonaVacantes
                        className={zonaExpandida === z.id_zona ? 'expandido' : ''}>
                        {[...Array(z.cantidad_equipos)].map((_, index) => {
                            const numeroZona = z.id_zona;
                            const vacante = index + 1;
                            const equipoAsignado = equiposAsignados.find(
                                (e) => e.vacante === vacante
                            );

                            const { resultado, etiqueta, etiquetaPos } = obtenerResultadoYEtiquetaVacante(numeroZona, vacante);

                            const partidoAsignado = partidosCategoria.find((p) => {
                                if (vacante === p.vacante_local) {
                                    return p.id_zona === z.id_zona && p.id_partido_previo_local !== null;
                                } else if (vacante === p.vacante_visita) {
                                    return p.id_zona === z.id_zona && p.id_partido_previo_visita !== null;
                                }
                                return false;
                            });

                            return (
                                    <VacanteWrapper
                                        key={`vacante-${index}`}
                                        className={[partidoAsignado ? 'cruce' : '', equipoAsignado ? 'equipo' : '', etiquetaPos ? 'posicion' : ''].join(' ')}
                                        onClick={() => {
                                            if (z.tipo_zona === 'todos-contra-todos') {
                                                agregarEquipoZona(z.id_zona, vacante);
                                            } else {
                                                agregarVacantePlayOff(z.fase, vacante, z.id_zona);
                                                closeCreateModal();
                                            }
                                        }}>
                                        {equipoAsignado ? (
                                            <>
                                                EQUIPO
                                                <VacanteEquipo>
                                                    <img
                                                        src={`${URLImages}${escudosEquipos(
                                                            equipoAsignado.id_equipo
                                                        )}`}
                                                        alt={nombresEquipos(equipoAsignado.id_equipo)}
                                                    />
                                                    {nombresEquipos(equipoAsignado.id_equipo)}
                                                </VacanteEquipo>
                                            </>
                                        ) : (
                                            <>
                                                {etiquetaPos ? ( 
                                                    <VacanteEquipo>
                                                        {etiquetaPos}
                                                    </VacanteEquipo>
                                                ) : (
                                                    <>
                                                        {resultado ? (
                                                            <VacanteEquipo>
                                                                {resultado} {etiqueta}
                                                            </VacanteEquipo>
                                                        ) : (
                                                            <>
                                                                Vacante
                                                                <NavLink>Seleccionar equipo</NavLink>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <div
                                            className={[partidoAsignado ? 'cruce' : '', equipoAsignado ? 'vacante-texto existe' : 'vacante-texto', etiquetaPos ? 'posicion' : ''].join(' ')}
                                        >
                                            {vacante}
                                        </div>
                                        <div
                                            className='relative'
                                            onClick={(e) => e.stopPropagation()}>
                                            <GoKebabHorizontal className='kebab' />
                                            <div className='modales'>
                                                <div className='editar' onClick={() => agregarEquipoZona(z.id_zona, vacante, 'update')}>
                                                    Reemplazar equipo
                                                </div>
                                                {
                                                    (partidoAsignado || equipoAsignado || etiquetaPos) && (
                                                        <div
                                                            onClick={() => openModalVaciarVacante(z.id_zona, vacante)}
                                                            className='vaciar'>
                                                            Vaciar vacante
                                                        </div>                                                              
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </VacanteWrapper>
                                );
                            })}
                        </FormatoZonaVacantes>

                    </FormatoZonaContainer>
                );
            })}
    </FormatoZonasWrapper>
  )
}

export default FormatoZonas