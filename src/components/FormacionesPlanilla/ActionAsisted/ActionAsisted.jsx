import React, { useState } from 'react';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, AssistOptContainer, IconClose, OptionGolContainer, OptionGolWrapper } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Select2 from '../../UI/Select/Select2';

import { useDispatch, useSelector } from 'react-redux';
import { setNewAssist, toggleHiddenAction, toggleHiddenAsist, toggleHiddenTime } from '../../../redux/Planillero/planilleroSlice';

const ActionAsisted = () => {
    const dispatch = useDispatch();
    const hiddenAsist = useSelector((state) => state.planillero.asist.hidden);

    //Cerrar componente clickeando en el overlay
    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(toggleHiddenAsist());
        }
    };

    //Boton siguiente
    const handleNext = () => {

        //Envio de objeto al slice con la data del gol
        const dataGol = {
            penal: penalSeleccionado,
            enContra: enContraSeleccionado,
            withAssist: asistenciaSeleccionada === "si" ? true : false,
            idAssist: asistenciaSeleccionada === "si" ? selectedPlayer : null,
        }
        dispatch(setNewAssist(dataGol))

        //Cerrar y abrir ventanas
        dispatch(toggleHiddenAsist());
        dispatch(toggleHiddenTime());

        //Reiniciar estados
        setPenalSeleccionado(null);
        setEnContraSeleccionado(null);
        setAsistenciaSeleccionada(null);
        setSelectedPlayer('');
    };

    //Logica volver atras
    const handleBack = () => {
        dispatch(toggleHiddenAsist());
        dispatch(toggleHiddenAction());
    };

    //Logica enabled
    const [penalSeleccionado, setPenalSeleccionado] = useState(null);
    const [enContraSeleccionado, setEnContraSeleccionado] = useState(null);
    const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);

    const handlePenalChange = (event) => {
        setPenalSeleccionado(event.target.value);
        setEnContraSeleccionado(null);
        setAsistenciaSeleccionada(null);
    };

    const handleEnContraChange = (event) => {
        setEnContraSeleccionado(event.target.value);
        setPenalSeleccionado(null);
        setAsistenciaSeleccionada(null);
    };

    const handleAsistenciaChange = (event) => {
        setAsistenciaSeleccionada(event.target.value);
        setPenalSeleccionado(null);
        setEnContraSeleccionado(null);
    };

    //Enviar local team true o false al select para la filtracion
    const planillaData = useSelector((state) => state.planillero.planilla.localTeam)
    const playerActionId = useSelector((state) => state.planillero.planilla.playerSelected)

    // Estado para almacenar el jugador seleccionado
    const [selectedPlayer, setSelectedPlayer] = useState('');

    //Logica para validar enabled del boton
    const isButtonEnabled = () => {
        if (asistenciaSeleccionada === "si" && selectedPlayer !== '') {
            return true;
        }
        if (penalSeleccionado === "si" || enContraSeleccionado === "si" || asistenciaSeleccionada === 'no' ) {
            return true;
        }
        return false;
    };
    
    return (
        <>
        {!hiddenAsist && (
            <ActionConfirmedContainer onClick={handleOverlayClick}>
                <ActionConfirmedWrapper>
                    <ActionBackContainer>
                        <ActionBack onClick={handleBack}>
                            <HiArrowLeft />
                            <p>Volver</p>
                    </ActionBack>
                    <IconClose>
                        <HiMiniXMark onClick={() => dispatch(toggleHiddenAsist())}/>
                    </IconClose>
                    </ActionBackContainer>

                    <ActionTitle>
                        <h3>Indique la opción del Gol</h3>
                        <AlignmentDivider/>
                    </ActionTitle>

                    <ActionsContainer>
                        <OptionGolWrapper>
                            <OptionGolContainer>
                                <h4>¿El gol fue de penal?</h4>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="penal"
                                        value="si"
                                        checked={penalSeleccionado === "si"}
                                        onChange={handlePenalChange}
                                    />
                                    <label htmlFor="penal">Si</label>
                                </AssistOptContainer>
                            </OptionGolContainer>

                            <OptionGolContainer>
                                <h4>¿El gol fue en contra?</h4>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="enContra"
                                        value="si"
                                        checked={enContraSeleccionado === "si"}
                                        onChange={handleEnContraChange}
                                    />
                                    <label htmlFor="enContra">Si</label>
                                </AssistOptContainer>
                            </OptionGolContainer>
                        </OptionGolWrapper>

                        <h4>¿Hubo asistencia?</h4>
                        <AssistOptContainer>
                            <input 
                                type="radio"
                                name="asistencia"
                                value="si"
                                checked={asistenciaSeleccionada === "si"}
                                onChange={handleAsistenciaChange}
                            />
                            <label htmlFor="asistencia">Si</label>
                        </AssistOptContainer>
                        <AssistOptContainer>
                            <input 
                                type="radio"
                                name="asistencia"
                                value="no"
                                checked={asistenciaSeleccionada === "no"}
                                onChange={handleAsistenciaChange}
                            />
                            <label htmlFor="asistencia">No</label>    
                        </AssistOptContainer>
                        {asistenciaSeleccionada === "si" && (
                            <Select2 
                                localTeam={planillaData}
                                currentActionPlayerId={playerActionId}
                                onSelect={(playerId) => setSelectedPlayer(playerId)}
                            />
                        )}
                    </ActionsContainer>
                    <ActionNext 
                    onClick={handleNext}
                    className={!isButtonEnabled() ? 'disabled' : ''}
                    >Siguiente
                    </ActionNext>
                </ActionConfirmedWrapper>
            </ActionConfirmedContainer>
        )}
        </>
    );
}

export default ActionAsisted;
