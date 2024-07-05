import styled from "styled-components";

export const CronometroContainer = styled.div`
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const CronometroWrapper = styled.div`
    background: black;
    width: 150px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--gray-400);
    gap: 10px;
    border-radius: 0 0 20px 20px;

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
    padding: 10px;
    border-radius: 10px;
`
export const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`