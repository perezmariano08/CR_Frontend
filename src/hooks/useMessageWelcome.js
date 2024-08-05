import { useEffect } from "react";
import toast from "react-hot-toast";

const useMessageWelcome = (userName, showWelcomeToast, setShowWelcomeToast) => {
    //Sacar
    useEffect(() => {
        if (userName && showWelcomeToast) {
            toast(`Bienvenid@, ${userName}`, {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: 'var(--gray-500)',
                    color: 'var(--white)',
                },
                duration: 4000,
                position: 'top-center',
            });
            setShowWelcomeToast(false);
        }
    }, [userName, showWelcomeToast, setShowWelcomeToast]);
}

export default useMessageWelcome