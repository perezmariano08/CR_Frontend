import React from 'react'
import { HeroContainer, HeroText, HeroWrapper } from './HeroStyles'

const Hero = () => {
    return (
        <HeroContainer>
            <HeroWrapper>
                <HeroText>
                    <h2>¡No TE pierdas la oportunidad de jugar en el <span>mejor torneo</span> de F7 de Córdoba!</h2>
                    <p>Contamos con un equipo de trabajo para brindarte esa experiencia que necesitas en un torneo de futbol.</p>
                </HeroText>
                
            </HeroWrapper>
        </HeroContainer>
    )
}

export default Hero