import React from 'react'
import { StatsContainerStyled, StatsFilter, StatsFilterButton, StatsHeadContainer, StatsWrapper } from './StatsStyles'
import Table from "../../components/Stats/Table/Table"
import Fixture from '../../components/Stats/Fixture/Fixture'
import { dataEquipos } from '../../Data/Equipos/DataEquipos'
import { IoShieldHalf } from 'react-icons/io5'
import Select from '../../components/Select/Select'

const Stats = () => {
    return (
        <StatsContainerStyled className='container'>
            <StatsWrapper className='wrapper'>

                <StatsHeadContainer>
                    <Select data={dataEquipos} placeholder={'Seleccionar equipo'} icon={<IoShieldHalf className='icon-select' />}>
                    </Select>
                    <StatsFilter>

                        <StatsFilterButton>
                            Fixture
                        </StatsFilterButton>

                        <StatsFilterButton className='active'>
                            Posiciones
                        </StatsFilterButton>
                        
                        <StatsFilterButton>
                            Goleadores
                        </StatsFilterButton>

                        <StatsFilterButton>
                            Asistencias
                        </StatsFilterButton>

                        <StatsFilterButton>
                            Expulsados
                        </StatsFilterButton>
                    </StatsFilter>
                </StatsHeadContainer>

                <Table>

                </Table>

                <Table>
                    
                </Table>

                <Fixture/>
                
            </StatsWrapper>
        </StatsContainerStyled>
    )
}

export default Stats