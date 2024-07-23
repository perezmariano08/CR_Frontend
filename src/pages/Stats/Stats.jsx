import React, { useState } from 'react'
import { StatsContainerStyled, StatsFilter, StatsFilterButton, StatsHeadContainer, StatsWrapper } from './StatsStyles'
import Table from "../../components/Stats/Table/Table"
import Fixture from '../../components/Stats/Fixture/Fixture'
import { IoShieldHalf } from 'react-icons/io5'
import Select from '../../components/Select/Select'
import { useSelector } from 'react-redux'

const Stats = () => {
    const temporadas = useSelector((state) => state.temporadas.data)
    const equipos = useSelector((state) => state.equipos.data);

    const [temporadaSeleccionada, setTemporadaSeleccionada] = useState();

    const handleTemporada = (e) => {
        setTemporadaSeleccionada(e.target.value)
    }

    return (
        <StatsContainerStyled className='container'>
            <StatsWrapper className='wrapper'>

                <StatsHeadContainer>
                    <Select 
                        data={temporadas} 
                        placeholder='Seleccionar temporada' 
                        column='nombre_temporada'
                        id_='id_temporada'
                        icon={<IoShieldHalf className='icon-select' />}
                        value={temporadaSeleccionada}
                        onChange={handleTemporada}
                    />
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

                <Fixture temporada={temporadaSeleccionada}/>
                
            </StatsWrapper>
        </StatsContainerStyled>
    )
}

export default Stats