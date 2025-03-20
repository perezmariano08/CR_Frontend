import React from 'react'
import { CardPartidoTitles, CardPartidoWrapper, CardPartidoTeams, CardPartidoTeam, CardPartidoInfo, CardPartidoDivider, CardPartidoGoalsContainer, CardPartidoGoalsColumn } from "../CardPartido/CardPartidoStyles";
import { Skeleton } from 'primereact/skeleton';
import { HiLifebuoy } from "react-icons/hi2";

const CardFinalPartidoLoading = () => {
    return (
        <CardPartidoWrapper>
            <CardPartidoTitles>
                <Skeleton width="80%" height="5px" />
            </CardPartidoTitles>
            <CardPartidoTeams>
                <CardPartidoTeam>
                    <Skeleton shape='circle' width="40px" height="40px" />
                    <Skeleton width="100px" height="10px" />
                </CardPartidoTeam>
                <CardPartidoInfo>
                    <Skeleton width="60px" height="30px" />
                    <Skeleton width="80px" height="16px" />
                </CardPartidoInfo>
                <CardPartidoTeam>
                    <Skeleton shape='circle' width="40px" height="40px" />
                    <Skeleton width="100px" height="10px" />
                </CardPartidoTeam>
            </CardPartidoTeams>
            <CardPartidoDivider />
            <CardPartidoGoalsContainer>
                <CardPartidoGoalsColumn>
                    <Skeleton count={2} width="90%" height="10px" />
                </CardPartidoGoalsColumn>
                <HiLifebuoy />
                <CardPartidoGoalsColumn className="visita">
                    <Skeleton count={2} width="90%" height="10px" />
                </CardPartidoGoalsColumn>
            </CardPartidoGoalsContainer>
        </CardPartidoWrapper>
    )
}

export default CardFinalPartidoLoading