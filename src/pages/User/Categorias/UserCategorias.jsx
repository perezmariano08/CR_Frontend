import React from 'react';
import {
    ContentUserContainer,
    ContentUserWrapper, MenuCategoriasContainer, MenuCategoriasDivider, MenuCategoriasItem, MenuCategoriasTitulo, TituloContainer, TituloText
} from '../../../components/Content/ContentStyles';
import { URLImages } from '../../../utils/utils';

const UserCategorias = () => {

    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                <MenuCategoriasContainer>
                        <MenuCategoriasTitulo>
                            <img src={`${URLImages}/uploads/CR/logo-clausura-2024.png`}/>
                            Clausura 2024
                        </MenuCategoriasTitulo>
                        <MenuCategoriasDivider>
                            <span>CATEGORIA LIBRE</span>
                            <div/>
                        </MenuCategoriasDivider>
                        <MenuCategoriasItem to={'/categoria/posiciones/1'}>
                            Serie A
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/2'}>
                            Serie B
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/3'}>
                            Serie C
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/4'}>
                            Serie D
                        </MenuCategoriasItem>
                        <MenuCategoriasDivider>
                            <span>CATEGORIA SUB 19</span>
                            <div/>
                        </MenuCategoriasDivider>
                        <MenuCategoriasItem to={'/categoria/posiciones/5'}>
                            Serie A
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/6'}>
                            Serie B
                        </MenuCategoriasItem>
                        <MenuCategoriasDivider>
                            <span>FEMENINO</span>
                            <div/>
                        </MenuCategoriasDivider>
                        <MenuCategoriasItem to={'/categoria/posiciones/7'}>
                            Intermedias
                        </MenuCategoriasItem>
                        <MenuCategoriasItem to={'/categoria/posiciones/8'}>
                            Principiantes
                        </MenuCategoriasItem>
                    </MenuCategoriasContainer>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
};

export default UserCategorias;
