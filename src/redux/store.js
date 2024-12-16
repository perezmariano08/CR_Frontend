import { combineReducers, configureStore } from "@reduxjs/toolkit"
import persistReducer from "redux-persist/es/persistReducer"
import persistStore from "redux-persist/lib/persistStore"
import storage from "redux-persist/lib/storage"

import notisReducer from "./Notis/notisSlice"
import planilleroReducer from "./Planillero/planilleroSlice"
import matchesReducer from "./Matches/matchesSlice"
import newUserReducer from "./user/userSlice"
import selectedRowsReducer from "./SelectedRows/selectedRowsSlice";

import añosReducer from "./ServicesApi/añosSlice";
import sedesReducer from "./ServicesApi/sedesSlice";
import torneosReducer from "./ServicesApi/torneosSlice";
import categoriasReducer from "./ServicesApi/categoriasSlice";
import temporadasReducer from "./ServicesApi/temporadasSlice"
import divisionesReducer from "./ServicesApi/divisionesSlice"
import jugadoresReducer from "./ServicesApi/jugadoresSlice"
import jugadoresDestacadosReducer from "./ServicesApi/jugadoresDestacadosSlice"
import usuariosReducer from "./ServicesApi/usuariosSlice"
import partidosReducer from "./ServicesApi/partidosSlice"
import equiposReducer from "./ServicesApi/equiposSlice"
import rolesReducer from "./ServicesApi/rolesSlice"
import expulsadosReducer from "./ServicesApi/expulsadosSlice"
import asideReducer from "./Aside/asideSlice";
import edicionesReducer from "./ServicesApi/edicionesSlice"
import plantelesReducer from "./ServicesApi/plantelesSlice"
import zonasReducer from "./ServicesApi/zonasSlice"
import fasesReducer from "./ServicesApi/fasesSlice"

const reducers = combineReducers({
    notis: notisReducer,
    planillero: planilleroReducer,
    match: matchesReducer,
    newUser: newUserReducer,
    selectedRows: selectedRowsReducer,
    años: añosReducer,
    sedes: sedesReducer,
    torneos: torneosReducer,
    categorias: categoriasReducer,
    temporadas: temporadasReducer,
    divisiones: divisionesReducer,
    jugadores: jugadoresReducer,
    usuarios: usuariosReducer,
    partidos: partidosReducer,
    equipos: equiposReducer,
    roles: rolesReducer,
    expulsados: expulsadosReducer,
    aside: asideReducer, 
    ediciones: edicionesReducer,
    planteles: plantelesReducer,
    zonas: zonasReducer,
    fases: fasesReducer,
    jugadoresDestacados: jugadoresDestacadosReducer
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "notis", 
        "planillero", 
        "match", 
        "newUser", 
        "selectedRows",
        "años",
        "sedes",
        "torneos",
        "categorias",
        "temporadas",
        "divisiones",
        "usuarios",
        "partidos",
        "equipos",
        "roles",
        "expulsados",
        "aside",
        "ediciones",
        "planteles",
        "fases"
    ]
}

//al persist se le pasa como segundo parametro los reducers que va a consumir, y los que se guardan en localStorage son los incluidos en la whitelist
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    //Agregar middleware para que no se queje de que el estado no es serializable (por el persist)
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export const persistor = persistStore(store)