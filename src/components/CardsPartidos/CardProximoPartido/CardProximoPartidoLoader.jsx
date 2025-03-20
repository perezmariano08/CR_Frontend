import React from 'react'
import { CardProximoPartidoWrapper, ProximoPartidoCancha, ProximoPartidoCuentaRegresivaWrapper, ProximoPartidoDescripcion, ProximoPartidoDetalle, ProximoPartidoDiaJornada, ProximoPartidoDivisor, ProximoPartidoEquipos, ProximoPartidoInfo } from './CardProximoPartidoStyles';
import { Skeleton } from 'primereact/skeleton';
import { GiSoccerField } from "react-icons/gi";


const CardProximoPartidoLoader = () => {
    return (
        <CardProximoPartidoWrapper>
            <ProximoPartidoInfo>
                <Skeleton
                    shape="circle"
                    width="58px"
                    height='48px'
                    style={{ borderRadius: '50%' }}
                />
                <ProximoPartidoDetalle>
                    <ProximoPartidoDescripcion>
                        <ProximoPartidoEquipos style={{ gap: '5px' }}>
                            <Skeleton width="150px" height="24px" />
                            <Skeleton width="150px" height="24px" />
                        </ProximoPartidoEquipos>
                        <ProximoPartidoDiaJornada style={{ gap: '5px' }}>
                            <Skeleton width="120px" height="14px" />
                            <Skeleton width="120px" height="14px" />
                        </ProximoPartidoDiaJornada>
                    </ProximoPartidoDescripcion>
                    <ProximoPartidoCancha>
                        <GiSoccerField />
                        <Skeleton width="80px" height="14px" />
                    </ProximoPartidoCancha>
                </ProximoPartidoDetalle>
            </ProximoPartidoInfo>
            <ProximoPartidoDivisor />
            <ProximoPartidoCuentaRegresivaWrapper>
                <Skeleton width="80%" height="50px" />
            </ProximoPartidoCuentaRegresivaWrapper>
        </CardProximoPartidoWrapper>
    )
}

export default CardProximoPartidoLoader