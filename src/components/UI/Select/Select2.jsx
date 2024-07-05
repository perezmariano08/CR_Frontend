// Select2.js
import React from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';
import { useSelector } from 'react-redux';

const Select2 = ({ localTeam, currentActionPlayerId, onSelect }) => {
    const listPlayers = useSelector((state) => state.match);

    const filteredPlayers = listPlayers
        .find(team => team.Local === localTeam)
        .Player
        .filter(player => player.status && player.ID !== currentActionPlayerId); // Excluir al jugador de la acción

    const handlePlayerSelect = (event) => {
        const playerId = event.target.value;
        onSelect(playerId); // Llama a la función onSelect con el ID del jugador seleccionado
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
