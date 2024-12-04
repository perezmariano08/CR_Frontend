// export const URL = "https://api-coparelampago.vercel.app"
//export const URL = "https://crbackend-production.up.railway.app"
export const URLImages = "https://coparelampago.com"
export const URL = "http://localhost:3001"


export const formatTime = (time) => {
    if (!time) return '00:00';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

export const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
