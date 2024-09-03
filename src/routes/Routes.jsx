import React from 'react';
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
import Home from '../pages/Home/Home';
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
import PrivateLayoutPlanillero from '../components/Layout/LayoutPlanillero';
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
import MyTeamPartidos from '../pages/MyTeam/MyTeamPartidos';

const Routes = () => {

    const { userRole } = useAuth();
    
    return (
        <AuthProvider>
            <BrowserRouter>
                <ReactDomRoutes>
                    {/* Rutas Públicas */}
                    <Route path='/onboarding' element={<Layout> <Onboarding/> </Layout>} />
                    <Route path='/login' element={<Layout> <Login/> </Layout>} />
                    <Route path='/create-account' element={<Layout> <CreateAccount/> </Layout>} />
                    <Route path='/create-password' element={<Layout> <Step2/> </Layout>} />
                    <Route path='/favorite-team' element={<Layout> <Step3/> </Layout>} />
                    <Route path='/forgot-password' element={<Layout> <ForgotPassword/> </Layout>} />

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
                            <Route path='/admin/ediciones/categorias/:id_page' element={<LayoutAdmin> <EdicionesCategorias/> </LayoutAdmin>} />
                            <Route path='/admin/ediciones/config/:id_page' element={<LayoutAdmin> <EdicionesConfig/> </LayoutAdmin>} />
                            <Route path='/admin/categorias/resumen/:id_page' element={<LayoutAdmin> <Categorias/> </LayoutAdmin>} />
                            <Route path='/admin/categorias/fixture/:id_page' element={<LayoutAdmin> <CategoriasFixture /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/fixture/:id_page/detalle/:id_page' element={<LayoutAdmin> <CategoriasFixturePartido /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/equipos/:id_page' element={<LayoutAdmin> <CategoriasEquipos /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/equipos/:id_page/detalle/:id_page' element={<LayoutAdmin> <CategoriasEquiposDetalle /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/config/:id_page' element={<LayoutAdmin> <CategoriasConfig /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/formato/:id_page' element={<LayoutAdmin> <CategoriasFormato /> </LayoutAdmin>} />
                            <Route path='/admin/sanciones/expulsados' element={<LayoutAdmin> <Expulsados/> </LayoutAdmin>} />
                        </Route>

                        {/* Planillero */}
                        <Route element={<ProtectedRoute roles={[2]} />}>
                            <Route path='/planillero' element={<PrivateLayoutPlanillero> <HomePlanillero/> </PrivateLayoutPlanillero>} />
                            <Route path='/planillero/planilla' element={<PrivateLayoutPlanillero> <Planilla/> </PrivateLayoutPlanillero>} />
                            <Route path='/planiller/categorias' element={<PrivateLayoutPlanillero> <UserCategorias/> </PrivateLayoutPlanillero>} />
                            <Route path='/planiller/more' element={<PrivateLayoutPlanillero> <MorePlanillero/> </PrivateLayoutPlanillero>} />

                            {/* <Route path='/planiller/stats' element={<PrivateLayoutPlanillero> <Stats/> </PrivateLayoutPlanillero>} /> */}
                            {/* <Route path='/my-team' element={<PrivateLayoutPlanillero> <MyTeam/> </PrivateLayoutPlanillero>} />
                            <Route path='/stats-match' element={<PrivateLayoutPlanillero> <MatchStats/> </PrivateLayoutPlanillero>} /> */}
                        </Route>

                        {/* Rutas compartidas entre roles 2 y 3 */}
                    {/* Rutas compartidas entre roles 2 y 3 */}
                    <Route element={<ProtectedRoute roles={[2, 3]} />}>
                        <Route 
                            path='/categoria/estadisticas/goleadores/:id_page' 
                            element={userRole === 2 ? 
                                <PrivateLayoutPlanillero> <UserCategoriasGoleadores/> </PrivateLayoutPlanillero> : 
                                <LayoutPrivate> <UserCategoriasGoleadores/> </LayoutPrivate>} 
                        />
                        <Route 
                            path='/categoria/estadisticas/asistentes/:id_page' 
                            element={userRole === 2 ? 
                                <PrivateLayoutPlanillero> <UserCategoriasAsistentes/> </PrivateLayoutPlanillero> : 
                                <LayoutPrivate> <UserCategoriasAsistentes/> </LayoutPrivate>} 
                        />
                        <Route 
                            path='/categoria/estadisticas/expulsados/:id_page' 
                            element={userRole === 2 ? 
                                <PrivateLayoutPlanillero> <UserCategoriasExpulsados/> </PrivateLayoutPlanillero> : 
                                <LayoutPrivate> <UserCategoriasExpulsados/> </LayoutPrivate>} 
                        />
                        <Route 
                            path='/categoria/posiciones/:id_page' 
                            element={userRole === 2 ? 
                                <PrivateLayoutPlanillero> <UserCategoriasPosiciones/> </PrivateLayoutPlanillero> : 
                                <LayoutPrivate> <UserCategoriasPosiciones/> </LayoutPrivate>} 
                        />
                        <Route 
                            path='/categoria/fixture/:id_page' 
                            element={userRole === 2 ? 
                                <PrivateLayoutPlanillero> <UserCategoriasFixture/> </PrivateLayoutPlanillero> : 
                                <LayoutPrivate> <UserCategoriasFixture/> </LayoutPrivate>} 
                        />
                        <Route 
                            path='/categorias' 
                            element={userRole === 2 ? 
                                <PrivateLayoutPlanillero> <UserCategorias/> </PrivateLayoutPlanillero> : 
                                <LayoutPrivate> <UserCategorias/> </LayoutPrivate>} 
                        />
                    </Route>

                        {/* Rutas del usuario */}
                        <Route element={<ProtectedRoute roles={[3]} />}>
                            <Route path='/' element={<LayoutPrivate> <Home/> </LayoutPrivate>} />
                            <Route path='/my-team' element={<LayoutPrivate> <MyTeam/> </LayoutPrivate>} />
                            <Route path='/my-team/partidos' element={<LayoutPrivate> <MyTeamPartidos/> </LayoutPrivate>} />
                            <Route path='/stats' element={<LayoutPrivate> <Stats/> </LayoutPrivate>} />
                            <Route path='/news' element={<LayoutPrivate> <News/> </LayoutPrivate>} />
                            <Route path='/more' element={<LayoutAux> <More/> </LayoutAux>} />
                            <Route path='/stats-match' element={<LayoutPrivate> <MatchStats/> </LayoutPrivate>} />
                            {/* <Route path='/categoria/estadisticas/goleadores/:id_page' element={<LayoutPrivate> <UserCategoriasGoleadores/> </LayoutPrivate>} />
                            <Route path='/categoria/estadisticas/asistentes/:id_page' element={<LayoutPrivate> <UserCategoriasAsistentes/> </LayoutPrivate>} />
                            <Route path='/categoria/estadisticas/expulsados/:id_page' element={<LayoutPrivate> <UserCategoriasExpulsados/> </LayoutPrivate>} /> */}

                        </Route>
                    </Route>

                </ReactDomRoutes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default Routes;
