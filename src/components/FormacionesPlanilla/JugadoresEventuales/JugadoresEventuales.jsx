import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ActionBack, ActionBackContainer, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionTitle, ActionsContainer, ButtonContainer, IconClose, TitleContainer, TitleInputContainer } from '../ActionConfirmed/ActionConfirmedStyles';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft, HiMiniXMark } from "react-icons/hi2";
import Input2 from '../../UI/Input/Input2';
import { toast, LoaderIcon } from 'react-hot-toast';
import { checkPartidosEventual, getEdicion, insertarJugadorEventual, verificarCategoriaJugadorEventual } from '../../../utils/dataFetchers';
import { toggleModal } from '../../../redux/Planillero/planilleroSlice';
import useFetch from '../../../hooks/useFetch';
import userJugadorEventualStates from '../../../hooks/userJugadorEventualStates';

const JugadoresEventuales = ({ partido, formaciones }) => {
    const dispatch = useDispatch();
    const id_categoria = partido.id_categoria;
    const token = localStorage.getItem('token');
    const modal = useSelector((state) => state.planillero.modal);
    const id_equipo = useSelector((state) => state.planillero.id_equipo);
    
    const [loadingDni, setLoadingDni] = useState(false);
    const [loading, setLoading] = useState(false);
    const [foundPlayer, setFoundPlayer] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);
    const [partidosJugados, setPartidosJugados] = useState(0);
    
    const {
        dorsalValue,
        setDorsalValue,
        dniValue,
        setDniValue,
        nameValue,
        setNameValue,
        surNameValue,
        setSurNameValue,
        handleDorsalChange,
        handleDniChange,
        handleNameChange,
        handleSurNameChange} = userJugadorEventualStates();

    const { data: fetchEdicion, loading: loadingEdicion, error: errorEdicion } = useFetch(getEdicion, partido.id_edicion);
    const edicion = fetchEdicion?.[0];

    if (loadingEdicion) {
        return <LoaderIcon />;
    }

    const handleDniBlur = async () => {
        if (dniValue.trim()) {
            setLoadingDni(true);
            try {
                const playerExists = await checkPlayerExists(dniValue.trim(), id_equipo);
                const checkEventual = await checkPartidosEventual(partido.id_partido, dniValue.trim(), token);
                
                if (checkEventual) {
                    setPartidosJugados(checkEventual.partidos_jugados);
                }
                
                if (playerExists.found) {
                    setIsDisabled(true);
                    if (playerExists.matchCategory) {
                        setFoundPlayer(playerExists);
                        setNameValue(playerExists.jugador.nombre);
                        setSurNameValue(playerExists.jugador.apellido);
                        toast.error('El jugador ya existe en esta categoría');
                    } else {
                        setFoundPlayer(playerExists);
                        setNameValue(playerExists.jugador.nombre);
                        setSurNameValue(playerExists.jugador.apellido);
                    }
                } else {
                    setIsDisabled(false);
                    setNameValue('');
                    setSurNameValue('');
                    setFoundPlayer({});
                }
            } catch (error) {
                console.error('Error checking player:', error);
            }
            setLoadingDni(false);
        }
    };

    const checkPlayerExists = async (dni, id_equipo) => {
        try {
            if (id_categoria) {
                const data = await verificarCategoriaJugadorEventual(dni, id_categoria, id_equipo, token);
                return data;
            }
    
        } catch (error) {
            console.error('Error al verificar el jugador eventual:', error);
        }
    };

    const closeModal = () => {
        dispatch(toggleModal());
        clearForm();
    }

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    // !validar la cantidad permitida de jugadores eventuales.
    // !antes de avanzar, validar la cantidad de partidos del jugador eventual.

    const isDorsalInUse = formaciones?.find(f => +f.id_equipo === +id_equipo +f.dorsal === +dorsalValue);
    const isEmptyInputs =
        dorsalValue.trim() === '' || 
        dniValue.trim() === '' || 
        nameValue.trim() === '' || 
        surNameValue.trim() === '';

    const cantidadEventualesPartido = formaciones?.filter(f => f.eventual === 'S' && f.id_equipo === id_equipo && f.dorsal).length;
    const isEnabledCantidadEventuales = cantidadEventualesPartido >= edicion.cantidad_eventuales;

    const handleNext = async () => {

        if (isEmptyInputs) {
            return toast.error('Todos los campos son obligatorios');
        }
        if (isDorsalInUse) return toast.error('Dorsal existente, por favor ingrese otro');

        try {
            setLoading(true);

            const nombreParseado = capitalizeFirstLetter(nameValue.trim());
            const apellidoParseado = capitalizeFirstLetter(surNameValue.trim());

            const data = {
                id_partido: partido.id_partido,
                id_equipo: id_equipo,
                nombre: nombreParseado,
                apellido: apellidoParseado,
                dni: dniValue.trim(),
                dorsal: dorsalValue.trim(),
                estado: 'A',
                eventual: 'S'
            }
    
            const response = await insertarJugadorEventual(data, token);
            if (response.success) { 
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }

            clearForm();
            dispatch(toggleModal())

        } catch (error) {
            console.error('Error creando el jugador eventual', error);
            toast.error('Error al crear el jugador eventual')
        } finally { 
            setLoading(false);
        }
    }

    const clearForm = () => {
        setDorsalValue('');
        setDniValue('');
        setNameValue('');
        setSurNameValue('');
        setPartidosJugados(null);
    }

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    return (
        <>
            {modal === 'jugadorEventual' && (
                <ActionConfirmedContainer onClick={handleOverlayClick}>
                    <ActionConfirmedWrapper>
                        <ActionBackContainer>
                            <ActionBack>
                                <HiArrowLeft onClick={closeModal} />
                                <p>Volver</p>
                            </ActionBack>
                            <IconClose>
                                <HiMiniXMark onClick={closeModal} />
                            </IconClose>
                        </ActionBackContainer>
                        <ActionTitle>
                            <h3>Añadir jugadores eventuales</h3>
                            <AlignmentDivider />
                        </ActionTitle>
                        <TitleContainer>
                            <h3>Cantidad de eventuales permitidos: <span className={isEnabledCantidadEventuales ? 'limite' : ''}>{edicion.cantidad_eventuales} / {cantidadEventualesPartido}</span></h3>
                            <h3>Límite de partidos permitidos por eventual: <span>{partidosJugados} / {edicion.partidos_eventuales} </span></h3>
                        </TitleContainer>
                        <ActionsContainer className='large'>
                            <TitleInputContainer>
                                <p>Dorsal</p>
                                <Input2
                                    value={dorsalValue}
                                    onValueChange={handleDorsalChange}
                                    placeholder={'Ingrese el Dorsal'}
                                    type={'text'}
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                                <p>DNI</p>
                                <Input2
                                    value={dniValue}
                                    onValueChange={handleDniChange}
                                    placeholder={'Ingrese el DNI'}
                                    onBlur={handleDniBlur}
                                    loading={loadingDni}
                                    error={foundPlayer.matchCategory}
                                    success={!foundPlayer.matchCategory}
                                    type={'text'}
                                />
                            </TitleInputContainer>
                            <TitleInputContainer>
                            <p>Nombre</p>
                            <Input2
                                label="Nombre"
                                value={nameValue}
                                onValueChange={handleNameChange}
                                placeholder={'Ingrese el nombre'}
                                disabled={isDisabled}
                                type={'text'}
                                // success={foundPlayer ? !foundPlayer.matchCategory : ''}
                            />
                        </TitleInputContainer>
                        <TitleInputContainer>
                            <p>Apellido</p>
                            <Input2
                                label="Apellido"
                                value={surNameValue}
                                onValueChange={handleSurNameChange}
                                placeholder={'Ingrese el apellido'}
                                disabled={isDisabled}
                                // success={foundPlayer ? !foundPlayer.matchCategory : ''}
                            />
                        </TitleInputContainer>
                        </ActionsContainer>
                        <ButtonContainer>
                            <ActionNext
                                onClick={handleNext}
                                className={foundPlayer.matchCategory || isEmptyInputs || loading || isEnabledCantidadEventuales? 'disabled' : '' || loadingDni ? 'disabled' : ''}
                            >
                                {loading ? <LoaderIcon /> : 'Siguiente'}
                            </ActionNext>
                            {
                                isEnabledCantidadEventuales && (
                                    <p>Llegaste a la cantidad de eventuales permitida en la edición</p>
                                )
                            }
                        </ButtonContainer>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
        </>
    )
}

export default JugadoresEventuales;