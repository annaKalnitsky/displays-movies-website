import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { init } from '@noriginmedia/norigin-spatial-navigation'
import './index.scss'
import App from './App.tsx'
import { store } from './store'

init({ shouldFocusDOMNode: true, useGetBoundingClientRect: true })

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
