import React from 'react'
import {
    CardPartidoGenericoWrapper,
    CardPartidoGenericoDivisor,
    CardPartidoGenericoEquipo,
    CardPartidoGenericoEquipoDetalle,
    CardPartidoGenericoEquipos,
    CardPartidoGenericoEstadisticas,
    CardPartidoGenericoResultado,
} from './CardPartidosGenericoStyles';
import { Skeleton } from 'primereact/skeleton';

const CardPartidoGenericoLoader = () => {
    return (
        <CardPartidoGenericoWrapper>
            <CardPartidoGenericoResultado className="programado">
                <Skeleton width="40px" height="16px" />
            </CardPartidoGenericoResultado>
            <CardPartidoGenericoDivisor />
            <CardPartidoGenericoEquipos>
                <CardPartidoGenericoEquipo>
                    <CardPartidoGenericoEquipoDetalle>
                        <Skeleton shape="circle" size="15px" />
                        <Skeleton width="120px" height="16px" />
                    </CardPartidoGenericoEquipoDetalle>
                    <CardPartidoGenericoEstadisticas>
                        <Skeleton width="30px" height="20px" />
                    </CardPartidoGenericoEstadisticas>
                </CardPartidoGenericoEquipo>
                <CardPartidoGenericoEquipo>
                    <CardPartidoGenericoEquipoDetalle>
                        <Skeleton shape="circle" size="15px" />
                        <Skeleton width="120px" height="16px" />
                    </CardPartidoGenericoEquipoDetalle>
                    <CardPartidoGenericoEstadisticas>
                        <Skeleton width="30px" height="20px" />
                    </CardPartidoGenericoEstadisticas>
                </CardPartidoGenericoEquipo>
            </CardPartidoGenericoEquipos>
        </CardPartidoGenericoWrapper>
    )
}

export default CardPartidoGenericoLoader