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
import { AuthProvider } from '../Auth/AuthContext';
import PrivateLayoutPlanillero from '../components/Layout/LayoutPlanillero';
import MorePlanillero from '../pages/More/MorePlanillero';
import Divisiones from '../pages/Administrador/Divisiones/Divisiones';

const Routes = () => {
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

                    {/* Rutas Privadas */}
                    <Route element={<ProtectedRoute />}>
                        {/* Rutas admin */}
                        <Route element={<ProtectedRoute role={1} />}>
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
                            
                        </Route>

                        {/* Planillero */}
                        <Route element={<ProtectedRoute role={2} />}>
                            <Route path='/planillero' element={<PrivateLayoutPlanillero> <HomePlanillero/> </PrivateLayoutPlanillero>} />
                            <Route path='/planillero/planilla' element={<PrivateLayoutPlanillero> <Planilla/> </PrivateLayoutPlanillero>} />
                            <Route path='/planillero/more' element={<PrivateLayoutPlanillero> <MorePlanillero/> </PrivateLayoutPlanillero>} />
                        </Route>

                        {/* Rutas del usuario */}
                        <Route element={<ProtectedRoute role={3} />}>
                            <Route path='/' element={<LayoutPrivate> <Home/> </LayoutPrivate>} />
                            <Route path='/my-team' element={<LayoutPrivate> <MyTeam/> </LayoutPrivate>} />
                            <Route path='/stats' element={<LayoutPrivate> <Stats/> </LayoutPrivate>} />
                            <Route path='/news' element={<LayoutPrivate> <News/> </LayoutPrivate>} />
                            <Route path='/more' element={<LayoutAux> <More/> </LayoutAux>} />
                            <Route path='/stats-match' element={<LayoutPrivate> <MatchStats/> </LayoutPrivate>} />
                        </Route>
                    </Route>

                </ReactDomRoutes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default Routes;
