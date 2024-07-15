import React from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';
import { useSelector } from 'react-redux';

const Select2 = ({ idTeam, currentActionPlayerId, onSelect }) => {
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const matches = useSelector((state) => state.match);
    const match = matches.find(p => p.ID === idPartido);
    
    const team = match.Local.id_equipo === idTeam ? match.Local : match.Visitante;

    const filteredPlayers = team.Player.filter(player => player.status && player.ID !== currentActionPlayerId);

    const handlePlayerSelect = (event) => {
        const playerId = event.target.value;
        onSelect(playerId);
    };

    return (
        <SelectContainerStyled>
            <SelectWrapper onChange={handlePlayerSelect}>
                <option value="" disabled>Elegir jugador</option>
                {filteredPlayers.map(player => (
                    <option key={player.ID} value={player.ID}>{player.Nombre} - {player.Dorsal}</option>
                ))}
            </SelectWrapper>
        </SelectContainerStyled>
    );
}

export default Select2;
