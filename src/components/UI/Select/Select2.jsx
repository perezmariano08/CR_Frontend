import React from 'react';
import { SelectContainerStyled, SelectWrapper } from './SelectStyles';

const Select2 = ({ idTeam, onSelect, action, formaciones }) => {
    const team = formaciones?.filter((j) => j.id_equipo === idTeam)
    const jugadoresHabilitados = team?.filter((j) => j.rojas < 1 && j.amarillas < 2)
    console.log(jugadoresHabilitados);

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
                        {jugadoresHabilitados.map(player => (
                            <option key={player.id_jugador} value={player.id_jugador}>{player.nombre} {player.apellido} - {player.dorsal}</option>
                        ))}
                    </>
                )}
            </SelectWrapper>
        </SelectContainerStyled>
    );
};

export default Select2;
