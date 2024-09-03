import React from 'react'
import { PerfilContainer, PerfilContentWrapper, PerfilMiEquipo, PerfilMisDatos, PerfilWrapper } from './PerfilStyles'
import { URLImages } from '../../../utils/utils'
import { ModalFormInputContainer } from '../../../components/Modals/ModalsStyles'
import Input from '../../../components/UI/Input/Input'
import { BsCalendar2Event } from 'react-icons/bs'
import useForm from '../../../hooks/useForm'
import { useAuth } from '../../../Auth/AuthContext'

const Perfil = () => {
    const {user} = useAuth()

    // Manejo del form
    const [formState, handleFormChange, resetForm] = useForm({ 
        nombre_usuario: user.nombre,
    });
    const isFormEmpty = !formState.nombre_usuario.trim();
    return (
        <PerfilContainer>
            <PerfilWrapper>
                <PerfilContentWrapper>
                    <h2>Mi equipo favorito</h2>
                    <PerfilMiEquipo>
                        <img src={`${URLImages}/uploads/Equipos/team-default.png`}/>
                        Nombre Equipo
                    </PerfilMiEquipo>
                    <h2>Mis datos</h2>
                    <PerfilMisDatos>
                        <ModalFormInputContainer>
                            nombre
                            <Input 
                                name='nombre_edicion'
                                type='text' 
                                placeholder="Nombre" 
                                icon={<BsCalendar2Event className='icon-input'/>} 
                                value={formState.nombre_usuario}
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            nombre
                            <Input 
                                name='nombre_edicion'
                                type='text' 
                                placeholder="Nombre" 
                                icon={<BsCalendar2Event className='icon-input'/>} 
                            />
                        </ModalFormInputContainer>
                        <ModalFormInputContainer>
                            nombre
                            <Input 
                                name='nombre_edicion'
                                type='text' 
                                placeholder="Nombre" 
                                icon={<BsCalendar2Event className='icon-input'/>} 
                            />
                        </ModalFormInputContainer>
                    </PerfilMisDatos>
                </PerfilContentWrapper>
            </PerfilWrapper>
        </PerfilContainer>
        
    )
}

export default Perfil
