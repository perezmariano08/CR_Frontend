import React from 'react'
import { CardPartidoIdaTitles, CardPartidoIdaWrapper, ContentPartidoIda, EquipoContainer, PartidoIdaResultado } from './CardPartidoIdaStyles'
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';

const CardPartidoIda = ({ partido }) => {
    const { escudosEquipos } = useEquipos();

    return (
        <CardPartidoIdaWrapper>
            <CardPartidoIdaTitles>
                <h3>Partido de ida</h3>
                <h4>{`${partido.dia}-${partido.hora}`}</h4>
            </CardPartidoIdaTitles>
            <ContentPartidoIda>
                <EquipoContainer>
                    <img src={`${URLImages}${escudosEquipos(partido?.id_equipoLocal)}`} alt="" />
                </EquipoContainer>
                <PartidoIdaResultado>
                    <h5>{partido.goles_local}-{partido.goles_visita}</h5>
                </PartidoIdaResultado>
                <EquipoContainer>
                <img src={`${URLImages}${escudosEquipos(partido?.id_equipoVisita)}`} alt="" />
                </EquipoContainer>
            </ContentPartidoIda>
        </CardPartidoIdaWrapper>
    )
}

export default CardPartidoIda