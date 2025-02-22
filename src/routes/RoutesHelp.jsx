import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes as ReactDomRoutes, Route } from "react-router-dom";
import LayoutAdmin from '../components/Layout/LayoutAdmin';
import LayoutPrivate from '../components/Layout/LayoutPrivate';
import Layout from '../components/Layout/Layout';
import Onboarding from '../pages/Onboarding/Onboarding';
import Login from '../pages/Login/Login';
import CreateAccount from '../pages/CreateAccount/CreateAccount';
import MyTeam from '../pages/MyTeam/MyTeam';
import Stats from '../pages/Stats/Stats';
import News from '../pages/News/News';
import More from '../pages/More/More';
import LayoutAux from '../components/LayoutAux/LayoutAux';
import HomePlanillero from '../pages/Planillero/HomePlanillero/HomePlanillero';
import Planilla from '../pages/Planillero/Planilla/Planilla';
import MatchStats from '../pages/MatchStats/MatchStats';
import Step2 from '../pages/CreateAccount/Step2';
import Step3 from '../pages/CreateAccount/Step3';
import Temporadas from '../pages/Administrador/Temporadas/Temporadas'
import Categorias from '../pages/Administrador/Categorias/Categorias'
import Sedes from '../pages/Administrador/Sedes/Sedes'
import Años from '../pages/Administrador/Años/Años'
import Torneos from '../pages/Administrador/Torneos/Torneos'
import Usuarios from '../pages/Administrador/Usuarios/Usuarios'
import Jugadores from '../pages/Administrador/Jugadores/Jugadores'
import Equipos from '../pages/Administrador/Equipos/Equipos'
import Partidos from '../pages/Administrador/Partidos/Partidos'
import Admin from '../pages/Administrador/Admin/Admin'
import ProtectedRoute from '../Auth/ProtectedRoute';
import { AuthProvider, useAuth } from '../Auth/AuthContext';
import MorePlanillero from '../pages/More/MorePlanillero';
import Divisiones from '../pages/Administrador/Divisiones/Divisiones';
import Expulsados from '../pages/Administrador/Expulsados/Expulsados';
import ForgotPassword from '../pages/Login/ForgotPassword/ForgotPassword';
import Ediciones from '../pages/Administrador/Ediciones/Ediciones';
import EdicionesConfig from '../pages/Administrador/Ediciones/EdicionesConfig';
import EdicionesCategorias from '../pages/Administrador/Ediciones/EdicionesCategorias';
import CategoriasEquipos from '../pages/Administrador/Categorias/CategoriasEquipos';
import CategoriasFixture from '../pages/Administrador/Categorias/CategoriasFixture';
import CategoriasConfig from '../pages/Administrador/Categorias/CategoriasConfig';
import CategoriasFormato from '../pages/Administrador/Categorias/CategoriasFormato';
import CategoriasEquiposDetalle from '../pages/Administrador/Categorias/CategoriasEquiposDetalle';
import CategoriasFixturePartido from '../pages/Administrador/Categorias/CategoriasFixturePartido';
import UserCategoriasPosiciones from '../pages/User/Categorias/UserCategoriasPosiciones';
import UserCategoriasFixture from '../pages/User/Categorias/UserCategoriasFixture';
import UserCategoriasGoleadores from '../pages/User/Categorias/UserCategoriasGoleadores';
import UserCategoriasAsistentes from '../pages/User/Categorias/UserCategoriasAsistentes';
import UserCategoriasExpulsados from '../pages/User/Categorias/UserCategoriasExpulsados';
import UserCategorias from '../pages/User/Categorias/UserCategorias';
import Perfil from '../pages/User/Perfil/Perfil';
import ConfirmEmailChange from '../pages/User/Verificar/ConfirmEmailChange';
import LegajosJugadores from '../pages/Administrador/Legajos/LegajosJugadores';
import LegajosEquipos from '../pages/Administrador/Legajos/LegajosEquipos';

import PublicRoute from '../Auth/PublicRoute';
import Estadisticas from '../pages/Administrador/Categorias/Estadisticas';
import UserCategoriasPlayOff from '../pages/User/Categorias/UserCategoriasPlayOff';

const Home = lazy(()=> import('../pages/Home/Home'));


const Routes = () => {

    return (
        <AuthProvider>
            <BrowserRouter>
                <ReactDomRoutes>
                    {/* Rutas Públicas */}
                    <Route element={<PublicRoute/>}>
                        <Route path='/onboarding' element={<Layout> <Onboarding/> </Layout>} />
                        <Route path='/login' element={<Layout> <Login/> </Layout>} />
                        <Route path='/' element={<LayoutPrivate> <Home/> </LayoutPrivate>} />
                        <Route path='/my-team' element={<LayoutPrivate> <MyTeam/> </LayoutPrivate>} />
                        <Route path='/news' element={<LayoutPrivate> <News/> </LayoutPrivate>} />
                        <Route path='/forgot-password' element={<Layout> <ForgotPassword/> </Layout>} />
                        {/* <Route path='/create-account' element={<Layout> <CreateAccount/> </Layout>} /> */}
                        <Route path='/create-password' element={<Layout> <Step2/> </Layout>} />
                        
                        {/* <Route path='/favorite-team' element={<Layout> <Step3/> </Layout>} /> */}
                        {/* <Route path='/confirm-email-change' element={<Layout> <ConfirmEmailChange/> </Layout>} /> */}
                        {/* <Route path='/my-team/partidos' element={<LayoutPrivate> <MyTeamPartidos/> </LayoutPrivate>} /> */}
                        {/* <Route path='/stats' element={<LayoutPrivate> <Stats/> </LayoutPrivate>} /> */}
                        {/* <Route path='/more' element={<LayoutAux> <More/> </LayoutAux>} /> */}
                    </Route>

                    <Route path='/stats-match' element={<LayoutPrivate> <MatchStats/> </LayoutPrivate>} />
                    <Route path='/categoria/estadisticas/asistentes/:id_page' element={<LayoutPrivate> <UserCategoriasAsistentes/> </LayoutPrivate>} />
                    <Route path='/categoria/estadisticas/goleadores/:id_page' element={<LayoutPrivate> <UserCategoriasGoleadores/> </LayoutPrivate>} />
                    <Route path='/categoria/estadisticas/expulsados/:id_page' element={<LayoutPrivate> <UserCategoriasExpulsados/> </LayoutPrivate>} />
                    <Route path='/categoria/posiciones/:id_page' element={<LayoutPrivate> <UserCategoriasPosiciones/> </LayoutPrivate>} />
                    <Route path='/categoria/fixture/:id_page' element={<LayoutPrivate> <UserCategoriasFixture/> </LayoutPrivate>} />
                    <Route path='/categoria/playoff/:id_page' element={<LayoutPrivate> <UserCategoriasPlayOff/> </LayoutPrivate>} />
                    <Route path='/categorias' element={<LayoutPrivate> <UserCategorias/> </LayoutPrivate>} />

                    {/* Rutas Privadas */}
                    <Route element={<ProtectedRoute />}>
                        {/* Rutas admin */}
                        <Route element={<ProtectedRoute roles={[1]} />}>
                            <Route path='/admin/temporadas/temporada' element={<LayoutAdmin className="page-temporadas"> <Temporadas/> </LayoutAdmin>} />
                            <Route path='/admin/temporadas/categorias' element={<LayoutAdmin> <Categorias/> </LayoutAdmin>} />
                            <Route path='/admin/temporadas/sedes' element={<LayoutAdmin> <Sedes/> </LayoutAdmin>} />
                            <Route path='/admin/temporadas/años' element={<LayoutAdmin> <Años/> </LayoutAdmin>} />
                            <Route path='/admin/temporadas/torneos' element={<LayoutAdmin> <Torneos/> </LayoutAdmin>} />
                            <Route path='/admin/temporadas/divisiones' element={<LayoutAdmin> <Divisiones/> </LayoutAdmin>} />
                            <Route path='/admin/usuarios' element={<LayoutAdmin> <Usuarios/> </LayoutAdmin>} />
                            <Route path='/admin/jugadores' element={<LayoutAdmin> <Jugadores/> </LayoutAdmin>} />
                            <Route path='/admin/equipos' element={<LayoutAdmin> <Equipos/> </LayoutAdmin>} />
                            <Route path='/admin/partidos' element={<LayoutAdmin> <Partidos/> </LayoutAdmin>} />
                            <Route path='/admin/dashboard' element={<LayoutAdmin> <Admin/> </LayoutAdmin>} />
                            <Route path='/admin/ediciones' element={<LayoutAdmin> <Ediciones/> </LayoutAdmin>} />
                            <Route path='/admin/ediciones/categorias/:id_edicion' element={<LayoutAdmin> <EdicionesCategorias/> </LayoutAdmin>} />
                            <Route path='/admin/ediciones/config/:id_edicion' element={<LayoutAdmin> <EdicionesConfig/> </LayoutAdmin>} />
                            
                            <Route path='/admin/categorias/resumen/:id_categoria' element={<LayoutAdmin> <Categorias/> </LayoutAdmin>} />
                            <Route path='/admin/categorias/fixture/:id_categoria/' element={<LayoutAdmin> <CategoriasFixture /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/estadisticas/:id_categoria/' element={<LayoutAdmin> <Estadisticas/> </LayoutAdmin>} />
                            <Route path='/admin/categorias/fixture/:id_categoria/detalle/:id_partido' element={<LayoutAdmin> <CategoriasFixturePartido /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/equipos/:id_categoria' element={<LayoutAdmin> <CategoriasEquipos /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/equipos/:id_categoria/detalle/:id_equipo' element={<LayoutAdmin> <CategoriasEquiposDetalle /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/config/:id_categoria' element={<LayoutAdmin> <CategoriasConfig /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/formato/:id_categoria' element={<LayoutAdmin> <CategoriasFormato /> </LayoutAdmin>} />

                            <Route path='/admin/sanciones/expulsados' element={<LayoutAdmin> <Expulsados/> </LayoutAdmin>} />
                            <Route path='/admin/legajos/jugadores' element={<LayoutAdmin> <LegajosJugadores/> </LayoutAdmin>} />
                            <Route path='/admin/legajos/equipos' element={<LayoutAdmin> <LegajosEquipos/> </LayoutAdmin>} />
                        </Route>

                        {/* Planillero */}
                        <Route element={<ProtectedRoute roles={[2]} />}>
                            <Route path='/planillero' element={<LayoutPrivate> <HomePlanillero/> </LayoutPrivate>} />
                            <Route path='/planillero/planilla' element={<LayoutPrivate> <Planilla/> </LayoutPrivate>} />
                            <Route path='/planiller/categorias' element={<LayoutPrivate> <UserCategorias/> </LayoutPrivate>} />
                            <Route path='planillero/mi-perfil' element={<LayoutPrivate> <Perfil/> </LayoutPrivate>} />

                            {/* <Route path='/categoria/estadisticas/asistentes/:id_page' element={<PrivateLayoutPlanillero> <UserCategoriasAsistentes/> </PrivateLayoutPlanillero>} />
                            <Route path='/categoria/estadisticas/expulsados/:id_page' element={<PrivateLayoutPlanillero> <UserCategoriasExpulsados/> </PrivateLayoutPlanillero>} />
                            <Route path='/categoria/posiciones/:id_page' element={<PrivateLayoutPlanillero> <UserCategoriasPosiciones/> </PrivateLayoutPlanillero>} />
                            <Route path='/categoria/fixture/:id_page' element={<PrivateLayoutPlanillero> <UserCategoriasFixture/> </PrivateLayoutPlanillero>} />
                            <Route path='/categorias' element={<PrivateLayoutPlanillero> <UserCategorias/> </PrivateLayoutPlanillero>} /> */}

                            {/* <Route path='/planiller/more' element={<PrivateLayoutPlanillero> <MorePlanillero/> </PrivateLayoutPlanillero>} /> */}
                            {/* <Route path='/planiller/stats' element={<PrivateLayoutPlanillero> <Stats/> </PrivateLayoutPlanillero>} /> */}
                            {/* <Route path='/my-team' element={<PrivateLayoutPlanillero> <MyTeam/> </PrivateLayoutPlanillero>} />
                            <Route path='/stats-match' element={<PrivateLayoutPlanillero> <MatchStats/> </PrivateLayoutPlanillero>} /> */}
                        </Route>

                    </Route>

                </ReactDomRoutes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default Routes;
