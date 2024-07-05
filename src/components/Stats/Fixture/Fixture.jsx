import React from 'react'
import { FixtureMatch, FixtureMatchInfo, FixtureMatchTeam, FixtureTitle, FixtureWrapper } from './FixtureStyles'
import { TableTitleDivider } from '../Table/TableStyles'
import EscudoCelta from '/Escudos/celta-de-vino.png'
import EscudoPuraQuimica from '/Escudos/pura-quimica.png'

const Fixture = () => {
  return (
    <FixtureWrapper>
        <FixtureTitle>
            <h3>Sábado 19/02/2024</h3>
            <p>Fecha 01</p>
        </FixtureTitle>
        <TableTitleDivider/>
        <FixtureMatch>
            <FixtureMatchTeam>
                <h4>Celta de Vino</h4>
                <img src={EscudoCelta} alt="" />
            </FixtureMatchTeam>
            <FixtureMatchInfo>
                <h5>14:00</h5>
                <p>Cancha 01</p>
            </FixtureMatchInfo>
            <FixtureMatchTeam className='visit'>
                <img src={EscudoPuraQuimica} alt="" />
                <h4>Pura Quimica</h4>
            </FixtureMatchTeam>
        </FixtureMatch>
        <TableTitleDivider/>
        <FixtureMatch>
            <FixtureMatchTeam>
                <h4>Celta de Vino</h4>
                <img src={EscudoCelta} alt="" />
            </FixtureMatchTeam>
            <FixtureMatchInfo>
                <h5>14:00</h5>
                <p>Cancha 01</p>
            </FixtureMatchInfo>
            <FixtureMatchTeam className='visit'>
                <img src={EscudoPuraQuimica} alt="" />
                <h4>Pura Quimica</h4>
            </FixtureMatchTeam>
        </FixtureMatch>
        <TableTitleDivider/>
        <FixtureMatch>
            <FixtureMatchTeam>
                <h4>Celta de Vino</h4>
                <img src={EscudoCelta} alt="" />
            </FixtureMatchTeam>
            <FixtureMatchInfo>
                <h5>14:00</h5>
                <p>Cancha 01</p>
            </FixtureMatchInfo>
            <FixtureMatchTeam className='visit'>
                <img src={EscudoPuraQuimica} alt="" />
                <h4>Pura Quimica</h4>
            </FixtureMatchTeam>
        </FixtureMatch>
        <TableTitleDivider/>
        <FixtureMatch>
            <FixtureMatchTeam>
                <h4>Celta de Vino</h4>
                <img src={EscudoCelta} alt="" />
            </FixtureMatchTeam>
            <FixtureMatchInfo>
                <h5>14:00</h5>
                <p>Cancha 01</p>
            </FixtureMatchInfo>
            <FixtureMatchTeam className='visit'>
                <img src={EscudoPuraQuimica} alt="" />
                <h4>Pura Quimica</h4>
            </FixtureMatchTeam>
        </FixtureMatch>
        <TableTitleDivider/>
        <FixtureMatch>
            <FixtureMatchTeam>
                <h4>Celta de Vino</h4>
                <img src={EscudoCelta} alt="" />
            </FixtureMatchTeam>
            <FixtureMatchInfo>
                <h5>14:00</h5>
                <p>Cancha 01</p>
            </FixtureMatchInfo>
            <FixtureMatchTeam className='visit'>
                <img src={EscudoPuraQuimica} alt="" />
                <h4>Pura Quimica</h4>
            </FixtureMatchTeam>
        </FixtureMatch>
        
    </FixtureWrapper>
  )
}

export default Fixture