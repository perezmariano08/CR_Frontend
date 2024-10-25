import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { ContentUserContainer, ContentUserWrapper, ContentUserTituloContainerStyled, ContentUserTituloContainer, ContentPageWrapper, TituloContainer, TituloText, PlayOffsWrapper, MenuPosicionesItemFilter, MenuPosicionesContainer } from '../../../components/Content/ContentStyles';
import { HiArrowLeft } from "react-icons/hi";
import { URLImages } from '../../../utils/utils';
import UseNavegador from './UseNavegador';
import UserCategoriasMenuNav from './UserCategoriasMenuNav';
import { useEquipos } from '../../../hooks/useEquipos';
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice';
import { fetchZonas } from '../../../redux/ServicesApi/zonasSlice';
import BracketEliminacionDirecta from '../../../components/BracketEliminacionDirecta/BracketEliminacionDirecta';
import { LoaderIcon } from 'react-hot-toast';

const UserCategoriasPlayOff = () => {
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const dispatch = useDispatch();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const partidos = useSelector((state) => state.partidos.data);
    const zonas = useSelector((state) => state.zonas.data);
    const loadingZonas = useSelector((state) => state.zonas.loading); // Estado de carga

    const zonasPlayOff = zonas.filter((z) => z.tipo_zona === 'eliminacion-directa');
    const categoriaFiltrada = useMemo(() => categorias.find((c) => c.id_categoria === id_categoria), [categorias, id_categoria]);
    const edicionFiltrada = useMemo(() => ediciones.find((e) => e.id_edicion === categoriaFiltrada?.id_edicion), [ediciones, categoriaFiltrada]);

    const { GoToCategorias } = UseNavegador();

    useEffect(() => {
        dispatch(fetchZonas());
        dispatch(fetchPartidos());
    }, [dispatch]);

    return (
        <ContentUserContainer>
            <ContentUserWrapper>
                <ContentUserTituloContainerStyled>
                    <ContentUserTituloContainer>
                        <TituloContainer>
                            <HiArrowLeft onClick={() => GoToCategorias('/categorias')} />
                            <img src={`${URLImages}/uploads/CR/logo-clausura-2024.png`} />
                            <TituloText>
                                <h1>{categoriaFiltrada?.nombre}</h1>
                                <p>{`${edicionFiltrada?.nombre} ${edicionFiltrada?.temporada}`}</p>
                            </TituloText>
                        </TituloContainer>
                    </ContentUserTituloContainer>
                    <UserCategoriasMenuNav id_categoria={id_categoria} />
                </ContentUserTituloContainerStyled>
                <ContentPageWrapper>
                    <PlayOffsWrapper>
                        {loadingZonas ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                                <LoaderIcon />
                            </div>
                        ) : (
                            <BracketEliminacionDirecta id_categoria={id_categoria} />
                        )}
                    </PlayOffsWrapper>
                </ContentPageWrapper>
            </ContentUserWrapper>
        </ContentUserContainer>
    );
};

export default UserCategoriasPlayOff;

