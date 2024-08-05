import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getFormaciones, getIndicencias } from '../utils/dataFetchers.js';
import { setCurrentStateModal, setDescOfTheMatch, toggleHiddenModal, toggleIdMatch } from '../redux/Planillero/planilleroSlice.js';
import { fetchPartidos } from '../redux/ServicesApi/partidosSlice.js';
import { alignmentTeamToFinish } from '../pages/Planillero/Planilla/helpers.js';
import { toggleStateMatch } from '../redux/Matches/matchesSlice.js';

export const usePlanilla = (partidoId) => {
    const dispatch = useDispatch();
    const partidos = useSelector((state) => state.match);
    const match = useSelector((state) => state.partidos.data);

    const [partido, setPartido] = useState(null);
    const [matchCorrecto, setMatchCorrecto] = useState(null);
    const [canStartMatch, setCanStartMatch] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [bdFormaciones, setBdFormaciones] = useState(null);
    const [bdIncidencias, setBdIncidencias] = useState(null);

    useEffect(() => {
        dispatch(toggleIdMatch(partidoId));
    }, [dispatch, partidoId]);

    useEffect(() => {
        dispatch(fetchPartidos());
    }, [dispatch]);

    useEffect(() => {
        if (partidos.length) {
            const foundPartido = partidos.find(p => p.ID === partidoId);
            setPartido(foundPartido);
            const foundMatch = match.find(p => p.id_partido === partidoId);
            setMatchCorrecto(foundMatch);

            if (foundPartido) {
                const localPlayers = foundPartido.Local.Player.filter(player => player.status);
                const visitantePlayers = foundPartido.Visitante.Player.filter(player => player.status);
                setCanStartMatch(localPlayers.length >= 5 && visitantePlayers.length >= 5);
            }
        }
    }, [partidos, match, partidoId]);

    useEffect(() => {
        if (partidoId) {
            getFormaciones(partidoId)
                .then((data) => setBdFormaciones(data))
                .catch((error) => console.error('Error en la petición', error));

            getIndicencias(partidoId)
                .then((data) => setBdIncidencias(data))
                .catch((error) => console.error('Error en la petición', error));
        }
    }, [partidoId]);

    const handleChange = (event) => {
        setDescripcion(event.target.value);
    };

    const handleStartMatch = () => {
        if (canStartMatch) {
            if (matchCorrecto.matchState === 'isStarted') {
                dispatch(toggleHiddenModal());
                dispatch(setCurrentStateModal('matchFinish'));
            } else {
                dispatch(toggleStateMatch(partidoId));
            }
        } else {
            toast.error('Debe haber un mínimo de 5 jugadores por equipo registrados para comenzar');
        }
    };

    const pushInfoMatch = () => {
        dispatch(toggleHiddenModal());
        dispatch(setDescOfTheMatch(descripcion));
        dispatch(setCurrentStateModal('matchPush'));
    };

    const handleToastStartMatch = () => {
        if (canStartMatch) {
            toast.success('Partido comenzado', {
                duration: 4000,
            });
        }
    };

    const formacionesConNombreApellido = partido && bdFormaciones ? alignmentTeamToFinish(partido, bdFormaciones) : null;

    return {
        partido,
        matchCorrecto,
        canStartMatch,
        descripcion,
        bdFormaciones,
        bdIncidencias,
        handleChange,
        handleStartMatch,
        pushInfoMatch,
        handleToastStartMatch,
        formacionesConNombreApellido,
    };
};
