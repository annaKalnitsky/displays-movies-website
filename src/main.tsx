import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { init } from '@noriginmedia/norigin-spatial-navigation'
import './index.scss'
import App from './App.tsx'
import { store } from './store'

init({ shouldFocusDOMNode: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
