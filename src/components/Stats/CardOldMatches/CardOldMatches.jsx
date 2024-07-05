import React from 'react'
import { CardOldMatchesItem, CardOldMatchesWrapper, MatchesItemDescription, MatchesItemResult, MatchesItemTeam, MatchesItemTeams } from './CardOldMatchesStyles'
import { AlignmentDivider, AlignmentPlayer } from '../Alignment/AlignmentStyles'
import EscudoCelta from '/Escudos/celta-de-vino.png'
const CardOldMatches = () => {
    return (
        <CardOldMatchesWrapper>
            <h3>Ultimos partidos</h3>
            <AlignmentDivider/>
            <CardOldMatchesItem>
                <MatchesItemDescription>
                    <p>Sabado 03/02</p>
                    <p>Fecha 10 - Apertura 2024</p>
                </MatchesItemDescription>
                <MatchesItemTeams>
                    <MatchesItemTeam>
                        <p>T-USA FC</p>
                        <img src={EscudoCelta} />
                    </MatchesItemTeam>
                    <MatchesItemResult>
                        4-1
                    </MatchesItemResult>
                    <MatchesItemTeam>
                        <img src={EscudoCelta} />
                        <p>T-USA FC</p>
                    </MatchesItemTeam>
                </MatchesItemTeams>
                
            </CardOldMatchesItem>
            <AlignmentDivider/>
            <CardOldMatchesItem>
                <MatchesItemDescription>
                    <p>Sabado 03/02</p>
                    <p>Fecha 10 - Apertura 2024</p>
                </MatchesItemDescription>
                <MatchesItemTeams>
                    <MatchesItemTeam>
                        <p>T-USA FC</p>
                        <img src={EscudoCelta} />
                    </MatchesItemTeam>
                    <MatchesItemResult>
                        4-1
                    </MatchesItemResult>
                    <MatchesItemTeam>
                        <img src={EscudoCelta} />
                        <p>T-USA FC</p>
                    </MatchesItemTeam>
                </MatchesItemTeams>
                
            </CardOldMatchesItem>
            <AlignmentDivider/>
            <CardOldMatchesItem>
                <MatchesItemDescription>
                    <p>Sabado 03/02</p>
                    <p>Fecha 10 - Apertura 2024</p>
                </MatchesItemDescription>
                <MatchesItemTeams>
                    <MatchesItemTeam>
                        <p>T-USA FC</p>
                        
                        <img src={EscudoCelta} />
                    </MatchesItemTeam>
                    <MatchesItemResult>
                        4-1
                    </MatchesItemResult>
                    <MatchesItemTeam>
                        <img src={EscudoCelta} />
                        <p>T-USA FC</p>
                    </MatchesItemTeam>
                </MatchesItemTeams>
                
            </CardOldMatchesItem>
            <AlignmentDivider/>
        </CardOldMatchesWrapper>
    )
}

export default CardOldMatches