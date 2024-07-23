import React from 'react'
import CardFinalPartido from '../../components/Stats/CardFinalPartido/CardFinalPartido'
import Section from "../../components/Section/Section"
import { MatchStatsContainer, MatchStatsWrapper } from './MatchStatsStyles'
import Alignment from '../../components/Stats/Alignment/Alignment'
import Incidents from '../../components/Stats/Incidents/Incidents'

const MatchStats = () => {
  const searchParams = new URLSearchParams(location.search);
  const partidoId = parseInt(searchParams.get('id'));

  return (
    <MatchStatsContainer className='container'>
      <MatchStatsWrapper className='wrapper'>
        
        <Section>
          <h2>Ficha de Partido</h2>
          <CardFinalPartido idPartido={partidoId}/>
        </Section>

        <Alignment/>
        <Incidents/>

      </MatchStatsWrapper>
    </MatchStatsContainer>
  )
}

export default MatchStats