import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { EliminacionDirectaWrapper } from './BracketEliminacionDirectaStyles';
import { useEquipos } from '../../hooks/useEquipos';
import { URLImages } from '../../utils/utils';
import { MenuPosicionesContainer, MenuPosicionesItemFilter } from '../Content/ContentStyles';

const BracketEliminacionDirecta = ({ id_categoria }) => {

    const { escudosEquipos, nombresEquipos } = useEquipos();
    const partidos = useSelector(state => state.partidos.data);
    const zonas = useSelector(state => state.zonas.data);

    const [etapaSeleccionada, setEtapaSeleccionada] = useState(null);
    
    // Procesar zonas para obtener solo las de la categoría seleccionada y fases ordenadas
    const zonasPorEtapa = React.useMemo(() => {
        const fasesOrdenadas = zonas
            .filter(z => z.tipo_zona === 'eliminacion-directa' && z.id_categoria === id_categoria)
            .sort((a, b) => a.fase - b.fase);
        
        return fasesOrdenadas.reduce((acc, zona) => {
            if (!acc[zona.id_etapa]) {
                acc[zona.id_etapa] = {
                    nombre_etapa: zona.nombre_etapa,
                    zonas: [],
                };
            }
            acc[zona.id_etapa].zonas.push(zona);
            return acc;
        }, {});
    }, [zonas, id_categoria]);

    useEffect(() => {
        if (Object.keys(zonasPorEtapa).length > 0) {
            setEtapaSeleccionada(Object.values(zonasPorEtapa)[0].nombre_etapa);
        } else {
            setEtapaSeleccionada(null);
        }
    }, [zonasPorEtapa]);

    const handleEtapaChange = (nombre_etapa) => {
        setEtapaSeleccionada(nombre_etapa);
    };

    const traerEquiposPartidoPrevio = (id_partido) => {    
        const partido = partidos.find((p) => p.id_partido === id_partido);
        if (!partido) {
            console.error('Partido no encontrado');
            return null; 
        }
        const {id_equipoLocal, id_equipoVisita} = partido;
        const nombreLocal = nombresEquipos(id_equipoLocal);
        const nombreVisita = nombresEquipos(id_equipoVisita);

        return <p>{nombreLocal} / {nombreVisita}</p>;
    };
    console.log(zonas[0]);
    
    return (
        <>
            <MenuPosicionesContainer>
                {Object.values(zonasPorEtapa).map(({ nombre_etapa }) => (
                    <MenuPosicionesItemFilter
                        key={nombre_etapa}
                        className={etapaSeleccionada === nombre_etapa ? 'active' : ''}
                        onClick={() => handleEtapaChange(nombre_etapa)}
                    >
                        {nombre_etapa}
                    </MenuPosicionesItemFilter>
                ))}
            </MenuPosicionesContainer>
            <EliminacionDirectaWrapper>
                {Object.values(zonasPorEtapa).map(({ zonas, nombre_etapa }) => (
                    (etapaSeleccionada === nombre_etapa) && (
                        zonas.map((zona) => (
                            <div key={zona.id_zona} className="round">
                                <h3>{zona.nombre_zona}</h3>
                                {
                                partidos
                                    .filter((p) => p.id_zona === zona.id_zona)
                                    .map((partido) => {
                                        const equipoLocalPerdedor = (partido.estado === "F" && partido.goles_local < partido.goles_visita) || 
                                        (partido.estado === "S" && partido.goles_local < partido.goles_visita) ||
                                        (partido.estado === "F" && partido.goles_local === partido.goles_visita && partido.pen_local < partido.pen_visita);
            
            const equipoVisitaPerdedor = (partido.estado === "F" && partido.goles_visita < partido.goles_local) || 
                                        (partido.estado === "S" && partido.goles_visita < partido.goles_local) ||
                                        (partido.estado === "F" && partido.goles_local === partido.goles_visita && partido.pen_visita < partido.pen_local);

                                        return (
                                            <div key={partido.id_partido} className="match">
                                                <div className={`equipo ${equipoLocalPerdedor ? 'perdedor' : ''} ${!partido.id_equipoLocal ? 'perdedor' : ''}`}>
                                                    <div className='nombre'>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt="" />
                                                        {
                                                            partido.id_equipoLocal
                                                                ? nombresEquipos(partido.id_equipoLocal)
                                                                : traerEquiposPartidoPrevio(partido.id_partido_previo_local)
                                                        }
                                                    </div>
                                                    <div className='goles'>
                                                        {partido.goles_local}
                                                        {
                                                            partido.pen_local && (
                                                                <span className='penales'>({partido.pen_local})</span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className={`equipo ${equipoVisitaPerdedor ? 'perdedor' : ''} ${!partido.id_equipoVisita ? 'perdedor' : ''}`}>
                                                    <div className='nombre'>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt="" />
                                                        {
                                                            partido.id_equipoVisita
                                                                ? nombresEquipos(partido.id_equipoVisita)
                                                                : traerEquiposPartidoPrevio(partido.id_partido_previo_visita)
                                                        }
                                                    </div>
                                                    <div className='goles'>
                                                        {partido.goles_visita}
                                                        {
                                                            partido.pen_local && (
                                                                <span className='penales'>({partido.pen_visita})</span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))
                    )
                ))}
            </EliminacionDirectaWrapper>
        </>
    );
};

export default BracketEliminacionDirecta;

