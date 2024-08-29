import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice';

const CategoriasPosiciones = () => {
    const {id_page} = useParams();
    const id_categoria = parseInt(id_page)
    const dispatch = useDispatch();
    const categorias = useSelector((state) => state.categorias.data);
    const categoriaFiltrada = categorias.filter((c) => c.id_categoria === id_categoria)
    console.log(categoriaFiltrada);

    useEffect(() => {
        dispatch(fetchCategorias())
    }, [dispatch])
    

  return (
    <div>{categoriaFiltrada[0].nombre}</div>
  )
}

export default CategoriasPosiciones