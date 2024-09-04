import React, { useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner'; // O el spinner que elijas

const ConfirmEmailChange = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Espera 2 segundos para mostrar el loader
    const timer = setTimeout(() => {
      setLoading(false);
      window.close(); // Intenta cerrar la ventana después de mostrar el mensaje
    }, 2500);

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, []);

  return (
    <div>
      {loading ? (
        <SpinerContainer>
          <TailSpin width='40' height='40' color='#2AD174' />
        </SpinerContainer>
      ) : (
        <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}> ✅ Tu email ha sido verificado. Puedes cerrar esta ventana.</h1>
      )}
    </div>
  );
};

export default ConfirmEmailChange;

const SpinerContainer = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    {children}
  </div>
);
