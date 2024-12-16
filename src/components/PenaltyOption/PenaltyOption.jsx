import React, { useState, useEffect } from 'react';
import { OptionContainer, OptionsContainer, PenaltyContainer, PenaltyWrapper, CustomCheckbox, CheckboxLabel, CustomInput, HiddenOptionContainer, TeamContainer } from './PenaltyOptionStyles';
import { AlignmentDivider } from '../Stats/Alignment/AlignmentStyles';
import { useEquipos } from '../../hooks/useEquipos';
import { URLImages } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setPenales } from '../../redux/Planillero/planilleroSlice';

const PenaltyOption = ({ partido }) => {
    const dispatch = useDispatch();

    const penalLocalState = useSelector((state) => state.planillero.penales?.penal_local);
    const penalVisitaState = useSelector((state) => state.planillero.penales?.penal_visita);
    
    const [showInputs, setShowInputs] = useState(false);
    const [penalLocal, setPenalLocal] = useState(penalLocalState || 0);
    const [penalVisita, setPenalVisita] = useState(penalVisitaState || 0);

    const { nombresEquipos, escudosEquipos } = useEquipos();

    useEffect(() => {
        if (penalLocalState != null && penalVisitaState != null) {
            setShowInputs(true);
        }
    }, [penalLocalState, penalVisitaState]);

    useEffect(() => {
        setPenalLocal(penalLocalState);
        setPenalVisita(penalVisitaState);
    }, [penalLocalState, penalVisitaState]);

    const handleCheckboxChange = () => {
        const newShowInputs = !showInputs;
        setShowInputs(newShowInputs);
    
        if (!newShowInputs) {
            setPenalLocal(null);
            setPenalVisita(null);
            dispatch(setPenales({ penalLocal: null, penalVisita: null }));
        } else {
            setPenalLocal(0);
            setPenalVisita(0);
            dispatch(setPenales({ penalLocal, penalVisita }));
        }
    };
    
    const handleLocalChange = (e) => {
        const value = e.target.value;

        if (value === '' || /^\d+$/.test(value)) {
            const newValue = value === '' ? 0 : parseInt(value);
            setPenalLocal(newValue);
            dispatch(setPenales({ penalLocal: newValue, penalVisita }));
        }
    };

    const handleVisitaChange = (e) => {
        const value = e.target.value;

        if (value === '' || /^\d+$/.test(value)) {
            const newValue = value === '' ? 0 : parseInt(value);
            setPenalVisita(newValue);
            dispatch(setPenales({ penalLocal, penalVisita: newValue }));
        }
    };

    return (
        <PenaltyContainer>
            <PenaltyWrapper>
                <h3>Penales</h3>
                <AlignmentDivider />
                <OptionsContainer>
                    <OptionContainer>
                        <CustomCheckbox id="penalty" checked={showInputs} onChange={handleCheckboxChange} />
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
};

export default PenaltyOption;
