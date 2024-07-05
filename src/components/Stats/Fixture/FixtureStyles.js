import styled from "styled-components";

export const FixtureWrapper = styled.div`
    background-color: var(--gray-300);
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    border-radius: 20px;
    min-width: 85%;
`
export const FixtureTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
    padding: 0px 20px 10px 20px;
    width: 100%;
    h3 {
        font-weight: 600;
        font-size: 12px;
        line-height: 12px;
    }

    p {
        font-weight: 300;
        font-size: 8px;
        line-height: 8px;
        color: var(--green);
    }
`
export const FixtureMatch = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    gap: 5px;
`
export const FixtureMatchTeam = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: start;
    gap: 3px;
    min-width: 100px;
    h4 {
        font-size: 14px;
        font-weight: 500;
    }
    img {
        height: 30px;
    }
    &.visit {
        text-align: end;
    }
`
export const FixtureMatchInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h5 {
        font-size: 14px;
        font-weight: 600
    }
    p{
        font-size: 10px;
        font-weight: 400;
        color: var(--green);
    }
`