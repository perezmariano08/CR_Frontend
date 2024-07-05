import React from 'react'
import { NewContainer, NewFoot, NewWrapper } from './NewStyled'

const NewMain = () => {
  return (
    <NewWrapper>
        <NewContainer>
            <img src="/back_login.jpg" alt="" />
        </NewContainer>
        <h2>Enterate de las ultimas noticias del mejor torneo de Cordoba!</h2>
        <NewFoot>
            <img src="/public/Logos/CR-Logo.png" alt="" className='logo_foot' />
            <p>Copa Relámpago - hace 3 horas</p>
        </NewFoot>
    </NewWrapper>
  )
}

export default NewMain