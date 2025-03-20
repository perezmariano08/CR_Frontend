import React from 'react'
import {  CategoriasListaWrapper, CategoriasListaTitulo, CategoriasItem, CategoriasItemsWrapper } from './HomeStyles';
import { Skeleton } from 'primereact/skeleton';

const CategoriasListaLoader = () => {
    return (
        <>
            <CategoriasListaWrapper>
                <CategoriasListaTitulo>
                    <Skeleton height="18px" width="40%" />
                </CategoriasListaTitulo>
                <CategoriasItemsWrapper>
                    <CategoriasItem>
                        <Skeleton height="18px" width="50%" />
                    </CategoriasItem>
                    <CategoriasItem>
                        <Skeleton height="18px" width="50%" />
                    </CategoriasItem>
                </CategoriasItemsWrapper>
            </CategoriasListaWrapper>
            <CategoriasListaWrapper>
                <CategoriasListaTitulo>
                    <Skeleton height="18px" width="40%" />
                </CategoriasListaTitulo>
                <CategoriasItemsWrapper>
                    <CategoriasItem>
                        <Skeleton height="18px" width="50%" />
                    </CategoriasItem>
                    <CategoriasItem>
                        <Skeleton height="18px" width="50%" />
                    </CategoriasItem>
                </CategoriasItemsWrapper>
            </CategoriasListaWrapper>
            <CategoriasListaWrapper>
                <CategoriasListaTitulo>
                    <Skeleton height="18px" width="40%" />
                </CategoriasListaTitulo>
                <CategoriasItemsWrapper>
                    <CategoriasItem>
                        <Skeleton height="18px" width="50%" />
                    </CategoriasItem>
                    <CategoriasItem>
                        <Skeleton height="18px" width="50%" />
                    </CategoriasItem>
                </CategoriasItemsWrapper>
            </CategoriasListaWrapper>
        </>
    )
}

export default CategoriasListaLoader