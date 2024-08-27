import styled from "styled-components";

export const FixtureWrapper = styled.div`
    background-color: var(--gray-300);
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
`;

export const FixtureTop = styled.div`
    display: flex;
    width: 100%;
    /* justify-content: space-between; */
    align-items: start;
`;

export const FixtureTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
    padding: 0px 20px 10px 20px;
    width: 100%;
    h3 {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
    }

    p {
        font-weight: 300;
        font-size: 10px;
        line-height: 8px;
        color: var(--green);
    }
`;

export const NavigateFixture = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    width: 50%;
    gap: 5px;

    h3 {
        font-size: 14px;
        /* margin: 0 16px; */
        /* flex: 1; */
        /* text-align: center; */
    }
`;

export const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 40px; */
    width: 20%;

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        color: var(--green);
    }
`;

export const FixtureMatch = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    cursor: pointer;
`;

export const FixtureMatchTeam = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: end;
    gap: 5px;
    min-width: 100px;
    width: 100%;
    h4 {
        font-size: 12px;
        font-weight: 300;
        width: 100%;
    }
    img {
        height: 30px;
    }
    &.visit {
        text-align: start;
    }
`;

export const FixtureMatchInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    h5 {
        font-size: 17px;
        font-weight: 600;
    }
    p{
        font-size: 12px;
        font-weight: 400;
        color: var(--green);
    }
`;

export const FixtureTitleDivider = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--gray-200);
`