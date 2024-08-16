import styled from "styled-components"

export const HistoryMatchesWrapper = styled.div`
    background-color: var(--gray-300);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    img {
        width: 40px;
    }
`
export const HistoryStatsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

export const HistoryStatsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    gap: 5px;
`
export const StatsHistory = styled.div`
    background-color: var(--gray-400);
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 700;
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