import React, { useEffect, useState } from 'react';
import { Cancha, Player, FormationRow, TableContainerStyled, TableTitle, TeamLogo, GuanteContainer } from './DreamteamUserStyles';
import { Divider } from 'primereact/divider';
import { armarDreamteam } from '../../../utils/dataFetchers';
import { useEquipos } from '../../../hooks/useEquipos';
import { URLImages } from '../../../utils/utils';
import { useDispatch } from 'react-redux';
import { TbHandStop } from "react-icons/tb";

const DreamteamUser = ({ fecha, id_categoria, zona }) => {
    const dispatch = useDispatch();
    const [players, setPlayers] = useState([]);
    const { escudosEquipos } = useEquipos();


    useEffect(() => {
        armarTeam();
    }, [fecha, id_categoria]);

    const armarTeam = async () => {
        const data = await armarDreamteam(id_categoria, fecha);
        setPlayers(Array.isArray(data) ? data : []); // Asegúrate de que sea un array
    };

    const renderPlayer = (player) => (
        <Player key={player.id_jugador}>
            <TeamLogo src={`${URLImages}${escudosEquipos(player.id_equipo)}`} alt={`Escudo del equipo ${player.id_equipo}`} />
            {/* <p>{player.nombre}</p> */}
            <p>{player.apellido}</p>
        </Player>
    );

    // Filtrar jugadores por posición
    const arquero = Array.isArray(players) ? players.filter(player => player.posicion.includes('arquero')) : [];
    const defensores = Array.isArray(players) ? players.filter(player => player.posicion.includes('defensor')) : [];
    const mediocampistas = Array.isArray(players) ? players.filter(player => player.posicion.includes('mediocampista')) : [];
    const delanteros = Array.isArray(players) ? players.filter(player => player.posicion.includes('delantero')) : [];

    // Retorno del componente
    return (
        players.length !== 0 && (
            <TableContainerStyled>
                <TableTitle>
                    <h3>Dreamteam</h3>
                    <p>Fecha {fecha} - {zona?.nombre_categoria}</p>
                </TableTitle>
                <Divider />
                <Cancha>
                    <>
                        {/* ARQUERO */}
                        <FormationRow>
                            {arquero.map(renderPlayer)}
                            {/* <GuanteContainer>
                                <TbHandStop />
                            </GuanteContainer> */}
                        </FormationRow>
                        {/* DEFENSORES */}
                        <FormationRow>
                            {defensores.map(renderPlayer)}
                        </FormationRow>
                        {/* MEDIOCAMPISTAS */}
                        <FormationRow>
                            {mediocampistas.map(renderPlayer)}
                        </FormationRow>
                        {/* DELANTEROS */}
                        <FormationRow>
                            {delanteros.map(renderPlayer)}
                        </FormationRow>
                    </>
                </Cancha>
            </TableContainerStyled>
        )
    );
};

export default DreamteamUser;
