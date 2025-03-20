import React from 'react'
import { CardUltimoPartidoDescripcion, CardUltimoPartidoDetalle, CardUltimoPartidoDiaJornada, CardUltimoPartidoEquipos, CardUltimoPartidoInfo, CardUltimoPartidoWrapper } from './CardUltimoPartidoStyles';
import { Skeleton } from 'primereact/skeleton';

const CardUltimoPartidoLoader = () => {
    return (
        <CardUltimoPartidoWrapper>
            <CardUltimoPartidoInfo>
                <Skeleton shape="circle" size="58px" />
                <CardUltimoPartidoDetalle>
                    <CardUltimoPartidoDescripcion>
                        <CardUltimoPartidoDiaJornada>
                            <Skeleton width="50px" height="12px" />
                            <Skeleton width="130px" height="12px" />
                        </CardUltimoPartidoDiaJornada>
                        <CardUltimoPartidoEquipos style={{ gap: '5px' }}>
                            <Skeleton width="150px" height="22px" />
                            <Skeleton width="150px" height="22px" />
                        </CardUltimoPartidoEquipos>
                    </CardUltimoPartidoDescripcion>
                    <Skeleton width="80px" height="40px" />
                </CardUltimoPartidoDetalle>
            </CardUltimoPartidoInfo>
        </CardUltimoPartidoWrapper>
    )
}

export default CardUltimoPartidoLoader