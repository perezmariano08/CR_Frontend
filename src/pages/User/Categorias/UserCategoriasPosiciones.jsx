import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { ContentMenuLink, ContentPageWrapper, ContentUserContainer, ContentUserMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, MenuPosicionesContainer, MenuPosicionesItemFilter, TablePosicionesContainer, TituloContainer, TituloText } from '../../../components/Content/ContentStyles';
import { dataPosicionesTemporadaColumns } from '../../../components/Stats/Data/Data';
import TablePosicionesRoutes from '../../../components/Stats/TablePosiciones/TablaPosicionesRoutes';
import { getPosicionesTemporada, getZonas } from '../../../utils/dataFetchers';
import { SpinerContainer } from '../../../Auth/SpinerStyles';
import { HiArrowLeft } from "react-icons/hi";
import { TailSpin } from 'react-loader-spinner';
import { URLImages } from '../../../utils/utils';
import UseNavegador from './UseNavegador';

const UserCategoriasPosiciones = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id_page } = useParams();
  const id_categoria = parseInt(id_page);

  const categorias = useSelector((state) => state.categorias.data);
  const ediciones = useSelector((state) => state.ediciones.data);

  const categoriaFiltrada = useMemo(() => categorias.find((c) => c.id_categoria === id_categoria), [categorias, id_categoria]);
  const edicionFiltrada = useMemo(() => ediciones.find((e) => e.id_edicion === categoriaFiltrada?.id_edicion), [ediciones, categoriaFiltrada]);

  const { GoToCategorias } = UseNavegador();

  const [posicionesPorZona, setPosicionesPorZona] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ediciones.length) {
      dispatch(fetchEdiciones());
    }
  }, [dispatch, ediciones.length]);

  useEffect(() => {
    if (!categorias.length) {
      dispatch(fetchCategorias());
    }
    if (!zonas.length) {
      getZonas()
        .then((data) => setZonas(data))
        .catch((error) => console.error('Error fetching zonas:', error));
    }
  }, [dispatch, categorias.length, zonas.length]);

  useEffect(() => {
    const fetchPosiciones = async () => {
      if (zonas.length > 0) {
        const zonasFiltradas = zonas.filter((z) => z.id_categoria === id_categoria);
        const posicionesPromises = zonasFiltradas.map((zona) =>
          getPosicionesTemporada(zona.id_zona).then((data) => ({
            id_zona: zona.id_zona,
            data
          }))
        );
        try {
          const posicionesData = await Promise.all(posicionesPromises);
          setPosicionesPorZona(posicionesData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching posiciones:', error);
        }
      }
    };

    fetchPosiciones();
  }, [zonas, id_categoria]);

  const getNombreZona = (id) => {
    const zonaFiltrada = zonas.find((z) => z.id_zona === id);
    return zonaFiltrada?.nombre_zona || '';
  }


  return (
    <ContentUserContainer>
      <ContentUserWrapper>
        <ContentUserTituloContainerStyled>
          <ContentUserTituloContainer>
            <TituloContainer>
              <HiArrowLeft onClick={() => GoToCategorias('/categorias')}/>
              <img src={`${URLImages}/uploads/CR/logo-clausura-2024.png`}/>
              <TituloText>
                <h1>{categoriaFiltrada?.nombre}</h1>
                <p>{`${edicionFiltrada?.nombre} ${edicionFiltrada?.temporada}`}</p>
              </TituloText>
            </TituloContainer>
          </ContentUserTituloContainer>
          <ContentUserMenuTitulo>
            <ContentMenuLink>
              <NavLink to={`/categoria/posiciones/${id_categoria}`}>
                Posiciones
              </NavLink>
              <NavLink to={`/categoria/fixture/${id_categoria}`}>
                Fixture
              </NavLink>
              <NavLink to={`/categoria/estadisticas/goleadores/${id_categoria}`}>
                Estadísticas
              </NavLink>
            </ContentMenuLink>
          </ContentUserMenuTitulo>
        </ContentUserTituloContainerStyled>
        {isLoading ? (
          <SpinerContainer>
            <TailSpin width='40' height='40' color='#2AD174' />
          </SpinerContainer>
        ) : (
          posicionesPorZona.map(({ id_zona, data }) => (
            <ContentPageWrapper key={id_zona}>
              <MenuPosicionesContainer>
                <MenuPosicionesItemFilter>
                  {getNombreZona(id_zona)}
                </MenuPosicionesItemFilter>
              </MenuPosicionesContainer>
              <TablePosicionesContainer>
                <TablePosicionesRoutes
                  data={data}
                  dataColumns={dataPosicionesTemporadaColumns}
                />
              </TablePosicionesContainer>
            </ContentPageWrapper>
          ))
        )}
      </ContentUserWrapper>
    </ContentUserContainer>
  );
}

export default UserCategoriasPosiciones;
