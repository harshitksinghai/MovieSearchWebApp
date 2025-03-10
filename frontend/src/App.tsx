import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import ThemeProviderWrapper from './theme/ThemeProviderWrapper.tsx'
import Footer from './components/Footer.tsx'
import { Provider } from 'react-redux';
import { persistor, store } from './app/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
            <ThemeProviderWrapper>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
              }}>
                <main style={{ flex: '1 0 auto' }}>
                  <Outlet />
                </main>
                <Footer />
              </div>
            </ThemeProviderWrapper>
      </PersistGate>
    </Provider>
  )
}

export default App
