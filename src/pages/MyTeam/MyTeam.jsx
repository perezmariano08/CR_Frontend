import React from 'react'
import { MyTeamTitleContainer, MyTeamInfo, MyTeamName, MyTeamContainerStyled, MyTeamWrapper, MyTeamMatches, MyTeamMatchesItem, MyTeamMatchesDivisor } from './MyTeamStyles'
import Celta from '/Escudos/celta-de-vino.png'
import Section from '../../components/Section/Section'
import Table from '../../components/Stats/Table/Table'
import TableTeam from '../../components/Stats/TableTeam/TableTeam'
import CardOldMatches from '../../components/Stats/CardOldMatches/CardOldMatches'
const MyTeam = () => {
    return (
        <>
        <MyTeamTitleContainer>
            <MyTeamInfo>
                <img src={Celta} alt="" srcset="" />
                <MyTeamName>
                    <h2>Celta de Vino</h2>
                    <h3>Serie A</h3>
                </MyTeamName>
            </MyTeamInfo>
            
        </MyTeamTitleContainer>
        <MyTeamContainerStyled className='container'>
            <MyTeamWrapper className='wrapper'>
                <Section>
                    <h2>Partidos</h2>
                    <MyTeamMatches>
                        <MyTeamMatchesItem className='pj'>
                            <h4>10</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PJ</h5>
                        </MyTeamMatchesItem>
                        <MyTeamMatchesItem className='pg'>
                            <h4>10</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PG</h5>
                        </MyTeamMatchesItem>
                        <MyTeamMatchesItem className='pp'>
                            <h4>10</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PP</h5>
                        </MyTeamMatchesItem>
                        <MyTeamMatchesItem className='pe'>
                            <h4>10</h4>
                            <MyTeamMatchesDivisor/>
                            <h5>PE</h5>
                        </MyTeamMatchesItem>
                    </MyTeamMatches>
                </Section>

                <Section>
                    <h2>Plantel</h2>
                    <TableTeam/>
                </Section>
                    
                <Section>
                    <h2>Posiciones</h2>
                    <Table/>
                </Section>

                <Section>
                    <CardOldMatches/>
                </Section>

            </MyTeamWrapper>
        </MyTeamContainerStyled>
        </>
)
}

export default MyTeam