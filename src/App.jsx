import Routes from './routes/Routes'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

function App() {
  return (
    <PrimeReactProvider>
      <Routes/>
    </PrimeReactProvider>
  )
}

export default App
