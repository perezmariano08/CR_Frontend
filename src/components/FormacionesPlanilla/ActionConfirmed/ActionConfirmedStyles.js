import styled from "styled-components";

export const ActionConfirmedContainer = styled.div`
    position: fixed;
    top: 40px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`
export const ActionConfirmedWrapper = styled.div`
    width: 60%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background: var(--gray-300);
    border-radius: 15px;
    align-items: start;
    gap: 25px;
`
export const ActionTitle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    p {
        font-size: 12px;
        color: var(--gray-200);
    }
`

export const ActionsContainer = styled.div`
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: 15px;

    &.large {
        width:100%;
    }
`

export const OptionGolWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`

export const OptionGolContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`

export const ActionOptionContainer = styled.div`
    display: flex;
    gap: 3px;
    p {
        font-size: 14px;
        font-weight: 500;
    }

    input {
        display: inline-block;
        width: 15px;
        border-radius: 50%;
        border: 2px solid #666;
        position: relative;
        margin-right: 5px;
        cursor: pointer;
    }

`
export const ActionNext = styled.button`
    display: flex;
    padding: 10px 12px;
    gap: 10px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    background-color: var(--green);
    color: var(--white);
    height: fit-content;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    background: var(--green);
    
    &.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
}
`
export const ActionBack = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;

    p {
        font-size: 13px;
    }

    &i,svg {
        color: var(--green);
        cursor: pointer;
    }
`
export const ActionBackContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width:100%;
    align-items: center;
`
export const IconClose = styled.div`
    color: var(--red);
    cursor: pointer;
`

export const AssistOptContainer = styled.div`
    display: flex;
    gap: 5px;
`
export const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
`
export const ErrorTextContainer = styled.div`
    display: flex;
    font-size: 12px;
    align-items: center;
    gap: 5px;
    color: var(--red);
`
export const TitleInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
    width: 100%;

    p {
        font-size: 12px;
    }
`