import React, { useEffect, useState } from 'react';
import { CardPartidosDia, CardPartidosDiaTitle, HomeMediumWrapper, HomeWrapper, PartidosDiaFiltro, PartidosDiaFiltrosWrapper, SectionHome, SectionHomeTitle, TopContainer, ViewMore, ViewMoreWrapper } from '../../Home/HomeStyles';
import { HomePlanilleroContainer } from './HomePlanilleroStyles';
import { useAuth } from '../../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import useFetchMatches from '../../../hooks/useFetchMatches';
import { PartidosGenericosContainer } from '../../../components/CardsPartidos/CardPartidoGenerico/CardPartidosGenericoStyles';
import CardPartidoGenerico from '../../../components/CardsPartidos/CardPartidoGenerico/CardPartidoGenerico';
import { fetchPartidosPlanillero } from '../../../redux/ServicesApi/partidosSlice';

const HomePlanillero = () => {
    const dispatch = useDispatch();
    const { userId } = useAuth();
    const token = localStorage.getItem('token');

    useEffect(() => {
        dispatch(fetchPartidosPlanillero({ id_planillero: userId, token }));
    }, [])

    const partidos = useSelector((state) => state.partidos.data_planillero);

    const [isPending, setIsPending] = useState(true); 

    // Custom Hooks
    useFetchMatches((partidos) => partidos.id_planillero === userId);
    // useMessageWelcome(userName, showWelcomeToast, setShowWelcomeToast);

    const partidosPendientes = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado !== 'F' && partido.estado !== 'S')
        .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    const partidosPlanillados = partidos
        .filter((partido) => partido.id_planillero === userId && partido.estado === 'F' || partido.estado === 'S')
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
                    <CardPartidosDiaTitle>Tus partidos</CardPartidosDiaTitle>
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
                        Partidos a planillar
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
