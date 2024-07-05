import React from 'react'
import Header from '../Header/Header'
import { ContentContainerStyled, ContentWrapper } from './ContentStyles'

const Content = ({children}) => {
  return (
    <>
        
        <ContentContainerStyled>
            <Header/>
            <ContentWrapper>
                {children}
            </ContentWrapper>
        </ContentContainerStyled>
    </>
  )
}

export default Content