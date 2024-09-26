import Routes from './routes/Routes';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {

  //Actualizar la pagina si hay una version nueva en el json
  const checkVersion = async () => {
    try {
      const currentVersion = localStorage.getItem('appVersion');
      const response = await fetch('/version.json', { cache: 'no-store' });
      const { version } = await response.json();

      if (currentVersion !== version) {
        localStorage.setItem('appVersion', version);
        window.location.reload(true);
      }
    } catch (error) {
      console.error('Error checking app version:', error);
    }
  }

  useEffect(() => {
    checkVersion();
  }, []);

  return (
    <PrimeReactProvider>
      <Routes />
      <Toaster />
    </PrimeReactProvider>
  );
}

export default App;
