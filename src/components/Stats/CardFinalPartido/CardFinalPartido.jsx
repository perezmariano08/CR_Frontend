import React from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn, WatchContainer, CardPartidoTitulo, CardPartidoDetalles, CardPartidoDetallesItem } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { formatTime, URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';
import { MdOutlineWatchLater } from "react-icons/md";
import { renderizarTituloPartido } from '../statsHelpers';
import { calcularGolesConDetalle } from './golesHelper';
import { useZonaPartido } from '../../../hooks/planilla/useZonaPartido';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GiSoccerField } from "react-icons/gi";
import { PiSoccerBall } from "react-icons/pi";
import { Skeleton } from 'primereact/skeleton';

const CardFinalPartido = ({ partido, incidencias }) => {
    const loading = partido === null || incidencias === null;
    
    //custom hooks
    const { nombresEquipos, escudosEquipos } = useEquipos();
    const { zona } = useZonaPartido(partido?.id_zona) 
    
    if (loading) {
        
        return (
            <CardPartidoWrapper>
            <CardPartidoTitles>
              <Skeleton width="80%" height="5px" />
            </CardPartidoTitles>
            <CardPartidoTeams>
              <CardPartidoTeam>
                <Skeleton shape='circle' width="40px" height="40px" />
                <Skeleton width="100px" height="10px" />
              </CardPartidoTeam>
              <CardPartidoInfo>
                <Skeleton width="60px" height="30px" />
                <Skeleton width="80px" height="16px" />
              </CardPartidoInfo>
              <CardPartidoTeam>
              <Skeleton shape='circle' width="40px" height="40px" />
              <Skeleton width="100px" height="10px" />
              </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
              <CardPartidoGoalsColumn>
                <Skeleton count={2} width="90%" height="10px" />
              </CardPartidoGoalsColumn>
              <HiLifebuoy />
              <CardPartidoGoalsColumn className="visita">
                <Skeleton count={2} width="90%" height="10px" />
              </CardPartidoGoalsColumn>
            </CardPartidoGoalsContainer>
          </CardPartidoWrapper>
        );
    }

    const estadoPartido = partido?.estado

    const goles_partido = calcularGolesConDetalle(incidencias, partido)
    
    const hourFormated = formatTime(partido.hora);
    
    return (
        <CardPartidoWrapper>
            <CardPartidoTitulo>
                {zona?.tipo_zona === 'eliminacion-directa-ida-vuelta' && (
                    <h3 className="ida-vuelta">{renderizarTituloPartido(partido, zona) || "Sin título disponible"}</h3>
                )}
                <h3>{`${partido.nombre_edicion} - ${partido.nombre_categoria}`}</h3>
            </CardPartidoTitulo>
            {/* <CardPartidoTitles>
                {zona?.tipo_zona === 'eliminacion-directa-ida-vuelta' && (
                    <h3 className="ida-vuelta">{renderizarTituloPartido(partido, zona) || "Sin título disponible"}</h3>
                )}
                <h3>{`${partido.nombre_categoria} - ${partido.nombre_edicion}`}</h3>
                <p>
                    {`${partido.dia_nombre || "Día desconocido"} ${partido.dia_numero}/${partido.mes}`} - {zona?.nombre_zona || `Fecha ${partido.jornada}`} - {partido.cancha || "Cancha desconocida"}
                </p>
                
            </CardPartidoTitles> */}
            <CardPartidoDetalles>
                <CardPartidoDetallesItem>
                    <PiSoccerBall />
                    {`Fecha ${partido.jornada}`}
                </CardPartidoDetallesItem>
                <CardPartidoDetallesItem>
                    <MdOutlineCalendarMonth />
                    {`${partido.dia_nombre || "Día desconocido"} ${partido.dia_numero}/${partido.mes}`}
                </CardPartidoDetallesItem>
                <CardPartidoDetallesItem>
                    <GiSoccerField />
                    {partido.cancha || "Cancha desconocida"}
                </CardPartidoDetallesItem>

            </CardPartidoDetalles>
            <CardPartidoTeams>
                <CardPartidoTeam className='local'>
                    <h4 className='local'>{nombresEquipos(partido.id_equipoLocal)}</h4>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                </CardPartidoTeam>
                <CardPartidoInfo>
                    {
                        estadoPartido === 'C' && (
                            <WatchContainer>
                                <MdOutlineWatchLater />
                            </WatchContainer>
                        )
                    }
                    <h4>
                        {partido.estado === 'P' ? (
                            <h4>{hourFormated}</h4>
                        ) : partido.estado === 'S' || partido.estado === 'F' ? (
                            <>
                                {partido.pen_local && <span className="penales">({partido.pen_local})</span>}
                                {partido.goles_local}-{partido.goles_visita}
                                {partido.pen_visita && <span className="penales">({partido.pen_visita})</span>}
                            </>
                        ) : (
                            <>
                                {partido.pen_local && <span className="penales">({partido.pen_local})</span>}
                                {goles_partido.goles_local.length}-{goles_partido.goles_visita.length}
                                {partido.pen_visita && <span className="penales">({partido.pen_visita})</span>}
                            </>
                        )}
                    </h4>
                    {estadoPartido === 'P' ? (
                        <span>Programado</span>
                    ) : estadoPartido === 'T' || estadoPartido === 'F' ? (
                        <span>Final</span>
                    ) : partido.estado === 'S' || estadoPartido === 'A'? (
                        <span>Suspendido</span>
                    ) : (
                        <span>En curso</span>
                    )}
                </CardPartidoInfo>
                <CardPartidoTeam>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt={nombresEquipos(partido.id_equipoVisita)} />
                    <h4>{nombresEquipos(partido.id_equipoVisita)}</h4>
                </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoGoalsContainer>
                {partido.estado === 'S' ? (
                    <h5>{partido.descripcion && <p>{partido.descripcion}</p>}</h5>
                ) : partido.estado === 'A' ? (
                    <h5>Partido postergado</h5>
                ) : (
                    <>
                        <CardPartidoGoalsColumn>
                            {goles_partido?.goles_local?.length > 0 ? (
                                goles_partido.goles_local.map((gol, index) => (
                                    <h5 key={gol.id_gol || index}>
                                        {gol.nombre} {gol.apellido} {gol.penal === 'S' ? '(p)' : null} {gol.en_contra === 'S' ? '(ec)' : null}
                                    </h5>
                                ))
                            ) : (
                                <h5></h5>
                            )}
                        </CardPartidoGoalsColumn>
                        <HiLifebuoy />
                        <CardPartidoGoalsColumn className="visita">
                            {goles_partido?.goles_visita?.length > 0 ? (
                                goles_partido.goles_visita.map((gol, index) => (
                                    <h5 key={gol.id_gol || index}>
                                        {gol.nombre} {gol.apellido} {gol.penal === 'S' ? '(p)' : null} {gol.en_contra === 'S' ? '(ec)' : null}
                                    </h5>
                                ))
                            ) : (
                                <h5></h5>
                            )}
                        </CardPartidoGoalsColumn>
                    </>
                )}
            </CardPartidoGoalsContainer>

        </CardPartidoWrapper>
    );
};

export default CardFinalPartido;
