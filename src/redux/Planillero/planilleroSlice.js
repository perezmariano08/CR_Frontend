import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: null,
  modalType: '',
  jugador: null,
  id_equipo: null,
  action: {
    type: null,
    detail: null,
  },
  enabledActionEdit: false,
  actionToEdit: {
    type: null,
    id_action: null,
    minute: null,
  },
  actionToDelete: {
    type: null,
    id_action: null,
    id_equipo: null,
    id_jugador: null,
  },
  mvpSelected: null,
  penales: {
    penal_local: 0,
    penal_visita: 0
  },
  description: null,
};

const planilleroSlice = createSlice({
  name: 'planillero',
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.modal = state.modal === action.payload ? null : action.payload;
    },
    setModalType: (state, action) => {
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
    setJugador: (state, action) => {
      state.jugador = action.payload;
    },
    setIdEquipo: (state, action) => {
      state.id_equipo = action.payload;
    },
    setAction: (state, action) => {
      state.action = {
        ...state.action,
        ...action.payload,
      };
    },
    setActionToEdit: (state, action) => {
      state.actionToEdit = {
        ...state.actionToEdit,
        ...action.payload,
      };
    },
    setActionToDelete: (state, action) => {
      state.actionToDelete = {
        ...state.actionToDelete,
        ...action.payload,
      };
    },
    setEnabledActionEdit: (state) => {
      state.enabledActionEdit = true;
    },
    setDisabledActionEdit: (state) => {
      state.enabledActionEdit = false;
    },
    handleMvpSelected: (state, action) => {
      state.mvpSelected = action.payload;
    },
    setPenales: (state, action) => {
      const { penalLocal, penalVisita } = action.payload;
      state.penales.penal_local = penalLocal;
      state.penales.penal_visita = penalVisita;
    },
    setDescripcionPartido: (state, action) => {
      state.description = action.payload;
    },
  }
});

export const {
  toggleModal,
  setJugador,
  setPenales,
  closeModal,
  setAction,
  setModalType,
  setIdEquipo,
  setActionToEdit,
  setEnabledActionEdit,
  setDisabledActionEdit,
  setActionToDelete,
  handleMvpSelected,
  setDescripcionPartido
} = planilleroSlice.actions;

export default planilleroSlice.reducer;
