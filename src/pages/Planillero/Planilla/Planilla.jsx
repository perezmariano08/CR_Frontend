import React from 'react';
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
import { ButtonContainer, ButtonMatch, InputDescContainer, PlanillaContainerStyled } from './PlanillaStyles.js';
import EditDorsal from '../../../components/FormacionesPlanilla/EditDorsal/EditDorsal.jsx';
import ModalConfirmation from '../../../components/Stats/Incidents/ModalConfirmation.jsx';
import InputLong from '../../../components/UI/Input/InputLong.jsx';
import JugadoresEventuales from '../../../components/FormacionesPlanilla/JugadoresEventuales/JugadoresEventuales.jsx';
import Alignment from '../../../components/Stats/Alignment/Alignment.jsx';
import { SpinerContainer } from '../../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { usePlanilla } from '../../../hooks/usePlanilla.js';

const Planilla = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const partidoId = parseInt(searchParams.get('id'));

    const {
        partido,
        matchCorrecto,
        canStartMatch,
        descripcion,
        bdFormaciones,
        bdIncidencias,
        handleChange,
        handleStartMatch,
        pushInfoMatch,
        handleToastStartMatch,
        formacionesConNombreApellido
    } = usePlanilla(partidoId);

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
                <Cronometro />
                <Section>
                    <h2>Ficha de partido</h2>
                    <CardFinalPartido idPartido={partidoId} incidencias={bdIncidencias}/>
                </Section>
                {
                    matchCorrecto.estado === 'F' ? (
                        <Alignment formaciones={formacionesConNombreApellido} partido={matchCorrecto}/>
                    ) : (
                        <FormacionesPlanilla idPartido={partidoId} />
                    )
                }
                <Incidents incidentes={bdIncidencias} formaciones={formacionesConNombreApellido} partidoId={partidoId}/>

                {
                    matchCorrecto.estado !== 'F' && (
                    <InputDescContainer>
                        <p>Descripcion del partido</p>
                        <InputLong id="description" name="description" placeholder="Escriba su descripcion aqui..." type="textarea" value={descripcion} onChange={handleChange} />
                    </InputDescContainer>
                    )
                }
                {
                    matchCorrecto.estado !== 'F' && (
                    <ButtonContainer>
                        {partido.matchState === null && (
                            <ButtonMatch className='started' 
                                onClick={() => {
                                    handleToastStartMatch();
                                    handleStartMatch();
                                }}>
                                Comenzar Partido
                            </ButtonMatch>
                        )}
                        {partido.matchState === 'isFinish' && (
                            <>
                            <ButtonMatch 
                                className='finish'
                                onClick={handleStartMatch}>
                                Partido Finalizado
                            </ButtonMatch>

                            <ButtonMatch 
                                onClick={pushInfoMatch}>
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
                                <ButtonMatch 
                                className='finish'
                                onClick={handleStartMatch}>
                                Partido cargado
                            </ButtonMatch>
                        )}
                    </ButtonContainer>
                    )
                }
                {/* Ventanas */}
                <ActionConfirmed />
                <ActionAsisted />
                <ActionTime />
                <EditDorsal />
                <JugadoresEventuales />
                <ModalConfirmation />
            </MatchStatsWrapper>
            <Toaster />
        </PlanillaContainerStyled>
    );
}

export default Planilla;
