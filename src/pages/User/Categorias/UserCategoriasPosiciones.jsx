import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { ContentMenuLink, ContentPageWrapper, ContentUserContainer, ContentUserMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, MenuPosicionesContainer, MenuPosicionesItemFilter, TablePosicionesContainer, TituloContainer, TituloText } from '../../../components/Content/ContentStyles';
import { dataPosicionesTemporadaColumns } from '../../../components/Stats/Data/Data';
import TablePosicionesRoutes from '../../../components/Stats/TablePosiciones/TablaPosicionesRoutes';
import { getPosicionesTemporada, getZonas } from '../../../utils/dataFetchers';
import { SpinerContainer } from '../../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const UserCategoriasPosiciones = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);

    const categoriaFiltrada = useMemo(() => categorias.find((c) => c.id_categoria === id_categoria), [categorias, id_categoria]);
    const edicionFiltrada = useMemo(() => ediciones.find((e) => e.id_edicion === categoriaFiltrada?.id_edicion), [ediciones, categoriaFiltrada]);

    const [posiciones, setPosiciones] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      if (posiciones) {
          setIsLoading(false); // Cambia el estado cuando los datos están disponibles
      }
  }, [posiciones]);

    useEffect(() => {
      if (!ediciones.length) {
        dispatch(fetchEdiciones())
      }
    }, [dispatch, ediciones.length])

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

    const zonaFiltrada = useMemo(() => zonas.find((z) => z.id_categoria === id_categoria), [zonas, id_categoria]);

    useEffect(() => {
        if (zonaFiltrada?.id_zona) {
            getPosicionesTemporada(zonaFiltrada.id_zona)
                .then((data) => setPosiciones(data))
                .catch((error) => console.error('Error en la petición de posiciones:', error));
        }
    }, [zonaFiltrada]);

    return (
      <ContentUserContainer>
        <ContentUserWrapper>
          <ContentUserTituloContainerStyled>
            <ContentUserTituloContainer>
              <TituloContainer>
                <img src="https:/coparelampago.com/uploads/CR/logo-clausura-2024.png" />
                <TituloText>
                  <h1>{categoriaFiltrada?.nombre}</h1>
                  <p>{`${edicionFiltrada?.nombre} ${edicionFiltrada?.temporada}`}</p>
                </TituloText>
              </TituloContainer>
            </ContentUserTituloContainer>
            <ContentUserMenuTitulo>
              <ContentMenuLink >
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
          <ContentPageWrapper>
            <MenuPosicionesContainer>
              <MenuPosicionesItemFilter>
                Liguilla
              </MenuPosicionesItemFilter>
            </MenuPosicionesContainer>
            <TablePosicionesContainer>
            {
              posiciones ? (
                <TablePosicionesRoutes 
                  data={posiciones}
                  dataColumns={dataPosicionesTemporadaColumns}
                /> 
              ) : isLoading ? (
                <SpinerContainer>
                  <TailSpin width='40' height='40' color='#2AD174' />
                </SpinerContainer>
              ) : null
            }
            </TablePosicionesContainer>
          </ContentPageWrapper>
        </ContentUserWrapper> 
      </ContentUserContainer>
    );
}

export default UserCategoriasPosiciones;
