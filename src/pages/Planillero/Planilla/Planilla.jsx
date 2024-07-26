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
import { setCurrentStateModal, setDescOfTheMatch, toggleHiddenModal, toggleIdMatch } from '../../../redux/Planillero/planilleroSlice.js';
import ModalConfirmation from '../../../components/Stats/Incidents/ModalConfirmation.jsx';
import InputLong from '../../../components/UI/Input/InputLong.jsx';
import JugadoresEventuales from '../../../components/FormacionesPlanilla/JugadoresEventuales/JugadoresEventuales.jsx';
import { useLocation } from 'react-router-dom';
import { addActionToPlayer, addDescToMatch, toggleStateMatch } from '../../../redux/Matches/matchesSlice.js';

const Planilla = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const matches = useSelector((state) => state.match)
    // Obtenemos el id del partido enviado por URL en el Home Planillero
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));
    
    const partidos = useSelector((state) => state.match);
    const partido = partidos.find(p => p.ID === partidoId);
    const [canStartMatch, setCanStartMatch] = useState(false);
    const [descripcion, setDescripcion] = useState('');


    const matchCorrecto = matches.find((p) => p.ID === partidoId)

    // console.log(matchCorrecto);

    const handleChange = (event) => {
        setDescripcion(event.target.value)
    }

    useEffect(() => {
        dispatch(toggleIdMatch(partidoId));
    }, [dispatch, partidoId]);

    useEffect(() => {
        if (partido) {
            const localPlayers = partido.Local.Player.filter(player => player.status);
            const visitantePlayers = partido.Visitante.Player.filter(player => player.status);

            setCanStartMatch(localPlayers.length >= 5 && visitantePlayers.length >= 5);
        }
    }, [partido]);

    const handleStartMatch = () => {
        if (canStartMatch) {
            if (partido.matchState === 'isStarted') {
                dispatch(toggleHiddenModal());
                dispatch(setCurrentStateModal('matchFinish'));
            } else {
                dispatch(toggleStateMatch(partidoId));
            }
        } else {
            toast.error('Debe haber un mínimo de 5 jugadores por equipo registrados para comenzar');
        }
    };

    const pushInfoMatch = () => {
        dispatch(toggleHiddenModal());
        dispatch(setDescOfTheMatch(descripcion))
        dispatch(setCurrentStateModal('matchPush'));
    }

    const handleToastStartMatch = () => {
        if (canStartMatch) {
            toast.success('Partido comenzado', {
                duration: 4000,
            });
        }
    };

    if (!partido) {
        return <div>Loading...</div>;
    }

    return (
        <PlanillaContainerStyled className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Cronometro />
                <Section>
                    <h2>Ficha de partido</h2>
                    {<CardFinalPartido idPartido={partidoId} />}
                </Section>
                <FormacionesPlanilla idPartido={partidoId}/>
                <Incidents />

                <InputDescContainer>
                    <p>Descripcion del partido</p>
                    <InputLong id="description" name="description" placeholder="Escriba su descripcion aqui..." type="textarea" value={descripcion} onChange={handleChange} />
                </InputDescContainer>

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
