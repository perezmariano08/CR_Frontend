import styled from "styled-components";

export const TableContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--gray-400);
  border-radius: 20px;
  overflow: hidden;
  padding: 20px 0;
  gap: 20px;
  width: 100%;
  max-width: 100%;
`;

export const TableTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 25px;
  h3 {
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
  }

  p {
    font-weight: 300;
    font-size: 14px;
    line-height: 14px;
    color: var(--green);
  }
`;

export const Cancha = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  gap: 40px;
  /* background-color: var(--green-500); */
  background-image: url(/public/cancha-chica.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  width: 100%;
  height: 400px;

  @media (max-width: 768px) {
    background-image: url(/public/cancha-mas-chica.png);
  }
`

export const FormationRow = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  @media (max-width: 768px) {
    gap: 90px;
  }
`;

export const Player = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  font-size: 14px;
  color: white;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const TeamLogo = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const GuanteContainer = styled.div`
  position: absolute;
  top: 10;
  right: 120px;
  background-color: var(--green);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: var(--gray-300);
`;
