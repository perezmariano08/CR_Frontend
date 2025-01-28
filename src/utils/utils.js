import { format, set } from "date-fns";
import { es } from "date-fns/locale";

export const URLImages = "https://coparelampago.com";
export const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://crbackend-production.up.railway.app";

export const formatTime = (time) => {
  if (!time) return "00:00";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

export const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatedDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
};
