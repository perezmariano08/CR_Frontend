import React, { useState } from 'react';
import { ActionBack, ActionConfirmedContainer, ActionConfirmedWrapper, ActionNext, ActionsContainer, ActionTitle, AssistOptContainer, ButtonContainer, OptionGolContainer } from '../../FormacionesPlanilla/ActionConfirmed/ActionConfirmedStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AlignmentDivider } from '../../Stats/Alignment/AlignmentStyles';
import { HiArrowLeft } from "react-icons/hi";
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';
import { useEquipos } from '../../../hooks/useEquipos';
import { toggleModal } from '../../../redux/Planillero/planilleroSlice';
import { actualizarPartidoVacante, suspenderPartido, updateSancionados } from '../../../utils/dataFetchers';
import { useNavigate } from 'react-router-dom';

const ModalSuspenderPartido = ({ partido }) => {
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const modal = useSelector((state) => state.planillero.modal);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('equipoLocalNoSePresento'); 

    const navigate = useNavigate();

    const { nombresEquipos } = useEquipos();

    const handleModalCancel = () => {
        dispatch(toggleModal());
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleConfirm = async () => {
        setLoading(true);

        let partidoData = {
            id_partido: partido.id_partido,
            estado: '',
            goles_local: null,
            goles_visita: null,
            descripcion: ''
        };

        switch (selectedOption) {
            case 'postergarPartido':
                partidoData.estado = 'A';
                break;

            case 'equipoLocalNoSePresento':
                partidoData.estado = 'S';
                partidoData.goles_local = 0;
                partidoData.goles_visita = 3;
                partidoData.descripcion = `${nombresEquipos(partido.id_equipoLocal)} no se presentó al partido`;
                break;

            case 'equipoVisitaNoSePresento':
                partidoData.estado = 'S'; // Suspendido
                partidoData.goles_local = 3;
                partidoData.goles_visita = 0;
                partidoData.descripcion = `${nombresEquipos(partido.id_equipoVisita)} no se presentó al partido`;
                break;

            default:
                break;
        }

        try {
            const response = await suspenderPartido(token, partidoData);
            await updateSancionados(token);
            await actualizarPartidoVacante(partido.id_partido)
            
            toast.success(response.mensaje);
            handleModalCancel();
        } catch (error) {
            toast.error('Error al suspender el partido');
            console.error('Error al suspender el partido:', error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                navigate('/planillero');
            }, 2000);
        }
    };

    return (
        <>
            {modal === 'modalSuspender' && (
                <ActionConfirmedContainer>
                    <ActionConfirmedWrapper>
                        <ActionBack>
                            <HiArrowLeft onClick={handleModalCancel} />
                            <p>Volver</p>
                        </ActionBack>
                        <ActionTitle>
                            ¿Estás seguro que quieres suspender el partido?
                            <AlignmentDivider />
                        </ActionTitle>
                        <ActionsContainer>
                            <OptionGolContainer>
                                <h4>Marque una opción</h4>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="suspenderPartido"
                                        value="equipoLocalNoSePresento"
                                        checked={selectedOption === "equipoLocalNoSePresento"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="equipoLocalNoSePresento">
                                        <span style={{color: 'var(--green)'}}>{nombresEquipos(partido.id_equipoLocal)}</span> no se presentó
                                    </label>
                                </AssistOptContainer>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="suspenderPartido"
                                        value="equipoVisitaNoSePresento"
                                        checked={selectedOption === "equipoVisitaNoSePresento"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="equipoVisitaNoSePresento">
                                        <span style={{color: 'var(--green)'}}>{nombresEquipos(partido.id_equipoVisita)}</span> no se presentó
                                    </label>
                                </AssistOptContainer>
                                <AssistOptContainer>
                                    <input 
                                        type="radio"
                                        name="suspenderPartido"
                                        value="postergarPartido"
                                        checked={selectedOption === "postergarPartido"}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="postergarPartido">Postergar partido</label>
                                </AssistOptContainer>
                            </OptionGolContainer>
                        </ActionsContainer>
                        <ButtonContainer>
                            {
                                !loading ? (
                                    <ActionNext 
                                        onClick={handleConfirm}
                                        disabled={!selectedOption} // Deshabilita el botón si no hay opción seleccionada
                                    >
                                        Confirmar
                                    </ActionNext>
                                ) : (
                                    <ActionNext className='loader'>
                                        <LoaderIcon />
                                    </ActionNext>
                                )
                            }
                            <ActionNext onClick={handleModalCancel} className="cancel">
                                Cancelar
                            </ActionNext>
                        </ButtonContainer>
                    </ActionConfirmedWrapper>
                </ActionConfirmedContainer>
            )}
            <Toaster />
        </>
    );
}

export default ModalSuspenderPartido;
