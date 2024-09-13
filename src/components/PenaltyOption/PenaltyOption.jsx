import React, { useState } from 'react';
import { OptionContainer, OptionsContainer, PenaltyContainer, PenaltyWrapper, CustomCheckbox, CheckboxLabel, CustomInput, HiddenOptionContainer, TeamContainer } from './PenaltyOptionStyles';
import { AlignmentDivider } from '../Stats/Alignment/AlignmentStyles';
import { useEquipos } from '../../hooks/useEquipos';
import { URLImages } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import { setPenales } from '../../redux/Planillero/planilleroSlice';

const PenaltyOption = ({partido}) => {
    const dispatch = useDispatch();
    const [showInputs, setShowInputs] = useState(false);
    const [penalLocal, setPenalLocal] = useState(0);
    const [penalVisita, setPenalVisita] = useState(0);

    const {nombresEquipos, escudosEquipos} = useEquipos();

    const handleCheckboxChange = () => {
        const newShowInputs = !showInputs;
    
        setShowInputs(newShowInputs);
        
        if (!newShowInputs) {
            setPenalLocal(0);
            setPenalVisita(0);
            dispatch(setPenales({ penalLocal: null, penalVisita: null }));
        }
    };

    const handleLocalChange = (e) => {
        const value = e.target.value;
    
        if (value === '' || /^\d+$/.test(value)) {
            setPenalLocal(value === '' ? '' : parseInt(value));
            dispatch(setPenales({ penalLocal: value === '' ? 0 : parseInt(value), penalVisita }));
        }
    };
    
    const handleVisitaChange = (e) => {
        const value = e.target.value;
    
        if (value === '' || /^\d+$/.test(value)) {
            setPenalVisita(value === '' ? '' : parseInt(value));
            dispatch(setPenales({ penalLocal, penalVisita: value === '' ? 0 : parseInt(value) }));
        }
    };
    
    return (
        <PenaltyContainer>
            <PenaltyWrapper>
                <h3>Penales</h3>
                <AlignmentDivider />
                <OptionsContainer>
                    <OptionContainer>
                        <CustomCheckbox id="penalty" onChange={handleCheckboxChange} />
                        <CheckboxLabel htmlFor="penalty">Definición por penales</CheckboxLabel>
                    </OptionContainer>
                    <HiddenOptionContainer show={showInputs}>
                        <OptionContainer>
                            <OptionContainer>
                                <TeamContainer>
                                    <img src={`${URLImages}/${escudosEquipos(partido.id_equipoLocal)}`} alt="" />
                                    <h3>{nombresEquipos(partido.id_equipoLocal)}</h3>
                                </TeamContainer>
                                <CustomInput 
                                    type="number"
                                    value={penalLocal}
                                    onChange={handleLocalChange}
                                />
                            </OptionContainer>
                            <OptionContainer>
                                <CustomInput 
                                    type="number"
                                    value={penalVisita}
                                    onChange={handleVisitaChange}
                                />
                                <TeamContainer>
                                    <h3>{nombresEquipos(partido.id_equipoVisita)}</h3>
                                    <img src={`${URLImages}/${escudosEquipos(partido.id_equipoVisita)}`} alt="" />
                                </TeamContainer>
                            </OptionContainer>
                        </OptionContainer>
                    </HiddenOptionContainer>
                </OptionsContainer>
            </PenaltyWrapper>
        </PenaltyContainer>
    );
}

export default PenaltyOption;
