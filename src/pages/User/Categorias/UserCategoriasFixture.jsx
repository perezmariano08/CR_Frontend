import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { ContentJornadasFixture, ContentMenuLink, ContentPageWrapper, ContentUserContainer, ContentUserMenuTitulo, ContentUserSubMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, JornadasFixtureDia, JornadasFixturePartido, JornadasFixturePartidoEquipo, JornadasFixtureResultado, JornadasFixtureWrapper, JornadasFixtureZona, TituloContainer, TituloText } from '../../../components/Content/ContentStyles';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const UserCategoriasFixture = () => {
    const dispatch = useDispatch();
    const { id_page } = useParams();
    const id_categoria = parseInt(id_page);

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);
    const categoriaFiltrada = categorias.find((c) => c.id_categoria === id_categoria);
    const edicionFiltrada = ediciones.find((e) => e.id_edicion === categoriaFiltrada.id_edicion);
    
    useEffect(() => {
        dispatch(fetchCategorias());
    }, [dispatch]);

    return (
      <>
        <ContentUserContainer>
          <ContentUserWrapper>
            <ContentUserTituloContainerStyled>
              <ContentUserTituloContainer>
                <TituloContainer>
                <img src="https:/coparelampago.com/uploads/CR/logo-clausura-2024.png" alt="" srcset="" />
                <TituloText>
                  <h1>{categoriaFiltrada.nombre}</h1>
                  <p>{`${edicionFiltrada.nombre} ${edicionFiltrada.temporada}`}</p>
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
                </ContentMenuLink>
              </ContentUserMenuTitulo>
            </ContentUserTituloContainerStyled>
            <ContentPageWrapper>
              <ContentUserSubMenuTitulo>
                <ContentMenuLink >
                  <NavLink to={`/categoria/fixture/${id_categoria}`}>
                    Liguilla
                  </NavLink>
                  <NavLink to={'/'}>
                    Fase 2
                  </NavLink>
                </ContentMenuLink>
              </ContentUserSubMenuTitulo>
              <ContentJornadasFixture>
                <JornadasFixtureWrapper>
                  <AiOutlineLeft/>
                  Fecha 1
                  <AiOutlineRight/>
                </JornadasFixtureWrapper>
              </ContentJornadasFixture>
              <JornadasFixtureDia>
                Sabado, 31 de agosto
              </JornadasFixtureDia>
              <JornadasFixtureZona>
                Grupo A
              </JornadasFixtureZona>
              <JornadasFixturePartido>
                <JornadasFixturePartidoEquipo>
                  La Teoria
                  <img src="https:/coparelampago.com/uploads/Equipos/la-teoria.png" />
                </JornadasFixturePartidoEquipo>
                <JornadasFixtureResultado>
                  2-1
                </JornadasFixtureResultado>
                <JornadasFixturePartidoEquipo className='visita'>
                  <img src="https:/coparelampago.com/uploads/Equipos/celta-de-vino.png" />
                  Celta de Vino
                </JornadasFixturePartidoEquipo>
              </JornadasFixturePartido>
              <JornadasFixturePartido>
                <JornadasFixturePartidoEquipo>
                  Pura Quimica
                  <img src="https:/coparelampago.com/uploads/Equipos/pura-quimica.png" />
                </JornadasFixturePartidoEquipo>
                <JornadasFixtureResultado className='hora'>
                  20:00
                </JornadasFixtureResultado>
                <JornadasFixturePartidoEquipo className='visita'>
                  <img src="https:/coparelampago.com/uploads/Equipos/tusa-fc.png" />
                  T-USA FC
                </JornadasFixturePartidoEquipo>
              </JornadasFixturePartido>
              <JornadasFixtureZona>
                Grupo B
              </JornadasFixtureZona>
              <JornadasFixturePartido>
                <JornadasFixturePartidoEquipo>
                  La Teoria
                  <img src="https:/coparelampago.com/uploads/Equipos/la-teoria.png" />
                </JornadasFixturePartidoEquipo>
                <JornadasFixtureResultado>
                  2-1
                </JornadasFixtureResultado>
                <JornadasFixturePartidoEquipo className='visita'>
                  <img src="https:/coparelampago.com/uploads/Equipos/celta-de-vino.png" />
                  Deportivo Lamarcasas
                </JornadasFixturePartidoEquipo>
              </JornadasFixturePartido>
              <JornadasFixturePartido>
                <JornadasFixturePartidoEquipo>
                  Pura Quimica
                  <img src="https:/coparelampago.com/uploads/Equipos/pura-quimica.png" />
                </JornadasFixturePartidoEquipo>
                <JornadasFixtureResultado className='hora'>
                  20:00
                </JornadasFixtureResultado>
                <JornadasFixturePartidoEquipo className='visita'>
                  <img src="https:/coparelampago.com/uploads/Equipos/tusa-fc.png" />
                  T-USA FC
                </JornadasFixturePartidoEquipo>
              </JornadasFixturePartido>
            </ContentPageWrapper>
          </ContentUserWrapper> 
          
        </ContentUserContainer>
      </>
    );
}

export default UserCategoriasFixture;
