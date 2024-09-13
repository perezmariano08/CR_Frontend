import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { MatchStatsWrapper } from '../../MatchStats/MatchStatsStyles';
import Section from '../../../components/Section/Section';
import CardFinalPartido from '../../../components/Stats/CardFinalPartido/CardFinalPartido';
import Incidents from '../../../components/Stats/Incidents/Incidents';
import FormacionesPlanilla from '../../../components/FormacionesPlanilla/FormacionesPlanilla';
import ActionConfirmed from '../../../components/FormacionesPlanilla/ActionConfirmed/ActionConfirmed';
import ActionTime from '../../../components/FormacionesPlanilla/ActionTime/ActionTime';
import ActionAsisted from '../../../components/FormacionesPlanilla/ActionAsisted/ActionAsisted';
import Cronometro from '../../../components/FormacionesPlanilla/Cronometro/Cronometro.jsx';
import { ButtonContainer, ButtonMatch, InputDescContainer, PlanillaContainerStyled, SelectContainerStyled, SelectMvp } from './PlanillaStyles.js';
import EditDorsal from '../../../components/FormacionesPlanilla/EditDorsal/EditDorsal.jsx';
import ModalConfirmation from '../../../components/Stats/Incidents/ModalConfirmation.jsx';
import InputLong from '../../../components/UI/Input/InputLong.jsx';
import JugadoresEventuales from '../../../components/FormacionesPlanilla/JugadoresEventuales/JugadoresEventuales.jsx';
import Alignment from '../../../components/Stats/Alignment/Alignment.jsx';
import { SpinerContainer } from '../../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { usePlanilla } from '../../../hooks/usePlanilla.js';
import { GiSoccerKick } from "react-icons/gi";
import ModalSuspenderPartido from '../../../components/Stats/Incidents/ModalSuspenderPartido.jsx';
import Select from '../../../components/Select/Select.jsx';
import { useDispatch } from 'react-redux';
import { handleMvpSlice } from '../../../redux/Planillero/planilleroSlice.js';
import PenaltyOption from '../../../components/PenaltyOption/PenaltyOption.jsx';

const Planilla = () => {
    const dispatch = useDispatch();

    const [mvpSelected, setMvpSelected] = useState(0);
    const searchParams = new URLSearchParams(window.location.search);
    const partidoId = parseInt(searchParams.get('id'));

    const {
        partido,
        matchCorrecto,
        descripcion,
        bdFormaciones,
        bdIncidencias,
        handleChange,
        handleStartMatch,
        pushInfoMatch,
        handleToastStartMatch,
        formacionesConNombreApellido,
        suspenderPartido,
        jugadoresDescatados,
    } = usePlanilla(partidoId);

    const handleMvp = (e) => {
        const selectedValue = e.target.value;
        setMvpSelected(selectedValue);
    
        if (selectedValue) {
            dispatch(handleMvpSlice(selectedValue));
        }
    };

    if (!partido || !bdFormaciones || !bdIncidencias) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    return (
        <PlanillaContainerStyled className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Section>
                    <h2>Ficha de partido</h2>
                    <CardFinalPartido idPartido={partidoId} incidencias={bdIncidencias}/>
                </Section>
    
                {matchCorrecto.estado !== 'S' && (
                    <>
                        <Cronometro />
                        
                        {/* Formaciones solo cuando el partido está finalizado */}
                        {matchCorrecto.estado === 'F' && (
                            <Alignment formaciones={formacionesConNombreApellido} partido={matchCorrecto} />
                        )}
    
                        {matchCorrecto.estado !== 'F' && (
                            <>
                                <FormacionesPlanilla idPartido={partidoId} />
                                <SelectContainerStyled>
                                    <h3>Seleccionar <span>MVP</span></h3>
                                    <Select
                                        placeholder={'Seleccione un jugador'}
                                        icon={<GiSoccerKick className='icon-select' />}
                                        data={jugadoresDescatados}
                                        onChange={handleMvp}
                                        id_="id_jugador"
                                        column="nombre_jugador"
                                        value={mvpSelected}
                                        planilla={true}
                                    />
                                </SelectContainerStyled>
                                <PenaltyOption partido={matchCorrecto} />
                                <InputDescContainer>
                                    <p>Observaciones del partido</p>
                                    <InputLong 
                                        id="description" 
                                        name="description" 
                                        placeholder="Escriba su descripcion aqui..." 
                                        type="textarea" 
                                        value={descripcion} 
                                        onChange={handleChange} 
                                    />
                                </InputDescContainer>
                            </>
                        )}
    
                        {/* Mostrar incidencias siempre que el partido no esté suspendido */}
                        <Incidents incidentes={bdIncidencias} formaciones={formacionesConNombreApellido} partidoId={partidoId} />
                    </>
                )}
    
                {/* Botones al final */}
                {matchCorrecto.estado !== 'F' && (
                    <ButtonContainer>
                        {partido.matchState === null && (
                            <ButtonMatch 
                                className='started' 
                                onClick={() => {
                                    handleToastStartMatch();
                                    handleStartMatch();
                                }}>
                                Comenzar Partido
                            </ButtonMatch>
                        )}
                        {partido.matchState === 'isFinish' && (
                            <>
                                <ButtonMatch className='finish' onClick={handleStartMatch}>
                                    Partido Finalizado
                                </ButtonMatch>
    
                                <ButtonMatch onClick={pushInfoMatch}>
                                    Enviar información
                                </ButtonMatch>
                            </>
                        )}
                        {partido.matchState === 'isStarted' && (
                            <ButtonMatch onClick={handleStartMatch}>
                                Finalizar Partido
                            </ButtonMatch>
                        )}
                        {partido.matchState === 'matchPush' && (
                            <ButtonMatch className='finish' onClick={handleStartMatch}>
                                Partido cargado
                            </ButtonMatch>
                        )}
                        {partido.matchState !== 'matchPush' && (
                            <ButtonMatch className='suspender' onClick={suspenderPartido}>
                                Suspender Partido
                            </ButtonMatch>
                        )}
                    </ButtonContainer>
                )}
            </MatchStatsWrapper>
    
            {/* Modales al final */}
            <ActionConfirmed />
            <ActionAsisted />
            <ActionTime />
            <EditDorsal />
            <JugadoresEventuales />
            <ModalConfirmation />
            <ModalSuspenderPartido partido={matchCorrecto}/>
        </PlanillaContainerStyled>
    );
}

export default Planilla;
