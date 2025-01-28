import React from 'react'
import { NotFoundButton, NotFoundContainer, NotFoundSubtitle, NotFoundTitle } from './NotFoundStyles'

const NotFound = () => {
  return (
    <NotFoundContainer>
        <NotFoundTitle>Oops!</NotFoundTitle>
        <NotFoundSubtitle>Error 404</NotFoundSubtitle>
        <NotFoundSubtitle>Página no encontrada</NotFoundSubtitle>
        <NotFoundButton to="/">Volver a la página principal</NotFoundButton>
    </NotFoundContainer>
  )
}

export default NotFound