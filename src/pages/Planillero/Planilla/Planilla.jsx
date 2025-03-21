import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { MatchStatsWrapper } from '../../MatchStats/MatchStatsStyles';
import Section from '../../../components/Section/Section';
import CardFinalPartido from '../../../components/Stats/CardFinalPartido/CardFinalPartido';
import Incidents from '../../../components/Stats/Incidents/Incidents';
import FormacionesPlanilla from '../../../components/FormacionesPlanilla/FormacionesPlanilla';
import ActionTime from '../../../components/FormacionesPlanilla/ActionTime/ActionTime';
import ActionDetailGol from '../../../components/FormacionesPlanilla/ActionAsisted/ActionDetailGol.jsx';
import Cronometro from '../../../components/FormacionesPlanilla/Cronometro/Cronometro.jsx';
import { ButtonContainer, ButtonMatch, InputDescContainer, PlanillaContainerStyled, SelectContainerStyled } from './PlanillaStyles.js';
import EditDorsal from '../../../components/FormacionesPlanilla/EditDorsal/EditDorsal.jsx';
import ModalConfirmation from '../../../components/Stats/Incidents/ModalConfirmation.jsx';
import InputLong from '../../../components/UI/Input/InputLong.jsx';
import JugadoresEventuales from '../../../components/FormacionesPlanilla/JugadoresEventuales/JugadoresEventuales.jsx';
import Alignment from '../../../components/Stats/Alignment/Alignment.jsx';
import { SpinerContainer } from '../../../Auth/SpinerStyles.js';
import { TailSpin } from 'react-loader-spinner';
import { GiSoccerKick } from "react-icons/gi";
import ModalSuspenderPartido from '../../../components/Stats/Incidents/ModalSuspenderPartido.jsx';
import Select from '../../../components/Select/Select.jsx';
import { useDispatch, useSelector } from 'react-redux';
import PenaltyOption from '../../../components/PenaltyOption/PenaltyOption.jsx';
import { FaCloudArrowUp } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { FaPlay, FaRegStopCircle } from "react-icons/fa";
import CardPartidoIda from '../../../components/Stats/CardPartidoIda/CardPartidoIda.jsx';
import { obtenerTipoPartido } from '../../../components/Stats/statsHelpers.js';
import { useIncidencias } from '../../../hooks/planilla/useIncidencias.js';
import { useFormaciones } from '../../../hooks/planilla/useFormaciones.js';
import ActionType from '../../../components/FormacionesPlanilla/ActionConfirmed/ActionType.jsx';
import ActionDetailRoja from '../../../components/FormacionesPlanilla/ActionAsisted/ActionDetailRoja.jsx';
import useJugadoresDestacados from '../../../hooks/planilla/useJugadoresDestacados.js';
import { setDescripcionPartido } from '../../../redux/Planillero/planilleroSlice.js';
import usePartido from '../../../hooks/planilla/usePartido.js';

const Planilla = () => {
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const descripcionRedux = useSelector((state) => state.planillero.description);
    
    const searchParams = new URLSearchParams(window.location.search);
    const partidoId = parseInt(searchParams.get('id'));

    //hooks nuevos
    const { partidoFiltrado, handleStartMatch, pushInfoMatch, suspenderPartido, partidoIda } = usePartido(partidoId, toast, token)
    const { incidencias, fetchIncidencias } = useIncidencias(partidoId, token);
    const { formaciones, socketLoading: loading_socket_formaciones, setFormaciones, fetchFormaciones } = useFormaciones(partidoId, token)
    const { handleMvp, mvpSelectedRedux, jugadoresDestacados, fetchJugadoresDestacados } = useJugadoresDestacados(partidoId, partidoFiltrado.estado, toast, token);
    
    const estadoPartido = partidoFiltrado.estado;
    
    const handleChangeDescripcion = (e) => {
        dispatch(setDescripcionPartido(e.target.value));
    };

    if (!partidoFiltrado || !incidencias || !formaciones) {
        return (
            <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
        );
    }

    const esVuelta = obtenerTipoPartido(partidoFiltrado)

    return (
      <PlanillaContainerStyled className="container">
        <MatchStatsWrapper className="wrapper">
          <Section>
            <h2>Ficha de partido</h2>
            {esVuelta === "vuelta" && <CardPartidoIda partido={partidoIda} />}
            <CardFinalPartido
              partido={partidoFiltrado}
              incidencias={incidencias}
            />
          </Section>

          {partidoFiltrado.estado !== "S" && (
            <>
              <Cronometro partido={partidoFiltrado} />
              {partidoFiltrado.estado === "F" && (
                <Alignment
                  formaciones={formaciones}
                  partido={partidoFiltrado}
                />
              )}

              {partidoFiltrado.estado !== "F" && (
                <FormacionesPlanilla
                  partido={partidoFiltrado}
                  formacionesPartido={formaciones}
                  setFormaciones={setFormaciones}
                  fetchJugadoresDestacados={fetchJugadoresDestacados}
                />
              )}

              <Incidents
                incidencias={incidencias}
                formaciones={formaciones}
                partido={partidoFiltrado}
              />

              {partidoFiltrado.estado !== "F" && (
                <>
                  <SelectContainerStyled>
                    <h3>
                      Seleccionar <span>MVP</span>
                    </h3>
                    <Select
                      placeholder={"Seleccione un jugador"}
                      icon={<GiSoccerKick className="icon-select" />}
                      data={jugadoresDestacados}
                      onChange={handleMvp}
                      id_="id_jugador"
                      column="nombre_completo"
                      value={mvpSelectedRedux || ""}
                      planilla={true}
                      disabled={estadoPartido !== "T"}
                    />
                  </SelectContainerStyled>

                  <PenaltyOption partido={partidoFiltrado} />

                  <InputDescContainer>
                    <p>Observaciones del partido</p>
                    <InputLong
                      id="description"
                      name="description"
                      placeholder="Escriba su descripcion aqui..."
                      type="textarea"
                      value={descripcionRedux || ""}
                      onChange={handleChangeDescripcion}
                    />
                  </InputDescContainer>
                </>
              )}
            </>
          )}

          <ButtonContainer>
            {estadoPartido === "S" ? (
              <ButtonMatch className="suspender">
                <ImCross />
                Partido Suspendido
              </ButtonMatch>
            ) : (
              <>
                {estadoPartido === "P" && (
                  <ButtonMatch
                    className="started"
                    onClick={() => {
                      handleStartMatch();
                    }}
                  >
                    <FaPlay />
                    Comenzar Partido
                  </ButtonMatch>
                )}
                {estadoPartido === "T" && (
                  <ButtonMatch onClick={pushInfoMatch}>
                    <FaCloudArrowUp />
                    Subir partido
                  </ButtonMatch>
                )}
                {estadoPartido === "C" && (
                  <ButtonMatch onClick={handleStartMatch}>
                    <FaRegStopCircle />
                    Finalizar Partido
                  </ButtonMatch>
                )}
                {estadoPartido === "F" && (
                  <ButtonMatch className="finish">Partido cargado</ButtonMatch>
                )}
                {estadoPartido !== "F" && (
                  <ButtonMatch className="suspender" onClick={suspenderPartido}>
                    <ImCross />
                    Suspender Partido
                  </ButtonMatch>
                )}
              </>
            )}
          </ButtonContainer>
        </MatchStatsWrapper>

        <ActionType />
        <ActionDetailGol formaciones={formaciones} />
        <ActionDetailRoja formaciones={formaciones} />
        <ActionTime
          id_partido={partidoId}
          formaciones={formaciones}
          fetchIncidencias={fetchIncidencias}
          setFormaciones={setFormaciones}
        />

        <EditDorsal
          id_partido={partidoId}
          formaciones={formaciones}
          id_edicion={partidoFiltrado.id_edicion}
          setFormaciones={setFormaciones}
        />
        <ModalConfirmation fetchIncidencias={fetchIncidencias} setFormaciones={setFormaciones} fetchFormaciones={fetchFormaciones} />
        <JugadoresEventuales
          partido={partidoFiltrado}
          formaciones={formaciones}
        />

        <ModalSuspenderPartido partido={partidoFiltrado}/>

        <Toaster />
      </PlanillaContainerStyled>
    );
};

export default Planilla;
