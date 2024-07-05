import React from 'react'
import { NewsStylesContainer, NewsWrapper } from './NewsStyles'
import Section from '../../components/Section/Section'
import NewMain from '../../components/News/NewMain'
import New from '../../components/News/New'

const News = () => {
  return (
    <NewsStylesContainer>
        <NewsWrapper>
            <Section>
                <h2>Noticias</h2>
                <NewMain/>
                <NewMain/>
                <NewMain/>
                <New/>
                <New/>
                <New/>
                <New/>
            </Section>
        </NewsWrapper>
    </NewsStylesContainer>
  )
}

export default News