import React from 'react'
import Header from '../Header/Header'
import { ContentContainerStyled, ContentWrapper } from './ContentStyles'
import { useSelector } from 'react-redux';

const Content = ({children}) => {
  const isOpen = useSelector((state) => state.aside.isOpen);

  return (
    <>
        <ContentContainerStyled isOpen={isOpen}>
            <Header/>
            <ContentWrapper>
                {children}
            </ContentWrapper>
        </ContentContainerStyled>
    </>
  )
}

export default Content