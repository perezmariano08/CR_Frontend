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
import Axios from 'axios';
import { URL } from '../../../utils/utils.js';
import Alignment from '../../../components/Stats/Alignment/Alignment.jsx';

const Planilla = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const matches = useSelector((state) => state.match);
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));
    const partidos = useSelector((state) => state.match);
    const partido = partidos.find(p => p.ID === partidoId);
    const match = useSelector((state) => state.partidos.data);
    const matchCorrecto = match.find(p => p.id_partido === partidoId);
    const [canStartMatch, setCanStartMatch] = useState(false);
    const [descripcion, setDescripcion] = useState('');

    const handleChange = (event) => {
        setDescripcion(event.target.value);
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
        dispatch(setDescOfTheMatch(descripcion));
        dispatch(setCurrentStateModal('matchPush'));
    }

    const handleToastStartMatch = () => {
        if (canStartMatch) {
            toast.success('Partido comenzado', {
                duration: 4000,
            });
        }
    };

    // Traer información de la base de datos
    // FORMACIONES
    const [bdFormaciones, setBdFormaciones] = useState(null);

    const getFormaciones = async () => {
        try {
            const res = await Axios.get(`${URL}/user/get-partidos-formaciones?id_partido=${partidoId}`);
            const data = res.data;
            setBdFormaciones(data);
        } catch (error) {
            console.error('Error en el front', error);
        }
    }

    useEffect(() => {
        getFormaciones();
    }, []);

    // INCIDENCIAS
    const [bdIncidencias, setBdIncidencias] = useState(null);

    const getIndicencias = async () => {
        try {
            const res = await Axios.get(`${URL}/user/get-partidos-incidencias?id_partido=${partidoId}`);
            const data = res.data;
            setBdIncidencias(data);
        } catch (error) {
            console.error('Error en el front', error);
        }
    }

    useEffect(() => {
        getIndicencias();
    }, []);
    
    if (!partido) {
        return <div>Loading...</div>;
    }

    const { Local, Visitante } = partido;
    const localTeamId = Local.id_equipo;
    const visitingTeamId = Visitante.id_equipo;

    const formacionesConNombreApellido = bdFormaciones?.reduce((acc, formacion) => {
        const { id_jugador, id_equipo, dorsal } = formacion;
        const equipo = id_equipo === localTeamId ? Local : Visitante;
        const jugador = equipo.Player.find(player => player.ID === id_jugador);

        const playerData = {
            id_equipo,
            id_jugador,
            dorsal,
            nombre: jugador?.Nombre.split(' ')[0],
            apellido: jugador?.Nombre.split(' ')[1]
        };

        if (id_equipo === localTeamId) {
            acc.local.push(playerData);
        } else if (id_equipo === visitingTeamId) {
            acc.visitante.push(playerData);
        }

        return acc;
    }, { local: [], visitante: [] });

    console.log(bdIncidencias);


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
                        <Alignment formaciones={formacionesConNombreApellido}/>
                    ) : (
                        <FormacionesPlanilla idPartido={partidoId} />
                    )
                }
                <Incidents incidentes={bdIncidencias}/>

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
