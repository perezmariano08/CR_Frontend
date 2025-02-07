import React from 'react'
import { Jugador, JugadorDatos, JugadorPartidoContainer, JugadorPartidoTitulo, LogoJugador } from './JugadorPartidoStyles'
import { MdOutlineStarRate } from "react-icons/md";
import { useJugadores } from '../../../hooks/useJugadores';
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';

const JugadorDelPartido = ({ formaciones, partido }) => {
    const mejorJugador = formaciones?.find(f => +f.id_jugador === +partido.jugador_destacado);
    const { fotosJugadores, nombresJugadores } = useJugadores();
    const { escudosEquipos, nombresEquipos } = useEquipos();
    return (
        <JugadorPartidoContainer>
            <JugadorPartidoTitulo>
                <MdOutlineStarRate/>
                Jugador del partido
                <MdOutlineStarRate/>
            </JugadorPartidoTitulo>
            <Jugador>
                <span>{mejorJugador.dorsal}</span>
                <LogoJugador>
                    <img
                        className='logo-jugador'
                        src={`${URLImages}/${fotosJugadores(mejorJugador.id_jugador)}`}
                        alt='Jugador'
                    />
                    <img
                        className='logo-equipo'
                        src={`${URLImages}/${escudosEquipos(mejorJugador.id_equipo)}`}
                        alt='Equipo'
                    />
                </LogoJugador>
                <JugadorDatos>
                    <h4>{` ${mejorJugador.nombre} ${mejorJugador.apellido}`}</h4>
                    <p>{nombresEquipos(mejorJugador.id_equipo)}</p>
                </JugadorDatos>
                
            </Jugador>
            
        </JugadorPartidoContainer>
    )
}

export default JugadorDelPartido