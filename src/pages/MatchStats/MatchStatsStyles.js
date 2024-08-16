import styled from "styled-components";

export const MatchStatsContainer = styled.div`
    
`
export const MatchStatsWrapper = styled.div`
    flex-direction: column;
    gap: 40px;
`
export const Navigate = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    p {
        cursor: pointer;
        padding-bottom: 10px;
        position: relative;
        transition: color 0.3s ease;

        &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 0;
            height: 4px;
            background-color: var(--green);
            border-radius: 2px;
            transition: width 0.4s ease, left 0.4s ease;
        }
    }

    .active {
        color: var(--green);

        &::after {
            width: 100%;
            left: 0;
        }
    }
`
