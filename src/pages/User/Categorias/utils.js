const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio", 
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export const nombreMes = (numeroMes) => {
return meses[numeroMes - 1]; 
};