import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dorsal: {
    hidden: true,
    playerSelected: null,
    playerSelectedName: null
  },
  asist: {
    hidden: true,
    dataGol: {}
  },
  planilla: {
    hidden: true,
    navigationSource: '',
    localTeam: null,
    dorsalPlayer: null,
    playerSelected: null,
    actionPlayer: null,
    playerName: null,
    actions: []
  },
  planillaTime: {
    hidden: true,
    newTime: ''
  },
  modal: {
    hidden: true,
    modalState: null,
    dorsalDelete: null,
    idDorsalDelete: null,
    currentTeam: null,
  },
  actionToDelete: null,
  actionEdit: null,
  actionEditEnabled: false,
  infoDelete: {
    idPartido: null,
    idEquipo: null,
    idJugador: null
  },
  playerEvent: {
    hidden: true,
    idPlayerTeam: null,
  },
  playerEventData: {
    state: null,
    dorsal: null,
    dni: null,
    nombre: null,
    apellido: null
  },
  timeMatch: {
    matchState: null,
    idMatch: null,
    desc: null,
    jugador_destacado: null
  },
  
};

const planilleroSlice = createSlice({
  name: 'planillero',
  initialState,
  reducers: {
    handleBestPlayerOfTheMatch: (state, action) => {
      state.timeMatch.jugador_destacado = action.payload;
    },
    toggleHiddenDorsal: (state) => {
      state.dorsal.hidden = !state.dorsal.hidden;
    },
    toggleHiddenAsist: (state) => {
      state.asist.hidden = !state.asist.hidden;
    },
    setNavigationSource: (state, action) => {
      state.planilla.navigationSource = action.payload;
    },
    toggleHiddenAction: (state) => {
      state.planilla.hidden = !state.planilla.hidden;
    },
    setNewTime: (state, action) => {
      state.planillaTime.newTime = action.payload;
    },
    toggleHiddenTime: (state) => {
      state.planillaTime.hidden = !state.planillaTime.hidden;
    },
    setPlayerSelected: (state, action) => {
      state.dorsal.playerSelected = action.payload;
    },
    setPlayerSelectedAction: (state, action) => {
      state.planilla.playerSelected = action.payload;
    },
    setActionPlayer: (state, action) => {
      state.planilla.actionPlayer = action.payload;
    },
    setdorsalPlayer: (state, action) => {
      state.planilla.dorsalPlayer = action.payload;
    },
    setNamePlayer: (state, action) => {
      state.planilla.playerName = action.payload;
    },
    setIsLocalTeam: (state, action) => {
      state.planilla.localTeam = action.payload;
    },
    handleConfirm: (state, action) => {
      const { partidoId, isLocalTeam, idJugador, nombreJugador, dorsal, accion, minuto } = action.payload;

      // Agregar la nueva acción
      let nuevaAccion = { partidoId, isLocalTeam, idJugador, nombreJugador, dorsal, accion, minuto };

      const isGolEnContra = state.asist.dataGol.enContra;

      if (isGolEnContra) {
          nuevaAccion.isLocalTeam = !isLocalTeam;
      }

      if (accion === 'Gol') {
          nuevaAccion.golDetails = state.asist.dataGol;
      }

      state.planilla.actions.push(nuevaAccion);

      state.planilla.actions.sort((a, b) => {
          const minuteA = parseInt(a.minuto);
          const minuteB = parseInt(b.minuto);

          if (minuteA < minuteB) {
              return -1;
          }
          if (minuteA > minuteB) {
              return 1;
          }
          return 0;
      });
  },         
    setNamePlayerSelected: (state, action) => {
      state.dorsal.playerSelectedName = action.payload;
    },
    setNewAssist: (state, action) => {
      state.asist.dataGol = action.payload;
    },
    toggleIdMatch: (state, action) => {
      state.timeMatch.idMatch = action.payload
    },
    toggleHiddenModal: (state) => {
      state.modal.hidden = !state.modal.hidden;
    },    
    setActionToDelete: (state, action) => {
      state.actionToDelete = action.payload;
    },
    deleteAction: (state, action) => {
      const { editedAction, isEdit } = action.payload;

      if (isEdit) {
        state.planilla.actions = state.planilla.actions.map(act => {
          if (areActionsEqual(act, state.actionToDelete)) {
            return { ...editedAction };
          }
          return act;
        });
      } else {
        state.planilla.actions = state.planilla.actions.filter(act => !areActionsEqual(act, state.actionToDelete));
      }
      state.actionToDelete = null;

      function areActionsEqual(action1, action2) {
        if (!isEdit) {
          return action1.idJugador === action2.idJugador && action1.minuto === action2.minuto;
        } else {
          return action1.idJugador === action2.idJugador
        }

      }
    },
    setActionToEdit: (state, action) => {
      state.actionEdit = action.payload;
    },
    setEnabledActionEdit: (state) => {
      state.actionEditEnabled = true;
    },
    setDisabledActionEdit: (state) => {
      state.actionEditEnabled = false;
    },
    setCurrentStateModal: (state, action) => {
      state.modal.modalState = action.payload;
    },
    setCurrentDorsalDelete: (state, action) => {
      state.modal.dorsalDelete = action.payload;
    },
    setCurrentIdDorsalDelete: (state, action) => {
      state.modal.idDorsalDelete = action.payload;
    },
    setCurrentCurrentTeamPlayerDelete: (state, action) => {
      state.modal.currentTeam = action.payload;
    },
    eliminarAccionesPorDorsal: (state, action) => {
      const { dorsal, isLocalTeam } = action.payload;
      state.planilla.actions = state.planilla.actions.filter((accion) => {
        return !(accion.dorsal === dorsal && accion.isLocalTeam === isLocalTeam);
      });
    },
    toggleHiddenPlayerEvent: (state) => {
      state.playerEvent.hidden = !state.playerEvent.hidden
    },
    handleTeamPlayer: (state, action) => {
      state.playerEvent.idPlayerTeam = action.payload
    },
    setInfoDelete: (state, action) => {
      const {idPartido, idEquipo, idJugador} = action.payload;
      state.infoDelete.idPartido = idPartido;
      state.infoDelete.idEquipo = idEquipo;
      state.infoDelete.idJugador = idJugador;
    },
    setInfoPlayerEvent: (state, action) => {
      const {DNI, Dorsal, nombre, apellido} = action.payload;
      state.playerEventData.dni = DNI;
      state.playerEventData.dorsal = Dorsal;
      state.playerEventData.nombre = nombre;
      state.playerEventData.apellido = apellido;
    },
    setEnabledStateInfoPlayerEvent: (state) => {
      state.playerEventData.state = true;
    },
    setDisabledStateInfoPlayerEvent: (state) => {
      state.playerEventData.state = false;
    },
    setDescOfTheMatch: (state, action) => {
      state.timeMatch.desc = action.payload;
    }
  }
});

export const {
  toggleMatchTimes,
  toggleHiddenDorsal,
  setNewDorsal,
  toggleHiddenAsist,
  setNavigationSource,
  toggleHiddenAction,
  setNewTime,
  toggleHiddenTime,
  setPlayerSelected,
  setPlayerSelectedAction,
  setActionPlayer,
  setdorsalPlayer,
  setNamePlayer,
  setIsLocalTeam,
  handleConfirm,
  setNamePlayerSelected,
  setNewAssist,
  // toggleStateMatch,
  toggleHiddenModal,
  setActionToDelete,
  deleteAction,
  setCurrentStateModal,
  setCurrentDorsalDelete,
  setCurrentIdDorsalDelete,
  eliminarAccionesPorDorsal,
  setCurrentCurrentTeamPlayerDelete,
  toggleHiddenPlayerEvent,
  handleTeamPlayer,
  toggleIdMatch,
  setActionToEdit,
  setEnabledActionEdit,
  setDisabledActionEdit,
  setInfoDelete,
  setInfoPlayerEvent,
  setEnabledStateInfoPlayerEvent,
  setDisabledStateInfoPlayerEvent,
  setDescOfTheMatch,
  handleBestPlayerOfTheMatch
} = planilleroSlice.actions;

export default planilleroSlice.reducer;
