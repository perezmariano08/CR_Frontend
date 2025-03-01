import React, { useEffect, useState } from 'react';
import { CardPartidosDia, CardPartidosDiaTitle, HomeMediumWrapper, HomeWrapper, PartidosDiaFiltro, PartidosDiaFiltrosWrapper, SectionHome, SectionHomeTitle, TopContainer, ViewMore, ViewMoreWrapper } from '../../Home/HomeStyles';
import { HomePlanilleroContainer } from './HomePlanilleroStyles';
import { useAuth } from '../../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { PartidosGenericosContainer } from '../../../components/CardsPartidos/CardPartidoGenerico/CardPartidosGenericoStyles';
import CardPartidoGenerico from '../../../components/CardsPartidos/CardPartidoGenerico/CardPartidoGenerico';
import { fetchPartidosPlanillero } from '../../../redux/ServicesApi/partidosSlice';
import { useWebSocket } from '../../../Auth/WebSocketContext';

const HomePlanillero = () => {
    const dispatch = useDispatch();
    const { userId } = useAuth();
    const socket = useWebSocket();
    const token = localStorage.getItem('token');

    useEffect(() => {
        dispatch(fetchPartidosPlanillero({ id_planillero: userId, token }));
    }, [])

    useEffect(() => {
        const handeSuspenderPartido = (data) => {
            dispatch(fetchPartidosPlanillero({ id_planillero: userId, token }));
        }

        if (socket) {
            socket.on('suspender-partido', handeSuspenderPartido);
        }

        return () => {
            if (socket) {
                socket.off('suspender-partido', handeSuspenderPartido);
            }
        }
    }, [socket, userId])

    const partidos = useSelector((state) => state.partidos.data_planillero);

    const [isPending, setIsPending] = useState(true); 

    const partidosPendientes = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado !== 'F' && partido.estado !== 'S')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosPlanillados = partidos
        .filter((partido) => +partido.id_planillero === +userId && partido.estado === 'F' || partido.estado === 'S')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosFiltrados = isPending ? partidosPendientes : partidosPlanillados;
    
    const handleToggleChange = () => {
        //pendientes es FALSE
        setIsPending(!isPending);
    };

    return (
        <HomePlanilleroContainer>
            <HomeWrapper className='planilla'>
                <CardPartidosDia>
                    <CardPartidosDiaTitle className='planillero'>Tus partidos</CardPartidosDiaTitle>
                    <PartidosDiaFiltrosWrapper>
                        <PartidosDiaFiltro
                            onClick={handleToggleChange}
                            className={isPending ? 'active' : ''}
                        >
                            Pendientes
                        </PartidosDiaFiltro>
                        <PartidosDiaFiltro
                            onClick={handleToggleChange}
                            className={!isPending ? 'active' : ''}
                        >
                            Planillados
                        </PartidosDiaFiltro>
                    </PartidosDiaFiltrosWrapper>
                </CardPartidosDia>
                <SectionHome className='planilla'>
                    <SectionHomeTitle>
                    {
                        isPending ? (
                            partidosFiltrados.length === 0 ? (
                                <>No hay partidos pendientes</>
                            ) : (
                                <>Partidos pendientes</>
                            )
                        ) : (
                            partidosFiltrados.length === 0 ? (
                                <>No hay partidos planillados</>
                            ) : (
                                <>Partidos planillados</>
                            )
                        )
                    }
                    </SectionHomeTitle>
                    <PartidosGenericosContainer>
                    {partidosFiltrados
                    .sort((a, b) => new Date(b.dia) - new Date(a.dia))
                    .map((p) => (
                        <CardPartidoGenerico
                            key={p.id_partido}
                            {...p}
                            id_planillero={userId}
                        />
                    ))}
                    </PartidosGenericosContainer>
                </SectionHome>
            </HomeWrapper>
        </HomePlanilleroContainer>
    );
};

export default HomePlanillero;
