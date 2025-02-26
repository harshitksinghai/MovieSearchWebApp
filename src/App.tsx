import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import ThemeProviderWrapper from './theme/ThemeContext'
import Footer from './components/Footer.tsx'
import { SearchProvider } from './context/SearchContext';

function App() {

  return (
    <SearchProvider>
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
    </SearchProvider>
  )
}

export default App
