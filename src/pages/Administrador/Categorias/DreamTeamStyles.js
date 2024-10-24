import styled from "styled-components";

export const DreamTeamContainer = styled.section`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: start;
    gap: 20px;
`
export const DreamTeamWrapper = styled.section`
    display: flex;
    width: 100%;
    gap: 10px;
`
export const DreamTeamAlineacion = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--gray-400);
    width: 70%;
    border-radius: 20px;
    overflow: hidden;
    padding: 20px;
    gap: 15px;
`
export const DreamTeamInfo = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    background-color: var(--gray-400);
    width: 30%;
    border-radius: 20px;
    overflow: hidden;
`
export const AlinacionTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 10px;

    a {
        text-decoration: none;
        color: var(--green);
        font-weight: 600;

        &:hover {
            border-bottom: 1px solid var(--green);
        }
    }
`
export const TextLeft = styled.span`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 50%;
`

export const FechaContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    background-color: var(--gray-100);
    color: var(--gray-500);
    border-radius: 10px;
    width: 20%;
    font-weight: 500;
`
export const Alineacion = styled.div`

`

export const CanchaContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
width: 100%;
background: var(--gray-300); /* Fondo gris oscuro */
border-radius: 15px;
padding: 20px;
position: relative;
height: 500px;
`;

export const Linea = styled.div`
display: flex;
justify-content: space-evenly;
align-items: center;
width: 100%;
gap: 10px;
`;

export const Posicion = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
cursor: pointer;
&:hover{
    opacity: .5;
}
`;

export const JugadorPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--gray-300);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const CruzAgregar = styled.div`
  margin-top: 10px;
  font-size: 20px; /* Ajusta el tamaño de la cruz si es necesario */
  color: var(--gray-400);
  background-color: var(--gray-100);
  border-radius: 50%;
  width: 30px; /* Asegura que haya espacio suficiente */
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
`;

/* Líneas específicas para las posiciones */
export const DefensoresLinea = styled(Linea)`
margin-bottom: 80px; /* Espacio más cerca del arquero */
`;

export const MediocampistasLinea = styled(Linea)`
justify-content: space-between;
margin-bottom: 60px;
`;

export const MediocampistaAtrasado = styled(Posicion)`
transform: translateY(30px); /* Colocar más cerca de los defensores */
`;

export const MediocampistasAdelantados = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
`;

export const DelanteroLinea = styled(Linea)`
margin-bottom: 30px; /* El delantero centrado y más adelante */
justify-content: center;
`;

export const JugadoresContainer = styled.div`
    width: 100%;
    max-height: 200px; /* Ajusta esta altura según tus necesidades */
    overflow-y: auto; /* Habilita el scroll vertical */
    overflow-x: hidden; /* Oculta el scroll horizontal si no es necesario */
    border: 1px solid var(--gray-300); /* Opcional: añade un borde para separar visualmente */
    border-radius: 10px; /* Opcional: bordes redondeados */
    background-color: var(--gray-400); /* Opcional: color de fondo */
    padding: 10px; /* Opcional: padding para el contenido */
`;

export const JugadorContainer = styled.div`
    display: flex;
    align-items: center;
    padding-top: 10px;
    gap: 3px;
    cursor: pointer;
    &:hover {
        opacity: .5;
    }
`;

export const JugadorImagen = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
`;

export const JugadorInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

export const JugadorNombre = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-100);
`;

export const JugadorEquipo = styled.span`
    font-size: 12px;
    color: var(--gray-100);
`;

export const InfoTop = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    gap: 17px;

    h2 {
        font-size: 25px;
        font-weight: 600;
    }

    span {
        color: var(--green);
    }
`
export const ExplicativoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    /* padding: 20px; */
    background-color: var(--gray-400);
`

export const Explicativo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding-top: 10px;

    span {
        background-color: var(--gray-100);
        color: var(--gray-500);
        font-weight: 900;
        padding: 10px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        &i,svg {
            color: var(--red);
        }
    }

`

