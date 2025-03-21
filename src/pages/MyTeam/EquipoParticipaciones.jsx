import React, { useEffect, useState } from 'react';
import { URLImages } from '../../utils/utils';
import { NavLink, useParams } from 'react-router-dom';
import { useEquipos } from '../../hooks/useEquipos.js';
import { useJugadores } from '../../hooks/useJugadores.js';
import { ContentMenuLink, ContentUserContainer, ContentUserMenuTitulo, ContentUserTituloContainer, ContentUserTituloContainerStyled, ContentUserWrapper, TablePosicionesContainer, TituloContainer, TituloText } from '../../components/Content/ContentStyles.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice.js';
import { EstadisticasContainer, EstadisticasTemporada, EstadisticasTemporadaDetalles, EstadisticasTemporadaDetallesItem, EstadisticasTemporadaDetallesWrapper, EstadisticasTemporadaGeneral, TrofeosContainer, TrofeosItem } from './MyTeamStyles.js';
import { getParticipacionesEquipo } from '../../utils/dataFetchers.js';
import { fetchZonas } from '../../redux/ServicesApi/zonasSlice.js';
import { SectionHome, SectionHomeTitle } from '../Home/HomeStyles.js';
import CopaOro from '../../components/Icons/CopaOro.jsx';


const EquipoParticipaciones = () => {
    const { id_equipo } = { id_equipo: parseInt(useParams().id_equipo) };
    const { escudosEquipos, nombresEquipos } = useEquipos();
    const { nombresJugadores } = useJugadores();
    const dispatch = useDispatch()

    const zonas = useSelector((state) => state.zonas.data);
    const temporadas = useSelector((state) => state.temporadas.data);
    const temporadasEquipo = temporadas.filter((t) => t.id_equipo === id_equipo)
    const temporadasUnicas = Array.from(
        new Map(temporadasEquipo.map(t => [t.id_categoria, t])).values()
    );
    const [estadisticas, setEstadisticas] = useState(null)
    const ultimaTemporada = temporadasEquipo.length > 0 
    ? temporadasEquipo[temporadasEquipo.length - 1] 
    : null;

    const trofeos = zonas.filter((z) => z.id_equipo_campeon === id_equipo)    
    

    useEffect(() => {
        if (temporadas.length === 0) dispatch(fetchTemporadas())
        if (zonas.length === 0) dispatch(fetchZonas())
        // Función para obtener datos
        const fetchData = async () => {
            try {
                const [estadisticasData] = await Promise.all([
                    getParticipacionesEquipo(id_equipo)
                ]);
                setEstadisticas(estadisticasData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [dispatch, temporadas.length, zonas.length]);
    
    return (
        <>
            <ContentUserContainer>
                <ContentUserWrapper>
                    <ContentUserTituloContainerStyled>
                        <ContentUserTituloContainer>
                            <TituloContainer>
                                <img src={`${URLImages}${escudosEquipos(id_equipo)}`}/>
                                <TituloText>
                                    <h1>{nombresEquipos(id_equipo)}</h1>
                                </TituloText>
                            </TituloContainer>
                        </ContentUserTituloContainer>
                        <ContentUserMenuTitulo>
                            <ContentMenuLink>
                                <NavLink to={`/equipos/${id_equipo}`} end>
                                    Resumen
                                </NavLink>
                                <NavLink to={`/equipos/${id_equipo}/partidos`}>
                                    Partidos
                                </NavLink>
                                <NavLink to={`/equipos/${id_equipo}/participaciones`}>
                                    Participaciones
                                </NavLink>
                            </ContentMenuLink>
                        </ContentUserMenuTitulo>
                    </ContentUserTituloContainerStyled>
                    {
                        trofeos.length > 0 && (
                            <SectionHome>
                                <SectionHomeTitle>
                                    Trofeos
                                </SectionHomeTitle>
                                {/* Mover SVG */}
                                <TrofeosContainer>
                                    {trofeos.map((t) => (
                                        <TrofeosItem key={t.id_zona}>
                                            {
                                                t.nombre_etapa === 'Copa Plata' ? 
                                                <svg 
                                                viewBox="0 0 188 448" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_19_129)">
                                                    <path d="M11.39 440.43L16.53 444.07H123.04L167.28 444.77L178.7 440.43L169.05 432.44L110.43 426.25L23.72 428.9L11.39 440.43Z" fill="#353535"/>
                                                    <path d="M178.7 446.51L170.82 447.7V441.84L178.7 440.43V446.51Z" fill="#2D2D2D"/>
                                                    <path d="M11.39 446.51L19.27 447.7V441.84L11.39 440.43V446.51Z" fill="#2D2D2D"/>
                                                    <path d="M11.39 440.43L19.27 408.11L23.48 406.58H165.95L169.27 409.05L178.7 440.43H11.39Z" fill="#353535"/>
                                                    <path d="M170.82 441.84H19.27V447.7H170.82V441.84Z" fill="#3F3F3F"/>
                                                    <path d="M170.82 434.76H19.27V440.62H170.82V434.76Z" fill="#444B4D"/>
                                                    <path d="M16.53 439.79L19.27 440.62V434.76L16.53 434.1V439.79Z" fill="#2F3030"/>
                                                    <path d="M173.56 439.79L170.82 440.62V434.76L173.56 434.1V439.79Z" fill="#2F3030"/>
                                                    <path d="M16.53 434.1L24.61 402.13L165.95 402.19L173.56 434.1H16.53Z" fill="#383A3A"/>
                                                    <path d="M165.95 327.92H24.61V430.91H165.95V327.92Z" fill="#444B4D"/>
                                                    <path d="M158.65 339.43H32.35V419.06H158.65V339.43Z" fill="#70560E" stroke="#AF9425" stroke-width="0.25" stroke-miterlimit="10"/>
                                                    <path d="M153.56 343.27H36.67V415.28H153.56V343.27Z" fill="#70560E" stroke="#AF9425" stroke-width="0.25" stroke-miterlimit="10"/>
                                                    <path d="M15.98 320.62L30.36 290.87H159.09L174.14 320.62V327.92H15.98" fill="#252A2B"/>
                                                    <path d="M30.36 290.98L159.09 290.87L170.1 320.62H19.81L30.36 290.98Z" fill="#543023"/>
                                                    <path d="M170.1 320.62H19.81V327.92H170.1V320.62Z" fill="#444B4D"/>
                                                    <path d="M34.4 278.6L153.68 279.26L159.09 290.87H30.36L34.4 278.6Z" fill="#3F2016"/>
                                                    <path d="M37.94 283.52C51.88 287.01 70.36 290.23 92.19 290.32C115.63 290.42 135.33 286.87 149.87 283.13C149.66 281.62 149.13 279.19 147.6 276.6C146.41 274.59 145.03 273.18 144.01 272.29C129.4 275.66 111.24 279.05 91.53 278.91C73.83 278.79 61.45 276.6 58.27 275.96C52.18 274.75 47.15 273.37 43.51 272.26C42.47 273.24 40.97 274.87 39.77 277.26C38.51 279.77 38.09 282.06 37.95 283.51L37.94 283.52Z" fill="#A09D9D"/>
                                                    <path d="M59.75 249.95H127.8C128.48 254.11 130.02 256.72 131.23 258.3C134.41 262.44 138.23 263.2 141.89 268.51C142.95 270.05 143.62 271.43 144 272.29C132.17 275.87 115.21 279.62 94.62 279.72C73.19 279.82 55.59 275.93 43.5 272.26C43.94 271.36 44.68 270.01 45.79 268.52C49.89 263.03 53.99 262.52 56.96 258.12C57.97 256.63 59.42 253.51 59.75 249.94V249.95Z" fill="#B2AFAF"/>
                                                    <path d="M57.93 238.15L130.04 237.79C129.15 239.05 128.17 239.68 127.58 242.63C126.94 245.83 127.41 248.46 127.8 249.96H59.75C60.18 248.53 59.97 246.2 59.65 243.33C59.32 240.36 58.7 239.48 57.93 238.15Z" fill="#C1C1C1"/>
                                                    <path d="M130.04 237.79C118.58 238.51 106.48 238.95 93.79 239C81.25 239.06 69.28 238.74 57.93 238.14C57.72 237.18 57.53 235.9 57.57 234.41C57.6 233.06 57.81 231.91 58.04 231.01C69.16 232.03 81.31 232.68 94.35 232.7C107.1 232.72 119 232.14 129.92 231.19C130.2 232.03 130.51 233.3 130.49 234.85C130.47 236.05 130.26 237.05 130.05 237.78L130.04 237.79Z" fill="#A5A0A0"/>
                                                    <path d="M129.47 231.19L129.82 231.28C96.78 240.56 58.4 231.51 58.4 231.51L58.83 231.02H58.04C57.81 225.11 57.86 220.12 57.98 216.34C58.36 203.79 59.6 199.52 61.39 195.96C62.61 193.54 63.94 191.72 64.88 190.57H122.94C123.85 191.23 125.16 192.32 126.38 193.94C130.14 198.92 129.66 204.48 129.53 216.34C129.49 219.68 129.82 224.92 129.92 231.2H129.48L129.47 231.19Z" fill="#B2AFAF"/>
                                                    <path d="M69.9 178.4H118.07C118.71 178.88 119.35 179.46 119.95 180.17C123.17 183.95 123.07 188.74 122.94 190.57H64.82C64.73 188.73 64.77 184.24 67.81 180.47C68.49 179.63 69.21 178.95 69.91 178.4H69.9Z" fill="#A5A0A0"/>
                                                    <path d="M118.06 178.4H69.89C70.5 177.57 71.24 176.41 71.83 174.92C72.32 173.69 72.57 172.56 72.71 171.66C86.98 171.64 101.24 171.62 115.51 171.6C115.62 172.51 115.84 173.65 116.28 174.92C116.81 176.4 117.48 177.57 118.05 178.4H118.06Z" fill="#C1C1C1"/>
                                                    <path d="M72.72 171.65L115.52 171.59C124.43 162.17 134.68 149.58 144.05 133.49C157.96 109.62 164.58 87.23 167.94 71.11C145.68 68.61 120.77 66.93 93.62 66.91C66.73 66.88 42.05 68.47 19.96 70.89C24.03 87.69 31.34 109.83 45.04 133.44C54.13 149.11 63.92 161.77 72.72 171.64V171.65Z" fill="#B2AFAF"/>
                                                    <path d="M20.21 56.38C42.36 53.97 67.11 52.39 94.06 52.43C120.77 52.47 145.3 54.09 167.28 56.52C166.64 57.37 165.06 59.7 164.96 63.05C164.82 67.48 167.36 70.46 167.95 71.12C145.69 68.62 120.78 66.94 93.63 66.92C66.74 66.89 42.06 68.48 19.97 70.9C20.55 70.24 22.72 67.62 22.76 63.63C22.81 59.71 20.78 57.08 20.22 56.39L20.21 56.38Z" fill="#C1C1C1"/>
                                                    <path d="M16.11 47.46C39.12 44.37 65.38 42.16 94.34 41.98C123.12 41.79 149.26 43.64 172.2 46.4C171.16 48.15 170.1 50.13 169.1 52.34C168.45 53.79 167.73 55.15 167.25 56.48C145.25 54.04 120.82 52.45 94.06 52.42C67.05 52.39 42.42 53.94 20.25 56.37C19.78 54.95 19.04 53.46 18.31 51.83C17.59 50.21 16.84 48.75 16.1 47.46H16.11Z" fill="#B2AFAF"/>
                                                    <path d="M11.83 23.97C34.45 19.57 62.33 15.98 94.28 15.81C126.37 15.64 154.39 18.98 177.12 23.16C175.9 26.89 174.74 31.1 173.8 35.77C173.04 39.55 172.53 43.11 172.2 46.39C149.26 43.63 123.12 41.78 94.34 41.97C65.38 42.16 39.12 44.36 16.11 47.45C15.79 43.7 15.27 39.6 14.46 35.22C13.7 31.14 12.8 27.38 11.83 23.97Z" fill="#C1C1C1"/>
                                                    <path d="M-9.76585e-06 9.51C25.65 4.27 57.94 -0.0900044 95.28 -4.40818e-06C131.32 0.0899956 162.59 4.31999 187.63 9.39999C185.86 10.6 183.35 12.61 181.05 15.7C178.95 18.52 177.79 21.23 177.12 23.17C154.39 18.98 126.37 15.65 94.28 15.82C62.33 15.99 34.45 19.58 11.83 23.98C11.44 22.2 10.44 18.77 7.67999 15.38C4.87999 11.94 1.66999 10.26 -0.0100098 9.52L-9.76585e-06 9.51Z" fill="#B2AFAF"/>
                                                    <path d="M145.09 320.62H141.26V327.92H145.09V320.62Z" fill="#3D3F3F"/>
                                                    <path d="M174.14 320.62H170.1V327.92H174.14V320.62Z" fill="#3D3F3F"/>
                                                    <path d="M130.77 142.53C130.77 142.53 156.37 110.19 155.72 92.66C155.72 92.66 145.27 119.14 130.77 142.53Z" fill="white"/>
                                                    <path d="M62.01 229.96C62.01 229.96 58.12 216.06 63.95 200.52Z" fill="white"/>
                                                    <path d="M7.79999 11.99C7.79999 11.99 101.37 -7.16001 180.55 13.85C180.55 13.85 111.54 -2.04001 7.79999 11.99Z" fill="white"/>
                                                    </g>
                                                    <defs>
                                                    <clipPath id="clip0_19_129">
                                                    <rect width="187.63" height="447.7" fill="white"/>
                                                    </clipPath>
                                                    </defs>
                                                </svg>
                                                : <svg viewBox="0 0 188 448" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_12_46)">
                                            <path d="M11.39 440.43L16.53 444.07H123.04L167.28 444.77L178.7 440.43L169.05 432.44L110.43 426.25L23.72 428.9L11.39 440.43Z" fill="#353535"/>
                                            <path d="M178.7 446.51L170.82 447.7V441.84L178.7 440.43V446.51Z" fill="#2D2D2D"/>
                                            <path d="M11.39 446.51L19.27 447.7V441.84L11.39 440.43V446.51Z" fill="#2D2D2D"/>
                                            <path d="M11.39 440.43L19.27 408.11L23.48 406.58H165.95L169.27 409.05L178.7 440.43H11.39Z" fill="#353535"/>
                                            <path d="M170.82 441.84H19.27V447.7H170.82V441.84Z" fill="#3F3F3F"/>
                                            <path d="M170.82 434.76H19.27V440.62H170.82V434.76Z" fill="#444B4D"/>
                                            <path d="M16.53 439.79L19.27 440.62V434.76L16.53 434.1V439.79Z" fill="#2F3030"/>
                                            <path d="M173.56 439.79L170.82 440.62V434.76L173.56 434.1V439.79Z" fill="#2F3030"/>
                                            <path d="M16.53 434.1L24.61 402.13L165.95 402.19L173.56 434.1H16.53Z" fill="#383A3A"/>
                                            <path d="M165.95 327.92H24.61V430.91H165.95V327.92Z" fill="#444B4D"/>
                                            <path d="M158.65 339.43H32.35V419.06H158.65V339.43Z" fill="#70560E" stroke="#AF9425" stroke-width="0.25" stroke-miterlimit="10"/>
                                            <path d="M153.56 343.27H36.67V415.28H153.56V343.27Z" fill="#70560E" stroke="#AF9425" stroke-width="0.25" stroke-miterlimit="10"/>
                                            <path d="M15.98 320.62L30.36 290.87H159.09L174.14 320.62V327.92H15.98" fill="#252A2B"/>
                                            <path d="M30.36 290.98L159.09 290.87L170.1 320.62H19.81L30.36 290.98Z" fill="#543023"/>
                                            <path d="M170.1 320.62H19.81V327.92H170.1V320.62Z" fill="#444B4D"/>
                                            <path d="M34.4 278.6L153.68 279.26L159.09 290.87H30.36L34.4 278.6Z" fill="#3F2016"/>
                                            <path d="M130.04 237.79C118.58 238.51 106.48 238.95 93.79 239C81.25 239.06 69.28 238.74 57.93 238.14C57.72 237.18 57.53 235.9 57.57 234.41C57.6 233.06 57.81 231.91 58.04 231.01C69.16 232.03 81.31 232.68 94.35 232.7C107.1 232.72 119 232.14 129.92 231.19C130.2 232.03 130.51 233.3 130.49 234.85C130.47 236.05 130.26 237.05 130.05 237.78L130.04 237.79Z" fill="#6B5A11"/>
                                            <path d="M69.9 178.4H118.07C118.71 178.88 119.35 179.46 119.95 180.17C123.17 183.95 123.07 188.74 122.94 190.57H64.82C64.73 188.73 64.77 184.24 67.81 180.47C68.49 179.63 69.21 178.95 69.91 178.4H69.9Z" fill="#6B5A11"/>
                                            <path d="M37.94 283.52C51.88 287.01 70.36 290.23 92.19 290.32C115.63 290.42 135.33 286.87 149.87 283.13C149.66 281.62 149.13 279.19 147.6 276.6C146.41 274.59 145.03 273.18 144.01 272.29C129.4 275.66 111.24 279.05 91.53 278.91C73.83 278.79 61.45 276.6 58.27 275.96C52.18 274.75 47.15 273.37 43.51 272.26C42.47 273.24 40.97 274.87 39.77 277.26C38.51 279.77 38.09 282.06 37.95 283.51L37.94 283.52Z" fill="#756315"/>
                                            <path d="M57.93 238.15L130.04 237.79C129.15 239.05 128.17 239.68 127.58 242.63C126.94 245.83 127.41 248.46 127.8 249.96H59.75C60.18 248.53 59.97 246.2 59.65 243.33C59.32 240.36 58.7 239.48 57.93 238.15Z" fill="#756315"/>
                                            <path d="M118.06 178.4H69.89C70.5 177.57 71.24 176.41 71.83 174.92C72.32 173.69 72.57 172.56 72.71 171.66C86.98 171.64 101.24 171.62 115.51 171.6C115.62 172.51 115.84 173.65 116.28 174.92C116.81 176.4 117.48 177.57 118.05 178.4H118.06Z" fill="#756315"/>
                                            <path d="M20.21 56.38C42.36 53.97 67.11 52.39 94.06 52.43C120.77 52.47 145.3 54.09 167.28 56.52C166.64 57.37 165.06 59.7 164.96 63.05C164.82 67.48 167.36 70.46 167.95 71.12C145.69 68.62 120.78 66.94 93.63 66.92C66.74 66.89 42.06 68.48 19.97 70.9C20.55 70.24 22.72 67.62 22.76 63.63C22.81 59.71 20.78 57.08 20.22 56.39L20.21 56.38Z" fill="#756315"/>
                                            <path d="M11.83 23.97C34.45 19.57 62.33 15.98 94.28 15.81C126.37 15.64 154.39 18.98 177.12 23.16C175.9 26.89 174.74 31.1 173.8 35.77C173.04 39.55 172.53 43.11 172.2 46.39C149.26 43.63 123.12 41.78 94.34 41.97C65.38 42.16 39.12 44.36 16.11 47.45C15.79 43.7 15.27 39.6 14.46 35.22C13.7 31.14 12.8 27.38 11.83 23.97Z" fill="#756315"/>
                                            <path d="M59.75 249.95H127.8C128.48 254.11 130.02 256.72 131.23 258.3C134.41 262.44 138.23 263.2 141.89 268.51C142.95 270.05 143.62 271.43 144 272.29C132.17 275.87 115.21 279.62 94.62 279.72C73.19 279.82 55.59 275.93 43.5 272.26C43.94 271.36 44.68 270.01 45.79 268.52C49.89 263.03 53.99 262.52 56.96 258.12C57.97 256.63 59.42 253.51 59.75 249.94V249.95Z" fill="#7F6C0F"/>
                                            <path d="M129.47 231.19L129.82 231.28C96.78 240.56 58.4 231.51 58.4 231.51L58.83 231.02H58.04C57.81 225.11 57.86 220.12 57.98 216.34C58.36 203.79 59.6 199.52 61.39 195.96C62.61 193.54 63.94 191.72 64.88 190.57H122.94C123.85 191.23 125.16 192.32 126.38 193.94C130.14 198.92 129.66 204.48 129.53 216.34C129.49 219.68 129.82 224.92 129.92 231.2H129.48L129.47 231.19Z" fill="#7F6C0F"/>
                                            <path d="M72.72 171.65L115.52 171.59C124.43 162.17 134.68 149.58 144.05 133.49C157.96 109.62 164.58 87.23 167.94 71.11C145.68 68.61 120.77 66.93 93.62 66.91C66.73 66.88 42.05 68.47 19.96 70.89C24.03 87.69 31.34 109.83 45.04 133.44C54.13 149.11 63.92 161.77 72.72 171.64V171.65Z" fill="#7F6C0F"/>
                                            <path d="M16.11 47.46C39.12 44.37 65.38 42.16 94.34 41.98C123.12 41.79 149.26 43.64 172.2 46.4C171.16 48.15 170.1 50.13 169.1 52.34C168.45 53.79 167.73 55.15 167.25 56.48C145.25 54.04 120.82 52.45 94.06 52.42C67.05 52.39 42.42 53.94 20.25 56.37C19.78 54.95 19.04 53.46 18.31 51.83C17.59 50.21 16.84 48.75 16.1 47.46H16.11Z" fill="#7F6C0F"/>
                                            <path d="M-9.76585e-06 9.51C25.65 4.27 57.94 -0.0900044 95.28 -4.40818e-06C131.32 0.0899956 162.59 4.31999 187.63 9.39999C185.86 10.6 183.35 12.61 181.05 15.7C178.95 18.52 177.79 21.23 177.12 23.17C154.39 18.98 126.37 15.65 94.28 15.82C62.33 15.99 34.45 19.58 11.83 23.98C11.44 22.2 10.44 18.77 7.67999 15.38C4.87999 11.94 1.66999 10.26 -0.0100098 9.52L-9.76585e-06 9.51Z" fill="#7F6C0F"/>
                                            <path d="M174.14 320.62H170.1V327.92H174.14V320.62Z" fill="#3D3F3F"/>
                                            <path d="M130.77 142.53C130.77 142.53 156.37 110.19 155.72 92.66C155.72 92.66 145.27 119.14 130.77 142.53Z" fill="#BC9F22"/>
                                            <path d="M62.01 229.96C62.01 229.96 58.12 216.06 63.95 200.52Z" fill="#BC9F22"/>
                                            <path d="M7.79999 11.99C7.79999 11.99 101.37 -7.16001 180.55 13.85C180.55 13.85 111.54 -2.04001 7.79999 11.99Z" fill="#BC9F22"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_12_46">
                                            <rect width="187.63" height="447.7" fill="white"/>
                                            </clipPath>
                                            </defs>
                                    </svg>
                                            }
                                            
                                            <div>
                                                <h4>{t.nombre_edicion}</h4>
                                                <p>{t.nombre_etapa}</p>
                                            </div>
                                        </TrofeosItem>
                                    ))}
                                </TrofeosContainer>
                            </SectionHome>
                        )
                    }
                    <EstadisticasContainer>
                        {
                            estadisticas && (
                                estadisticas.map((e) => (
                                    <>
                                        <EstadisticasTemporada key={e.id_categoria}>
                                            <h3>{e.edicion}</h3>
                                            <EstadisticasTemporadaGeneral>
                                                <div>
                                                    <p>Partidos jugados</p>
                                                    <h5>{e.partidos_jugados}</h5>
                                                </div>
                                                <div>
                                                    <p>Ganados</p>
                                                    <h5>{e.partidos_ganados}</h5>
                                                </div>
                                                <div>
                                                    <p>Empatados</p>
                                                    <h5>{e.partidos_empatados}</h5>
                                                </div>
                                                <div>
                                                    <p>Perdidos</p>
                                                    <h5>{e.partidos_perdidos}</h5>
                                                </div>
                                            </EstadisticasTemporadaGeneral>
                                            <EstadisticasTemporadaDetallesWrapper>
                                                <EstadisticasTemporadaDetalles>
                                                    <h4>Estadisticas</h4>
                                                    <EstadisticasTemporadaDetallesItem>
                                                        <p>Goles a favor</p>
                                                        <span>{e.goles_a_favor}</span>
                                                    </EstadisticasTemporadaDetallesItem>
                                                    <EstadisticasTemporadaDetallesItem>
                                                        <p>Goles en contra</p>
                                                        <span>{e.goles_en_contra}</span>
                                                    </EstadisticasTemporadaDetallesItem>
                                                    <EstadisticasTemporadaDetallesItem>
                                                        <p>Mejor jugador</p>
                                                        {
                                                            e.mejor_jugador_id 
                                                            ? <span>{nombresJugadores(e.mejor_jugador_id)}</span> 
                                                            : <span>{nombresJugadores(e.max_goleador_id)}</span>
                                                        }
                                                        
                                                    </EstadisticasTemporadaDetallesItem>
                                                    <EstadisticasTemporadaDetallesItem>
                                                        <p>Maximo goleador</p>
                                                        <span>{`${nombresJugadores(e.max_goleador_id)} (${e.max_goles} goles) `}</span>
                                                    </EstadisticasTemporadaDetallesItem>
                                                </EstadisticasTemporadaDetalles>
                                            </EstadisticasTemporadaDetallesWrapper>
                                            
                                        </EstadisticasTemporada> 
                                    </>
                                ))
                            )
                        }
                    </EstadisticasContainer>
                </ContentUserWrapper>
            </ContentUserContainer>
        </>
    );
}

export default EquipoParticipaciones;
