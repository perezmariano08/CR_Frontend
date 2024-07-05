import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalStyles } from './styles/GlobalStyles.js'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import AdjustContentHeight from './components/AdjustContentHeight/AdjustContentHeight'
import { AuthProvider } from './Auth/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
          <AdjustContentHeight/>
          <GlobalStyles/>
        </PersistGate>
      </Provider>
    </AuthProvider>
  /* </React.StrictMode>, */
)