import styled from "styled-components"

export const HistoryMatchesWrapper = styled.div`
    background-color: var(--gray-400);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    /* min-width: 85%; */
    width: 100%;
`
export const HistoryMatchesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`
export const HistoryTop = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 50px;
    padding: 30px 10px;
    img {
        width: 40px;
    }

    @media (max-width: 568px) {
        gap: 20px;
    }

    @media (max-width: 400px) {
        img {
            display: none;
        }
    }
`
export const HistoryStatsWrapper = styled.div`
    display: flex;
    gap: 60px;
    align-items: center;
    @media (max-width: 768px) {
        gap: 30px;
    }
`

export const HistoryStatsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
`
export const StatsHistory = styled.div`
    background-color: var(--black-800);
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 700;
    @media (max-width: 768px) {
        padding: 10px;
    }
`
export const InfoStats = styled.span`
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
        font-size: 14px;
        color: var(--gray-100);
    }
    p {
        font-size: 12px;
        color: var(--green);
    }
`