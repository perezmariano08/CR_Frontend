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
                                        const equipoLocalPerdedor = partido.estado === "F" || partido.estado === "S" && partido.goles_local < partido.goles_visita;
                                        const equipoVisitaPerdedor = partido.estado === "F" || partido.estado === "S" && partido.goles_visita < partido.goles_local;

                                        return (
                                            <div key={partido.id_partido} className="match">
                                                <div className={`equipo ${equipoLocalPerdedor ? 'perdedor' : ''}`}>
                                                    <div className='nombre'>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoLocal)}`} alt="" />
                                                        {nombresEquipos(partido.id_equipoLocal)}
                                                    </div>
                                                    <div className='goles'>
                                                        {partido.goles_local}
                                                    </div>
                                                </div>
                                                <div className={`equipo ${equipoVisitaPerdedor ? 'perdedor' : ''}`}>
                                                    <div className='nombre'>
                                                        <img src={`${URLImages}${escudosEquipos(partido.id_equipoVisita)}`} alt="" />
                                                        {nombresEquipos(partido.id_equipoVisita)}
                                                    </div>
                                                    <div className='goles'>
                                                        {partido.goles_visita}
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

