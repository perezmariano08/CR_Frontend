import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
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
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStateModal, toggleHiddenModal, toggleStateMatch } from '../../../redux/Planillero/planilleroSlice.js';
import ModalConfirmation from '../../../components/Stats/Incidents/ModalConfirmation.jsx';
import InputLong from '../../../components/UI/Input/InputLong.jsx';
import JugadoresEventuales from '../../../components/FormacionesPlanilla/JugadoresEventuales/JugadoresEventuales.jsx';
import { useLocation } from 'react-router-dom';

const Planilla = () => {
    const location = useLocation();
    
    const searchParams = new URLSearchParams(location.search);
    const partidoId = searchParams.get('id');

    const dispatch = useDispatch();
    const estadoPartido = useSelector((state) => state.planillero.timeMatch.matchState);
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find(p => p.id_partido === parseInt(partidoId));

    const match = useSelector((state) => state.match);
    const [canStartMatch, setCanStartMatch] = useState(false);

    useEffect(() => {
        const canStart = match.every(team => {
            const playersWithStatusTrue = team.Player.filter(player => player.status);
            return playersWithStatusTrue.length >= 5;
        });

        setCanStartMatch(canStart);
    }, [match]);

    const handleStartMatch = () => {
        if (canStartMatch) {
            if (estadoPartido === 'isStarted') {
                dispatch(toggleHiddenModal());
                dispatch(setCurrentStateModal('matchFinish'));
            } else {
                dispatch(toggleStateMatch());
            }
        } else {
            toast.error('Debe haber un mínimo de 5 jugadores por equipo registrados para comenzar');
        }
    }

    const handleToastStartMatch = () => {
        if (canStartMatch) {
            toast.success('Partido comenzado', {
                duration: 4000,
            });
        }
    }

    return (
        <PlanillaContainerStyled className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Cronometro />
                <Section>
                    <h2>Ficha de partido</h2>
                    {<CardFinalPartido idPartido={partidoId} />}
                </Section>
                <FormacionesPlanilla />
                <Incidents />

                <InputDescContainer>
                    <p>Escriba aquí alguna observacion o descripción del partido</p>
                    <InputLong id="uniqueId" name="fieldName" placeholder="Escribe aquí" />
                    <ButtonMatch>
                        Enviar
                    </ButtonMatch>
                </InputDescContainer>

                <ButtonContainer>
                    {estadoPartido === null && (
                        <ButtonMatch className='started' 
                            onClick={() => {
                                handleToastStartMatch();
                                handleStartMatch();
                            }}>
                            Comenzar Partido
                        </ButtonMatch>
                    )}
                    {estadoPartido === 'isFinish' && (
                        <ButtonMatch 
                            className='finish'
                            onClick={handleStartMatch}>
                            Partido Finalizado
                        </ButtonMatch>
                    )}
                    {estadoPartido === 'isStarted' && (
                        <ButtonMatch onClick={handleStartMatch}>
                            Finalizar Partido
                        </ButtonMatch>
                    )}
                    {estadoPartido === 'finish' && (
                        <ButtonMatch 
                            className='finish'
                            onClick={handleStartMatch}>
                            Partido Finalizado
                        </ButtonMatch>
                    )}
                </ButtonContainer>
                
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
