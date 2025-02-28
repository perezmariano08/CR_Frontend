import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes as ReactDomRoutes, Route } from "react-router-dom";
import LayoutAdmin from '../components/Layout/LayoutAdmin';
import LayoutPrivate from '../components/Layout/LayoutPrivate';
import Layout from '../components/Layout/Layout';
import CreateAccount from '../pages/CreateAccount/CreateAccount';
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

import Perfil from '../pages/User/Perfil/Perfil';
import ConfirmEmailChange from '../pages/User/Verificar/ConfirmEmailChange';
import LegajosJugadores from '../pages/Administrador/Legajos/LegajosJugadores';
import LegajosEquipos from '../pages/Administrador/Legajos/LegajosEquipos';

import PublicRoute from '../Auth/PublicRoute';
import Estadisticas from '../pages/Administrador/Categorias/Estadisticas';
import UserCategoriasPlayOff from '../pages/User/Categorias/UserCategoriasPlayOff';
import Noticias from '../pages/Administrador/Noticias/Noticias';
import NotFound from '../pages/NotFound/NotFound';
import Noticia from '../pages/Administrador/Noticias/Noticia';
import EquipoParticipaciones from '../pages/MyTeam/EquipoParticipaciones';
import EquipoPartidos from '../pages/MyTeam/EquipoPartidos';

const Home = lazy(() => import('../pages/Home/Home'));
const Login = lazy(() => import('../pages/Login/Login'));
const Onboarding = lazy(() => import('../pages/Onboarding/Onboarding'));
const MyTeam = lazy(() => import('../pages/MyTeam/MyTeam'));
const UserCategoriasPosiciones = lazy(() => import('../pages/User/Categorias/UserCategoriasPosiciones'));
const UserCategoriasFixture = lazy(() => import('../pages/User/Categorias/UserCategoriasFixture'));
const UserCategoriasGoleadores = lazy(() => import('../pages/User/Categorias/UserCategoriasGoleadores'));
const UserCategoriasAsistentes = lazy(() => import('../pages/User/Categorias/UserCategoriasAsistentes'));
const UserCategoriasExpulsados = lazy(() => import('../pages/User/Categorias/UserCategoriasExpulsados'));
const UserCategorias = lazy(() => import('../pages/User/Categorias/UserCategorias'));
const UserNoticias = lazy(() => import('../pages/User/Noticias/Noticias'));
const UserNoticia = lazy(() => import('../pages/User/Noticias/UserNoticia'));

const Routes = () => {

    return (
        <AuthProvider>
            <BrowserRouter>
                <ReactDomRoutes>

                    <Route path="*" element={<NotFound />} />

                    {/* Rutas Públicas */}
                    <Route element={<PublicRoute />}>

                        <Route
                            path='/'
                            element={
                                <LayoutPrivate>
                                    <Suspense fallback={<div></div>}>
                                        <Home />
                                    </Suspense>
                                </LayoutPrivate>
                            }
                        />
                        <Route
                            path='/equipos/:id_equipo'
                            element={
                                <LayoutPrivate>
                                    <Suspense fallback={<div></div>}>
                                        <MyTeam />
                                    </Suspense>
                                </LayoutPrivate>
                            }
                        />
                        <Route
                            path='/equipos/:id_equipo/participaciones'
                            element={
                                <LayoutPrivate>
                                    <Suspense fallback={<div></div>}>
                                        <EquipoParticipaciones />
                                    </Suspense>
                                </LayoutPrivate>
                            }
                        />
                        <Route
                            path='/equipos/:id_equipo/partidos'
                            element={
                                <LayoutPrivate>
                                    <Suspense fallback={<div></div>}>
                                        <EquipoPartidos />
                                    </Suspense>
                                </LayoutPrivate>
                            }
                        />

                        <Route
                            path='/onboarding'
                            element={
                                <Layout>
                                    <Suspense fallback={<div></div>}>
                                        <Onboarding />
                                    </Suspense>
                                </Layout>
                            }
                        />
                        <Route
                            path='/login'
                            element={
                                <Layout>
                                    <Suspense fallback={<div></div>}>
                                        <Login />
                                    </Suspense>
                                </Layout>
                            }
                        />
                        <Route
                            path='/forgot-password'
                            element={
                                <Layout>
                                    <Suspense fallback={<div></div>}>
                                        <ForgotPassword />
                                    </Suspense>
                                </Layout>
                            }
                        />
                        <Route
                            path='/create-password'
                            element={
                                <Layout>
                                    <Suspense fallback={<div></div>}>
                                        <Step2 />
                                    </Suspense>
                                </Layout>
                            }
                        />


                        {/* <Route path='/news' element={<LayoutPrivate> <News/> </LayoutPrivate>} /> */}
                        {/* <Route path='/create-account' element={<Layout> <CreateAccount/> </Layout>} /> */}
                        {/* <Route path='/favorite-team' element={<Layout> <Step3/> </Layout>} /> */}
                        {/* <Route path='/confirm-email-change' element={<Layout> <ConfirmEmailChange/> </Layout>} /> */}
                        {/* <Route path='/my-team/partidos' element={<LayoutPrivate> <MyTeamPartidos/> </LayoutPrivate>} /> */}
                        {/* <Route path='/stats' element={<LayoutPrivate> <Stats/> </LayoutPrivate>} /> */}
                        {/* <Route path='/more' element={<LayoutAux> <More/> </LayoutAux>} /> */}
                    </Route>

                    <Route
                        path='/stats-match'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <MatchStats />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categoria/estadisticas/asistentes/:id_page'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategoriasAsistentes />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categoria/estadisticas/goleadores/:id_page'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategoriasGoleadores />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categoria/estadisticas/expulsados/:id_page'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategoriasExpulsados />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categoria/posiciones/:id_page'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategoriasPosiciones />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categoria/fixture/:id_page'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategoriasFixture />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categoria/playoff/:id_page'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategoriasPlayOff />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />
                    <Route
                        path='/categorias'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserCategorias />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />

                    <Route
                        path='/noticias'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserNoticias />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />

                    <Route
                        path='/noticias/:id_noticia'
                        element={
                            <LayoutPrivate>
                                <Suspense fallback={<div></div>}>
                                    <UserNoticia />
                                </Suspense>
                            </LayoutPrivate>
                        }
                    />

                    {/* Rutas Privadas */}
                    <Route element={<ProtectedRoute />}>
                        {/* Rutas admin */}
                        <Route element={<ProtectedRoute roles={[1]} />}>
                            {/* <Route path='/admin/temporadas/temporada' element={<LayoutAdmin className="page-temporadas"> <Temporadas/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/temporadas/categorias' element={<LayoutAdmin> <Categorias/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/temporadas/sedes' element={<LayoutAdmin> <Sedes/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/temporadas/años' element={<LayoutAdmin> <Años/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/temporadas/torneos' element={<LayoutAdmin> <Torneos/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/temporadas/divisiones' element={<LayoutAdmin> <Divisiones/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/partidos' element={<LayoutAdmin> <Partidos/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/jugadores' element={<LayoutAdmin> <Jugadores/> </LayoutAdmin>} /> */}
                            {/* <Route path='/admin/equipos' element={<LayoutAdmin> <Equipos/> </LayoutAdmin>} /> */}

                            <Route path='/admin/dashboard' element={<LayoutAdmin> <Admin /> </LayoutAdmin>} />
                            <Route path='/admin/noticias' element={<LayoutAdmin> <Noticias /> </LayoutAdmin>} />
                            <Route path='/admin/noticias/:id_noticia' element={<LayoutAdmin> <Noticia /> </LayoutAdmin>} />
                            <Route path='/admin/usuarios' element={<LayoutAdmin> <Usuarios /> </LayoutAdmin>} />

                            <Route path='/admin/ediciones' element={<LayoutAdmin> <Ediciones /> </LayoutAdmin>} />
                            <Route path='/admin/ediciones/categorias/:id_edicion' element={<LayoutAdmin> <EdicionesCategorias /> </LayoutAdmin>} />
                            <Route path='/admin/ediciones/config/:id_edicion' element={<LayoutAdmin> <EdicionesConfig /> </LayoutAdmin>} />

                            <Route path='/admin/categorias/resumen/:id_categoria' element={<LayoutAdmin> <Categorias /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/fixture/:id_categoria/' element={<LayoutAdmin> <CategoriasFixture /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/estadisticas/:id_categoria/' element={<LayoutAdmin> <Estadisticas /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/fixture/:id_categoria/detalle/:id_partido' element={<LayoutAdmin> <CategoriasFixturePartido /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/equipos/:id_categoria' element={<LayoutAdmin> <CategoriasEquipos /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/equipos/:id_categoria/detalle/:id_equipo' element={<LayoutAdmin> <CategoriasEquiposDetalle /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/config/:id_categoria' element={<LayoutAdmin> <CategoriasConfig /> </LayoutAdmin>} />
                            <Route path='/admin/categorias/formato/:id_categoria' element={<LayoutAdmin> <CategoriasFormato /> </LayoutAdmin>} />

                            <Route path='/admin/sanciones/expulsados' element={<LayoutAdmin> <Expulsados /> </LayoutAdmin>} />
                            <Route path='/admin/legajos/jugadores' element={<LayoutAdmin> <LegajosJugadores /> </LayoutAdmin>} />
                            <Route path='/admin/legajos/equipos' element={<LayoutAdmin> <LegajosEquipos /> </LayoutAdmin>} />
                        </Route>

                        {/* Planillero */}
                        <Route element={<ProtectedRoute roles={[2]} />}>
                            <Route
                                path="/planillero/categorias"
                                element={
                                    <LayoutPrivate>
                                        <Suspense fallback={<div></div>}>
                                            <UserCategorias />
                                        </Suspense>
                                    </LayoutPrivate>
                                }
                            />
                            <Route path='/planillero' element={<LayoutPrivate> <HomePlanillero /> </LayoutPrivate>} />
                            <Route path='/planillero/planilla' element={<LayoutPrivate> <Planilla /> </LayoutPrivate>} />
                            <Route path='planillero/mi-perfil' element={<LayoutPrivate> <Perfil /> </LayoutPrivate>} />

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
