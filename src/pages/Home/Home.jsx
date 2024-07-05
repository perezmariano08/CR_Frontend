import React, { useEffect, useState } from 'react';
import CardPartido from '../../components/Stats/CardPartido/CardPartido';
import { HomeWrapper, HomeContainerStyled, CardsMatchesContainer, CardsMatchesWrapper } from './HomeStyles';
import Section from '../../components/Section/Section';
import Table from '../../components/Stats/Table/Table';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../../Auth/AuthContext';

const Home = () => {
    const { userName, showWelcomeToast, setShowWelcomeToast } = useAuth();
    
    useEffect(() => {
        if (userName && showWelcomeToast) {
            toast(`Bienvenid@, ${userName}`, {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: 'var(--gray-500)',
                    color: 'var(--white)',
                },
                duration: 4000,
                position: "top-center"
            });
            setShowWelcomeToast(false);
        }
    }, [userName, showWelcomeToast, setShowWelcomeToast]);

    return (
        <>  
            <HomeContainerStyled className='container'>
                <HomeWrapper className='wrapper'>
                    <Section>
                        <h2>Próximo partido</h2>
                        <CardPartido/>
                    </Section>
                    <Section>
                        <h2>Fecha 10 - Apertura 2024</h2>
                        <CardsMatchesContainer>
                            <CardsMatchesWrapper>
                                <CardPartido finished/>
                                <CardPartido finished/>
                                <CardPartido finished/>
                                <CardPartido finished/>
                                <CardPartido finished/>
                                <CardPartido finished/>
                            </CardsMatchesWrapper>
                        </CardsMatchesContainer>
                    </Section>
                    <Section>
                        <h2>Posiciones</h2>
                        <Table/>
                    </Section>
                </HomeWrapper>
            </HomeContainerStyled>
            <Toaster/>
        </> 
    );
}

export default Home;
