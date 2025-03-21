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
import { ButtonContainer, ButtonMatch, InputDescContainer, PlanillaContainerStyled, SelectContainerStyled } from './PlanillaStyles.js';
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
import { useDispatch, useSelector } from 'react-redux';
import { handleMvpSlice, setDescripcionPartido } from '../../../redux/Planillero/planilleroSlice.js';
import PenaltyOption from '../../../components/PenaltyOption/PenaltyOption.jsx';
import { FaCloudArrowUp } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { FaPlay, FaRegStopCircle } from "react-icons/fa";
import { fetchPartidos } from '../../../redux/ServicesApi/partidosSlice.js';
import { useWebSocket } from '../../../Auth/WebSocketContext.jsx';
import { insertarMvp } from '../../../utils/dataFetchers.js';
import CardPartidoIda from '../../../components/Stats/CardPartidoIda/CardPartidoIda.jsx';
import { obtenerTipoPartido } from '../../../components/Stats/statsHelpers.js';

const Planilla = () => {
    const dispatch = useDispatch();
    const descripcionRedux = useSelector((state) => state.planillero.planilla.descripcionPartido);

    const [mvpSelected, setMvpSelected] = useState(0);
    const jugadoresDestacados = useSelector((state) => state.planillero.jugadoresDestacados);

    const searchParams = new URLSearchParams(window.location.search);
    const partidoId = parseInt(searchParams.get('id'));
    
    const {
        partido,
        matchCorrecto,
        descripcion,
        bdFormaciones,
        setBdFormaciones,
        bdIncidencias,
        handleChange,
        handleStartMatch,
        pushInfoMatch,
        handleToastStartMatch,
        formacionesConNombreApellido,
        suspenderPartido,
        estadoPartido,
        partidoIda
    } = usePlanilla(partidoId);
    
    const handleChangeDescripcion = (e) => {
        dispatch(setDescripcionPartido(e.target.value));
    };

    const handleMvp = async (e) => {
        if (estadoPartido !== 'T') {
            return toast.error('Finaliza el partido para seleccionar un MVP');
        }
    
        const selectedValue = e.target.value;
        const toastId = toast.loading('Cargando...');
        const delay = 300;
    
        try {
            const response = await insertarMvp(partidoId, selectedValue);
            if (response.status === 200) {
                setTimeout(() => {
                    toast.success('MVP agregado correctamente', { id: toastId });
                    setMvpSelected(selectedValue);
                    dispatch(handleMvpSlice(selectedValue));
                }, delay);
            } else {
                setTimeout(() => {
                    toast.error('Error al agregar el MVP', { id: toastId });
                }, delay);
            }
        } catch (error) {
            console.error(error);
            setTimeout(() => {
                toast.error('Error en la solicitud', { id: toastId });
            }, 2000);
        } finally {
            setTimeout(() => {
                toast.dismiss(toastId);
            }, delay);
        }
    };

    useEffect(() => {
        dispatch(fetchPartidos());
    }, [dispatch]);

    if (!partido || !bdFormaciones || !bdIncidencias) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    const esVuelta = obtenerTipoPartido(matchCorrecto)

    return (
        <PlanillaContainerStyled className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Section>
                    <h2>Ficha de partido</h2>
                    {
                        esVuelta === 'vuelta' && (
                            <CardPartidoIda partido={partidoIda} />
                        )
                    }
                    <CardFinalPartido idPartido={partidoId} />
                </Section>

                {matchCorrecto.estado !== 'S' && (
                    <>
                        <Cronometro />
                        {matchCorrecto.estado === 'F' && (
                            <Alignment formaciones={formacionesConNombreApellido} partido={matchCorrecto} />
                        )}

                        {matchCorrecto.estado !== 'F' && (
                            <FormacionesPlanilla idPartido={partidoId} formacionesPartido={bdFormaciones} />
                        )}

                        <Incidents formaciones={formacionesConNombreApellido} partidoId={partidoId} />

                        {matchCorrecto.estado !== 'F' && (
                            <>
                                <SelectContainerStyled>
                                    <h3>Seleccionar <span>MVP</span></h3>
                                    <Select
                                        placeholder={'Seleccione un jugador'}
                                        icon={<GiSoccerKick className='icon-select' />}
                                        data={jugadoresDestacados}
                                        onChange={handleMvp}
                                        id_="id_jugador"
                                        column="nombre_completo"
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
                                        value={descripcionRedux} 
                                        onChange={handleChangeDescripcion} 
                                    />
                                </InputDescContainer>
                            </>
                        )}
                    </>
                )}

        <ButtonContainer>
            {estadoPartido === 'S' ? (
                <ButtonMatch className='suspender'>
                    <ImCross />
                    Partido Suspendido
                </ButtonMatch>
            ) : (
                <>
                    {estadoPartido === 'P' && (
                        <ButtonMatch
                            className='started'
                            onClick={() => {
                                handleToastStartMatch();
                                handleStartMatch();
                            }}>
                            <FaPlay />
                            Comenzar Partido
                        </ButtonMatch>
                    )}
                    {estadoPartido === 'T' && (
                        <ButtonMatch onClick={pushInfoMatch}>
                            <FaCloudArrowUp />
                            Subir partido
                        </ButtonMatch>
                    )}
                    {estadoPartido === 'C' && (
                        <ButtonMatch onClick={handleStartMatch}>
                            <FaRegStopCircle />
                            Finalizar Partido
                        </ButtonMatch>
                    )}
                    {estadoPartido === 'F' && (
                        <ButtonMatch className='finish'>
                            Partido cargado
                        </ButtonMatch>
                    )}
                    {estadoPartido !== 'F' && (
                        <ButtonMatch className='suspender' onClick={suspenderPartido}>
                            <ImCross />
                            Suspender Partido
                        </ButtonMatch>
                    )}
                </>
            )}
        </ButtonContainer>
        
            </MatchStatsWrapper>

            <ActionConfirmed />
            <ActionAsisted />
            <ActionTime />
            <EditDorsal formaciones={bdFormaciones} setBdFormaciones={setBdFormaciones} />
            <JugadoresEventuales />
            <ModalConfirmation />
            <ModalSuspenderPartido partido={matchCorrecto} />
            <Toaster />
        </PlanillaContainerStyled>
    );
};

export default Planilla;
