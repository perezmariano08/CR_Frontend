import styled from "styled-components";

export const NewWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    min-width: 85%;
    width: 100%;

    h2 {
        font-size: 16px;
        font-weight: 600;
    }
`;

export const NewContainer = styled.div`
    height: 200px;
    overflow: hidden;
    width: 100%;

    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        border-radius: 20px;
    }
`;

export const NewFoot = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;
    gap: 10px; 

    .logo_foot, img {
        width: 15px;
    }

    p {
        font-size: 10px;
        font-weight: 300;
        color: var(--gray-200);
    }
`
export const NewSecondaryWrapper = styled.div`
    display: flex;
    gap: 15px;
    width: 100%;

    img {
        width: 50%;
        border-radius: 20px;
    }
`

export const NewSecondaryImgWrapper = styled(NewContainer)`
    height: 100px;
    width: 300px;
    img {
        width: 100%;
    }
`

export const NewSecondaryInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`