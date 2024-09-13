import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    currentUser: null,
    hiddenMenu: true,
    newUser: {
        dni: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        clave: '',
        equipoFav: ''
    },
    currentUser: {
        isLog: false,
        dni: '',
        nombre: '',
        equipo: '',
    },
    forgotPasssword: {
        resend: false,
        counter: 0,
    },
    equipoSeleccionado: 1,
};

const userSlice = createSlice({
    name: "user",
    initialState: INITIAL_STATE,
    reducers: {
        setNuevoEquipoSeleccionado: (state, action) => {
            state.equipoSeleccionado = action.payload;
        },
        setCurrentUser: (state, action) => {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
        toggleHiddenMenu: (state) => {
            return {
                ...state,
                hiddenMenu: !state.hiddenMenu,
            };
        },
        setNewUser: (state, action) => {
            return {
                ...state,
                newUser: action.payload,
            };
        },
        setNewUserPassword: (state, action) => {
            state.newUser.clave = action.payload;
        },
        setNewUserTeamFavorite: (state, action) => {
            state.newUser.equipoFav = action.payload;
        },
        setLogCurrentUser: (state, action) => {
            if (state.currentUser) { // Verificar que currentUser no sea null
                state.currentUser.isLog = action.payload;
            } else {
                console.error('currentUser es null');
            }
        },
        handleResendPassword: (state) => {
            state.forgotPasssword.resend = !state.forgotPasssword.resend
        },
        setCounter: (state, action) => {
            state.forgotPasssword.counter = action.payload;
        },
    },
});

export const {setNuevoEquipoSeleccionado, setCurrentUser, toggleHiddenMenu, setNewUser, setNewUserPassword, setNewUserTeamFavorite, setLogCurrentUser, handleResendPassword, setCounter} = userSlice.actions;

export default userSlice.reducer;