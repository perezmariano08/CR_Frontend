import React from 'react';
import { Column } from 'primereact/column';
import { EstadisticaNumero, JugadorBodyTemplate, JugadorBodyTemplateNombre, TablaEstadisticasWrapper } from './TablaEstadisticasStyles';
import { useEquipos } from '../../hooks/useEquipos';
import { URLImages } from '../../utils/utils';

const TablaEstadisticas = ({ data, dataColumns }) => {

    const { escudosEquipos, nombresEquipos } = useEquipos();


    const dataTable = data?.map(d => ({
        ...d,
        nombre_completo: (
            <JugadorBodyTemplate>
                <img src={`${URLImages}${escudosEquipos(d.id_equipo)}`}/>
                <JugadorBodyTemplateNombre>
                    <p>{d.nombre_completo}</p>
                    <span>{nombresEquipos(d.id_equipo)}</span>
                </JugadorBodyTemplateNombre>
            </JugadorBodyTemplate>
        ),
        G: (
            <EstadisticaNumero>
                <p>{d.G}</p>
            </EstadisticaNumero>
        ),
        Asistencias: (
            <EstadisticaNumero>
                <p>{d.Asistencias}</p>
            </EstadisticaNumero>
        ),
        Rojas: (
            <EstadisticaNumero>
                <p>{d.Rojas}</p>
            </EstadisticaNumero>
        ),
        
    })) || [];

    return (
        <TablaEstadisticasWrapper
            value={dataTable}
            emptyMessage="No hay datos disponibles"
            // paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
        >
        {dataColumns.map((col) => (
            <Column
                key={col.field}
                field={col.field}
                header={col.header}
            />
        ))}
        </TablaEstadisticasWrapper>
    );
};

export default TablaEstadisticas;
