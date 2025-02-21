import React, { useEffect } from 'react';
import {
    ContentUserContainer,
    ContentUserWrapper, MenuCategoriasContainer, MenuCategoriasDivider, MenuCategoriasItem, MenuCategoriasTitulo, TituloContainer, TituloText
} from '../../../components/Content/ContentStyles';
import { URLImages } from '../../../utils/utils';
import { CategoriasItem, CategoriasItemsWrapper, CategoriasListaTitulo, CategoriasListaWrapper, HomeLeftWrapper, HomeWrapper } from '../../Home/HomeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEdiciones } from '../../../redux/ServicesApi/edicionesSlice';
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';
import { CategoriasContainer, CategoriasWrapper } from './UserCategoriasStlyes';

const UserCategorias = () => {
const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEdiciones());
        dispatch(fetchCategorias())
    }, [dispatch]);

    const categorias = useSelector((state) => state.categorias.data);
    const ediciones = useSelector((state) => state.ediciones.data);

    const currentYear = new Date().getFullYear();
    const edicionesActuales = ediciones.filter(edicion => edicion.temporada === currentYear);


    return (
        <CategoriasWrapper>
            <CategoriasContainer>
                {ediciones.map((edicion) => (
                    <CategoriasListaWrapper key={edicion.id_edicion} className={edicion.id_edicion === edicionesActuales[0].id_edicion ? 'actual' : ''}>
                    <CategoriasListaTitulo className={edicion.id_edicion === edicionesActuales[0].id_edicion ? 'actual' : ''}>
                        <p>{edicion.nombre} {edicion.temporada}</p>
                    </CategoriasListaTitulo>
                    <CategoriasItemsWrapper>
                        {categorias
                        .filter(
                            (categoria) =>
                            categoria.id_edicion === edicion.id_edicion &&
                            categoria.publicada === "S"
                        )
                        .map((categoria) => (
                            <CategoriasItem 
                            key={categoria.id_categoria} 
                            to={`/categoria/posiciones/${categoria.id_categoria}`}
                            className={edicion.id_edicion === edicionesActuales[0].id_edicion ? 'actual' : ''}
                            >
                            {categoria.nombre}
                            </CategoriasItem>
                        ))}
                    </CategoriasItemsWrapper>
                    </CategoriasListaWrapper>
                ))}
            </CategoriasContainer>
        </CategoriasWrapper>
    );
};

export default UserCategorias;
