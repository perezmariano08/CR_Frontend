import React, { useState, useEffect } from 'react';
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import { HiLifebuoy } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { URLImages } from '../../../utils/utils';
import { useEquipos } from '../../../hooks/useEquipos';
import { useWebSocket } from '../../../Auth/WebSocketContext';
import { usePlanilla } from '../../../hooks/usePlanilla';

const CardFinalPartido = ({ idPartido }) => {
    
    const { matchCorrecto: partido, bdIncidencias, estadoPartido } = usePlanilla(idPartido);

    const { nombresEquipos, escudosEquipos } = useEquipos();

    // console.log(bdIncidencias);

    const procesarGoles = (incidencias) => {
        if (!incidencias || !partido) return { local: [], visita: [] };
    
        const goles = {
            local: [],
            visita: []
        };
    
        incidencias.forEach((incidencia) => {
            // const incidenciaUnificada = unificarIncidencias(incidencia);
    
            if (incidencia.tipo === 'Gol') {
                const gol = {
                    minuto: incidencia.minuto,
                    id_jugador: incidencia.id_jugador,
                    nombre: incidencia.nombre,
                    apellido: incidencia.apellido,
                    penal: incidencia.penal === 'S',
                    enContra: incidencia.en_contra === 'S'
                };
    
                if (incidencia.id_equipo === partido.id_equipoLocal) {
                    if (gol.enContra) {
                        goles.visita.push(gol);
                    } else {
                        goles.local.push(gol);
                    }
                } else if (incidencia.id_equipo === partido.id_equipoVisita) {
                    if (gol.enContra) {
                        goles.local.push(gol);
                    } else {
                        goles.visita.push(gol);
                    }
                }
            }
        });
    
        goles.local.sort((a, b) => a.minuto - b.minuto);
        goles.visita.sort((a, b) => a.minuto - b.minuto);
    
        return goles;
    };

    const golesNube = procesarGoles(bdIncidencias);

    
    if (!partido) {
        return <div>Loading...</div>;
    }

    return (
        <CardPartidoWrapper>
            <CardPartidoTitles>
                <h3>{`${partido.nombre_categoria} - ${partido.nombre_edicion}`}</h3>
                <p>{`${partido.dia_nombre} ${partido.dia_numero}/${partido.mes}`} | {`Fecha ${partido.jornada} - ${partido.cancha}`}</p>
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt={nombresEquipos(partido.id_equipoLocal)} />
                    <h4>{nombresEquipos(partido.id_equipoLocal)}</h4>
                </CardPartidoTeam>
                <CardPartidoInfo>
                    <h4>{golesNube.local.length}-{golesNube.visita.length}</h4>
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
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
                {partido.estado === 'S' ? (
                    <h5>{partido.descripcion && <p>{partido.descripcion}</p>}</h5>
                ) : partido.estado === 'A' ? (
                    <h5>Partido postergado</h5>
                ) : (
                    <>
                        <CardPartidoGoalsColumn>
                            {golesNube.local.length > 0 ? (
                                golesNube.local.map((gol, index) => (
                                    <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
                                ))
                            ) : (
                                <h5></h5>
                            )}
                        </CardPartidoGoalsColumn>
                        <HiLifebuoy />
                        <CardPartidoGoalsColumn className='visita'>
                            {golesNube.visita.length > 0 ? (
                                golesNube.visita.map((gol, index) => (
                                    <h5 key={index}>{gol.nombre} {gol.apellido} {gol.penal ? '(p)' : null} {gol.enContra ? '(ec)' : null}</h5>
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
