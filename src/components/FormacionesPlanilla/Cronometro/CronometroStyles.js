import styled from "styled-components";

export const CronometroWrapper = styled.div`
    top: 40px;
    background: black;
    width: 150px;
    padding: 30px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* flex-direction: column; */
    background-color: var(--gray-400);
    gap: 10px;
    border-radius: 0 0 20px 20px;
    position: fixed;
    width: auto;

    button {
        border: none;
        background-color: var(--gray-400);
        color: var(--green);
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        font-size: 25px;
    }
`
export const CronometroH1 = styled.h1`
    text-align: center;
    color: white;
    font-size: 20px;
    background-color: var(--gray-400);
    /* padding: 10px; */
    border-radius: 10px;
`
export const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`