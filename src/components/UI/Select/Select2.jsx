import React from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';
import { useSelector } from 'react-redux';

const Select2 = ({ idTeam, currentActionPlayerId, onSelect, action }) => {
    
    const idPartido = useSelector((state) => state.planillero.timeMatch.idMatch);
    const matches = useSelector((state) => state.match);
    const match = matches.find(p => p.ID === idPartido);
    const team = match.Local.id_equipo === idTeam ? match.Local : match.Visitante;
    const filteredPlayers = team.Player.filter(player => player.status && player.ID !== currentActionPlayerId && player.sancionado !== 'S');

    const handleSelectChange = (event) => {
        const value = event.target.value;
        onSelect(value);
    };

    return (
        <SelectContainerStyled>
            <SelectWrapper onChange={handleSelectChange}>
                {action === 'Roja' ? (
                    <>
                        <option value="" disabled>Indique el tipo</option>
                        <option value="Patada">Patada</option>
                        <option value="Agresion verbal">Agresión verbal</option>
                        <option value="Agresion fisica">Agresión física</option>
                        <option value="Otro">Otro</option>
                    </>
                ) : (
                    <>
                        <option value="" disabled>Elegir jugador</option>
                        {filteredPlayers.map(player => (
                            <option key={player.ID} value={player.ID}>{player.Nombre} - {player.Dorsal}</option>
                        ))}
                    </>
                )}
            </SelectWrapper>
        </SelectContainerStyled>
    );
};

export default Select2;
