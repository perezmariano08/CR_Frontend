import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardFinalPartido from '../../components/Stats/CardFinalPartido/CardFinalPartido';
import Section from "../../components/Section/Section";
import { MatchStatsContainer, MatchStatsWrapper } from './MatchStatsStyles';
import Alignment from '../../components/Stats/Alignment/Alignment';
import Incidents from '../../components/Stats/Incidents/Incidents';
import Axios from 'axios';
import { URL } from '../../utils/utils';
import { useSelector } from 'react-redux';
import { SpinerContainer } from '../../Auth/SpinerStyles';
import { TailSpin } from 'react-loader-spinner';

const MatchStats = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const partidoId = parseInt(searchParams.get('id'));
    const [formaciones, setFormaciones] = useState(null);
    const [incidencias, setIncidencias] = useState(null);
    const partidos = useSelector((state) => state.partidos.data);
    const partido = partidos.find(p => p.id_partido === partidoId);
    const jugadores = useSelector((state) => state.jugadores.data)
    
    useEffect(() => {
        const fetchFormaciones = async () => {
            try {
                const res = await Axios.get(`${URL}/user/get-partidos-formaciones?id_partido=${partidoId}`);
                setFormaciones(res.data);
            } catch (error) {
                console.error('Error fetching formaciones', error);
            }
        };

        const fetchIncidencias = async () => {
            try {
                const res = await Axios.get(`${URL}/user/get-partidos-incidencias?id_partido=${partidoId}`);
                setIncidencias(res.data);
            } catch (error) {
                console.error('Error fetching incidencias', error);
            }
        };

        if (partidoId) {
            fetchFormaciones();
            fetchIncidencias();
        }
    }, [partidoId]);

    if (!formaciones || !incidencias || !partido) {
    return  <SpinerContainer>
                <TailSpin width='40' height='40' color='#2AD174' />
            </SpinerContainer>
    }

    const { id_equipoLocal, id_equipoVisita } = partido;
    const localTeamId = id_equipoLocal;
    const visitingTeamId = id_equipoVisita;

    const formacionesConNombreApellido = formaciones.reduce((acc, formacion) => {
        const { id_jugador, id_equipo, dorsal, nombre, apellido } = formacion;

        const playerData = {
            id_equipo,
            id_jugador,
            dorsal,
            nombre,
            apellido,
        };

        if (id_equipo === localTeamId) {
            acc.local.push(playerData);
        } else if (id_equipo === visitingTeamId) {
            acc.visitante.push(playerData);
        }

        return acc;
    }, { local: [], visitante: [] });

    return (
        <MatchStatsContainer className='container'>
            <MatchStatsWrapper className='wrapper'>
                <Section>
                    <h2>Ficha de Partido</h2>
                    <CardFinalPartido idPartido={partidoId} incidencias={incidencias} />
                </Section>
                <Alignment formaciones={formacionesConNombreApellido} jugadores={jugadores} partido={partido} />
                <Incidents incidentes={incidencias} formaciones={formacionesConNombreApellido} partidoId={partidoId} />

            </MatchStatsWrapper>
        </MatchStatsContainer>
    );
};

export default MatchStats;
