import React from 'react'
import { AlignmentDivider, AlignmentLocal, AlignmentPlayer, AlignmentPlayerContainer, AlignmentTeam, AlignmentTeams, AlignmentVisit, AlignmentWrapper } from './AlignmentStyles'
import EscudoCelta from '/Escudos/celta-de-vino.png'

const Alignment = () => {
  return (
    <AlignmentWrapper>
        <h3>Formaciones</h3>
        <AlignmentDivider/>
        <AlignmentTeams>

          <AlignmentTeam>
            <img src={EscudoCelta} alt="" />
            <h3>Celta de Vino</h3>
          </AlignmentTeam>

          <AlignmentTeam>
            <h3>Celta de Vino</h3>
            <img src={EscudoCelta} alt="" />
          </AlignmentTeam>

        </AlignmentTeams>

        <AlignmentPlayerContainer>
          <AlignmentLocal>
            <AlignmentPlayer>
              <h4>1</h4>
              <p>PERES SEIA, Conrado</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

          </AlignmentLocal>
          <AlignmentVisit>
            <AlignmentPlayer>
              <h4>1</h4>
              <p>PERES SEIA, Conrado</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

            <AlignmentPlayer>
              <h4>2</h4>
              <p>BOMONE, Matias</p>
            </AlignmentPlayer>

          </AlignmentVisit>
        </AlignmentPlayerContainer>
    </AlignmentWrapper>
  )
}

export default Alignment