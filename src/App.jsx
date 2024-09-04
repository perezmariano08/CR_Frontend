import Routes from './routes/Routes'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <PrimeReactProvider>
      <Routes/>
      <Toaster /> 
    </PrimeReactProvider>
  )
}

export default App
