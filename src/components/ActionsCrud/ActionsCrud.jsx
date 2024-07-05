import { ActionsCrudContainer } from "./ActionsCrudStyles"

const ActionsCrud = ({children}) => {
    return (
        <ActionsCrudContainer>
            {children}
        </ActionsCrudContainer>
    )
}

export default ActionsCrud